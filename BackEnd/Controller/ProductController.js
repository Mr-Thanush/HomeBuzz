import handleAsyncError from "../middleWare/handleAsyncError.js";
import Product from "../Models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import handleError from "../utils/handleError.js";
import cloudinary from "../config/cloudinary.js";

//CREATE PRODUCT
export const createProduct = handleAsyncError(async (req, res, next) => {
    const imageLinks=[];
    if (!req.files?.length) {
  return res.status(400).json({
    success: false,
    message: "Please upload at least one image"
  });

}

    for(const file of req.files){
        const result=await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            {folder:"Products"});

            imageLinks.push({
                image_Id:result.public_id,
                url:result.secure_url
            })
    }

    req.body.image=imageLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

//UPDATE PRODUCT
export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new handleError("Product Not Found", 404))
    }
    let images=[];
    if(typeof req.body.image==="String"){
        images.push(req.body.image)
    }else if(Array.isArray(req.body.image)){
        images=req.body.image
    }

    if(images.length>0){
    for(let i=0;i<product.images.length;i++){
        await cloudinary.uploader.destroy(product.image[i].image_Id);
    }

    //Upload New Images 
      for(const file of req.files){
        const result=await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            {folder:"Products"});

            imageLinks.push({
                image_Id:result.public_id,
                url:result.secure_url
            })
    }
     req.body.image=imageLinks;

    }
   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    

    res.status(200).json({
        success: true,
        product
    })

});

//DELETE PRODUCT
export const deleteProduct = handleAsyncError(async (req, res, next) => {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new handleError("Product Not Found", 404))
    }

    for(let i=0;i<product.image.length;i++){
       await cloudinary.uploader.destroy(product.image[i].image_Id)
    }
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })

}
);

//GET ALL PRODUCTS
export const allProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const apifunctionality = new APIFunctionality(Product.find(), req.query).search().filter();
    //getting filtered query before pagination
    const filteredQuery = apifunctionality.query.clone();
    const productCount = await filteredQuery.countDocuments();

    //Calculate pages based of filtered query
    const pages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > pages && productCount > 0) {
        return next(new handleError(`This Page Does't Exists`, 404));
    }
    //Apply Pagination
    apifunctionality.pagination(resultPerPage);
    const products = await apifunctionality.query;
    if (!products || products.length === 0) {
        return next(new handleError(`Product Not Found`, 404));
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        pages,
        currentPage:page
    })
});

//GET SINGLE PRODUCT
export const singleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new handleError("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })

});

//GET ALL PRODUCT FOR ADMIN
export const adminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})

//GET ALL PRODUCT FOR SELLER
export const sellerProducts=handleAsyncError(async(req,res,next)=>{
    const products=await Product.find();
    
    res.status(200).json({
        success: true,
        products
    })
})


//CREATE/UPDATE REVIEWS  PRODUCT
export const CreateAndUpdateReviewProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if(!product){
        return next(new handleError("Product Not Found",404))
    }

    const reviewExist = product.reviews.find(review => review.user.toString() === req.user.id.toString());
    if (reviewExist) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.rating = rating;
                review.comment = comment;
            }
        })

    } else {
        product.reviews.push(review);
       
    }
     product.noOfReviews = product.reviews.length;

    let sum = 0;
    product.reviews.forEach(review => {
        sum += review.rating;
    })

    product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });


    res.status(200).json({
        success: true,
        message: "Review Added Successfully"
    })
})

//GET ALL REVIEWS OF A PRODUCT
export const getAllReviewsOfProduct=handleAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        return next(new handleError("Product Not Found",404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })

})


//DELETE REVIEW
export const deleteReview=handleAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);
    if(!product){ 
        return next(new handleError("Product Not Found",404))
    }

    const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString());

    let sum=0;
    product.reviews.forEach(review => {
        sum += review.rating;
    })

    const ratings=reviews.length > 0 ? sum /reviews.length : 0;
    const noOfReviews=reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        noOfReviews
    },{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success: true,
        message:"Review Deleted Successfully"
    })

})