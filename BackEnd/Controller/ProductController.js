import handleAsyncError from "../middleWare/handleAsyncError.js";
import Product from "../Models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import handleError from "../utils/handleError.js";
import cloudinary from "../config/cloudinary.js";
import { mysqlPool } from "../config/db.js";

// Database Hydrator Helper to join MySQL Seller row structures onto Mongoose Product instances
const hydrateSellersForProducts = async (products) => {
    const productArr = Array.isArray(products) ? products : [products];
    if (productArr.length === 0) return products;

    const sellerIds = [...new Set(productArr.map(p => p.seller).filter(Boolean))];
    if (sellerIds.length === 0) return products;

    // Fetch batch profile rows from MySQL
    const [sellers] = await mysqlPool.query("SELECT id, name, email, store_name, seller_status FROM users WHERE id IN (?)", [sellerIds]);
    const sellerMap = sellers.reduce((acc, row) => {
        acc[row.id] = {
            _id: row.id,
            id: row.id,
            name: row.name,
            email: row.email,
            sellerInfo: { storeName: row.store_name, status: row.seller_status }
        };
        return acc;
    }, {});

    const processed = productArr.map(prod => {
        const pObj = prod.toObject ? prod.toObject() : prod;
        pObj.seller = sellerMap[pObj.seller] || pObj.seller;
        return pObj;
    });

    return Array.isArray(products) ? processed : processed[0];
};

// Create Product
export const createProduct = handleAsyncError(async (req, res, next) => {
    const imageLinks = [];
    if (!req.files?.length) {
        return res.status(400).json({ success: false, message: "Please upload at least one image" });
    }

    for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "Products" }
        );
        imageLinks.push({ image_Id: result.public_id, url: result.secure_url });
    }

    req.body.image = imageLinks;
    req.body.user = req.user.id;   // Numeric MySQL identifier
    req.body.seller = req.user.id; // Numeric MySQL identifier
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});

// Update Product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new handleError("Product Not Found", 404));

    if (req.files && req.files.length > 0) {
        if (Array.isArray(product.image)) {
            for (const img of product.image) {
                try {
                    await cloudinary.uploader.destroy(img.image_Id);
                } catch (err) {
                    console.warn("Failed to delete cloudinary image", img.image_Id, err.message);
                }
            }
        }

        const imageLinks = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                { folder: "Products" }
            );
            imageLinks.push({ image_Id: result.public_id, url: result.secure_url });
        }
        req.body.image = imageLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        product
    });
});

// Delete Product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new handleError("Product Not Found", 404));

    if (Array.isArray(product.image)) {
        for (const img of product.image) {
            try {
                await cloudinary.uploader.destroy(img.image_Id);
            } catch (err) {
                console.warn("Failed to delete cloudinary image", img.image_Id, err.message);
            }
        }
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});

// Get All Products (Hyperlocal Layer ready)
export const allProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const apifunctionality = new APIFunctionality(Product.find(), req.query).search().filter();
    
    const filteredQuery = apifunctionality.query.clone();
    const productCount = await filteredQuery.countDocuments();
    const pages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > pages && productCount > 0) {
        return next(new handleError(`This Page Doesn't Exist`, 404));
    }

    apifunctionality.pagination(resultPerPage);
    const products = await apifunctionality.query;
    const hydratedProducts = await hydrateSellersForProducts(products);

    res.status(200).json({
        success: true,
        products: hydratedProducts,
        productCount,
        resultPerPage,
        pages,
        currentPage: page
    });
});

// Get Single Product
export const singleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new handleError("Product Not Found", 404));

    const hydratedProduct = await hydrateSellersForProducts(product);

    res.status(200).json({
        success: true,
        product: hydratedProduct
    });
});

// Get Admin Products
export const adminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    const hydratedProducts = await hydrateSellersForProducts(products);

    res.status(200).json({
        success: true,
        products: hydratedProducts
    });
});

// Get Seller Products
export const sellerProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find({ seller: req.user.id });
    const hydratedProducts = await hydrateSellersForProducts(products);

    res.status(200).json({
        success: true,
        products: hydratedProducts
    });
});

// Create/Update Reviews
export const CreateAndUpdateReviewProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id, // MySQL Int representation
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    if (!product) return next(new handleError("Product Not Found", 404));

    const reviewExist = product.reviews.find(r => r.user.toString() === req.user.id.toString());
    if (reviewExist) {
        product.reviews.forEach(r => {
            if (r.user.toString() === req.user.id.toString()) {
                r.rating = rating;
                r.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
    }
    product.noOfReviews = product.reviews.length;

    let sum = 0;
    product.reviews.forEach(r => { sum += r.rating; });
    product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review Added Successfully"
    });
});

// Get All Reviews
export const getAllReviewsOfProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new handleError("Product Not Found", 404));

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

// Delete Review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new handleError("Product Not Found", 404));

    const reviews = product.reviews.filter(r => r._id.toString() !== req.query.id.toString());

    let sum = 0;
    reviews.forEach(r => { sum += r.rating; });
    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const noOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        noOfReviews
    }, { new: true, runValidators: true });

    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully"
    });
});