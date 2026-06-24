import express from "express"
import { adminProducts, allProducts, CreateAndUpdateReviewProduct, createProduct, deleteProduct, deleteReview, getAllReviewsOfProduct, sellerProducts, singleProduct, updateProduct } from "../Controller/ProductController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleWare/userAuth.js"
import { upload } from "../middleWare/multer.js";
import { isApprovedSeller } from "../middleWare/sellerApproval.js";

const router=express.Router();

router.route('/products').get(allProducts);

router.route('/seller/products').get(verifyUserAuth, roleBasedAccess("seller", "admin"), isApprovedSeller, sellerProducts);
router.route("/admin/products").get(verifyUserAuth, roleBasedAccess("admin"), adminProducts);

router.route('/seller/product/create').post(
  verifyUserAuth,
  roleBasedAccess("seller", "admin"),
  isApprovedSeller,
  upload.array("image", 5),
  createProduct
);

router.route('/seller/product/:id')
  .put(
    verifyUserAuth,
    roleBasedAccess("seller", "admin"),
    isApprovedSeller,
    upload.array("image", 5),
    updateProduct
  )
  .delete(verifyUserAuth, roleBasedAccess("seller", "admin"), isApprovedSeller, deleteProduct);

router.route('/product/:id').get(singleProduct);  
router.route('/review').put(verifyUserAuth,CreateAndUpdateReviewProduct); 
router.route('/seller/reviews').get(verifyUserAuth,roleBasedAccess("seller","admin"),getAllReviewsOfProduct, isApprovedSeller)
.delete(verifyUserAuth,roleBasedAccess("seller","admin"),deleteReview, isApprovedSeller); 


 
export default router;
