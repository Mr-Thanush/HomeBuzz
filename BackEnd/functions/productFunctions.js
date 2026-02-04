import Product from "../Models/productModel.js";
import handleError from "../utils/handleError.js";
import asyncErrors from "../MiddleWare/asyncErrors.js";
import APIFunctionality from "../utils/apiFunct.js";

// 1. CREATE PRODUCT (SELLER)
export const crateProduct = asyncErrors(async (req, res, next) => {
  const { name, price, category, stock, discription, brand, about, discount } = req.body;

  if (!req.user) return next(new handleError("User not found", 401));

  const product = await Product.create({
    name,
    discription,
    price,
    category,
    stock,
    brand: brand || "Brand",
    about: about || "No description",
    discount: discount || 0,
    user: req.user._id,
    images: [],
  });

  res.status(201).json({ success: true, product });
});

// 2. PUBLIC GET ALL PRODUCTS
export const getAllProducts = asyncErrors(async (req, res, next) => {
  const resultPerPage = 20;

  const apiFeature = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  const filteredQuery = apiFeature.query.clone();
  const productCount = await filteredQuery.countDocuments();

  apiFeature.pagenation(resultPerPage);
  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

// 3. GET SINGLE PRODUCT
export const SingleAccessingProduct = asyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new handleError("Product not found", 404));

  res.status(200).json({ success: true, product });
});

// 4. SELLER: GET ALL OWN PRODUCTS
export const getSellerProducts = asyncErrors(async (req, res, next) => {
  const products = await Product.find({ user: req.user._id });
  res.status(200).json({ success: true, products });
});

// 5. UPDATE PRODUCT
export const updateProducts = asyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new handleError("Product not found", 404));

  if (product.user.toString() !== req.user._id.toString())
    return next(new handleError("Unauthorized", 403));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

// 6. DELETE PRODUCT
export const deleteProduct = asyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new handleError("Product not found", 404));

  if (product.user.toString() !== req.user._id.toString())
    return next(new handleError("Unauthorized", 403));

  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product deleted successfully" });
});
// 6  CREATE / UPDATE REVIEW
export const createAndUpdateReview = asyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new handleError("Product not found", 404));
  }

  const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
  }

  product.noOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});


// 7  GET PRODUCT REVIEWS
export const getProductReviews = asyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new handleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});


// 8 DELETE REVIEW
export const deletingReview = asyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new handleError("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  const ratings =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    noOfReviews: reviews.length,
  });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
