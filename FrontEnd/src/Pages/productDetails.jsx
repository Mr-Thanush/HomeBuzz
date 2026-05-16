import React, { useEffect, useState } from "react";
import Navbar from "../Components/navBar";
import { BsBookmarkHeart } from "react-icons/bs";
import "../Styles/productDetails.css";
import Ratings from "../Components/ratings";
import { useDispatch, useSelector } from "react-redux";
import {createReview,getProductDetails,removeErrors,removeSuccess} from "../Components/features/Products/productSlice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Components/loader";
import PageTitle from "../Components/pageTitle";
import {addToLikeList,removeError,removeMessage} from "../Components/features/Like/likeSlice";
import ProductImages from "../Components/productImage";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [addRating, setAddRating] = useState(false);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState("");
  const {loading,error,product,reviewSuccess,reviewLoading} = useSelector((state) => state.product);

  const {loading: likeLoading,error: likeError, message,success} = useSelector((state) => state.like);

  useEffect(() => {
    if (id) dispatch(getProductDetails(id));
    return () => dispatch(removeErrors());
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }

    if (likeError) {
      toast.error(likeError, { position: "top-center", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error, likeError]);

  useEffect(() => {
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review Submitted Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      setUserRating(0);
      setComment("");
      setAddRating(false);
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [dispatch, reviewSuccess, id]);

  const handleIncrement = () => {
    if (quantity >= product.stock) {
      toast.error(`Only ${product.stock} Items Available`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      toast.error("Quantity Cannot Be Zero", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setQuantity((q) => q - 1);
  };

  const handleAddToLikeList = () => {
    dispatch(addToLikeList({ id, quantity }));
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();

    if (!userRating) {
      toast.error("Please Select a Rating", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    dispatch(
      createReview({
        rating: userRating,
        comment,
        productId: id,
      })
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <PageTitle title="Product Details" />
      </>
    );
  }

  // useEffect(()=>{
  // if(product && product.image && product.image.length>0){
  //   setSelectedImg(product.image[0].url);
  // }
  // },[product]);


  return (
    <div className="product">
      <Navbar />
      <PageTitle title={`${product.name} - Details`} />

      <div className="productContainer">
        <div className="productActions">
          <button
            className="likeButton"
            onClick={handleAddToLikeList}
            disabled={likeLoading || product.stock <= 0}>
            <BsBookmarkHeart className="icon like" />
          </button>

          <span className="rating">
            <Ratings value={product.ratings} disabled={true} />
          </span>

          <p className="noOfReviews">
            ({product.reviews?.length || 0}) Reviews
          </p>
        </div>

        <div className="productImage">
      <ProductImages product={product}/>
    </div>
      <div className="productDetails">
          <p className="productBrand">Brand Name</p>
          <p className="productName">{product.name}</p>
          <p className="productDiscription">{product.description}</p>

          <p className="productPrice">
            <b>₹{product.price}</b>
            <span className="originalPrice">₹999</span>
          </p>

          <p
            className={
              product.stock <= 0 ? "outOfStock" : "productStock"
            }
          >
            {product.stock > 0
              ? `In Stock (${product.stock} Available)`
              : "Out Of Stock"}
          </p>

          {product.stock > 0 && (
            <div className="productQuantity">
              <span className="quantity-label">Quantity:</span>
              <button className="quantity-button" onClick={handleDecrement}>
                -
              </button>
              <input
                type="Number"
                value={quantity}
                readOnly
                className="Quantity"
              />
              <button className="quantity-button" onClick={handleIncrement}>
                +
              </button>
            </div>
          )}

          {/* <div className="productFullDetails">
            <p className="productUsedItemsForMaking">
              <b>Used to Made:</b>
              <span className="items">{product.madeUpOf}</span>
            </p>
            <p className="productSize">
              <b>Quantity/pack:</b>
              <span className="sizes">{product.quantity}</span>
            </p>
            <p className="productContainerType">
              <b>Container Type:</b>
              <span className="expires">{product.containerType}</span>
            </p>
            <p className="productPreferrence">
              <b>Food Type:</b>
              <span className="expires">{product.foodType}</span>
            </p>
            <p className="productExpire">
              <b>Expires:</b>
              <span className="expires">
                {product.expireDate.slice(0, 10)}
              </span>
            </p>
          </div> */}

         {product.returnPolicy && <p className="productReturn">Return Policy</p>}
        </div>
      </div>

      <div className="productContainer2">
        <form className="ratings" onSubmit={handleRatingSubmit}>
          <div className="submitedReviews">
            <h2>
              Reviews
              <span
                className="clickToWriteReviews"
                onClick={() => setAddRating(!addRating)}
              >
                {addRating ? "×" : "+"}
              </span>
            </h2>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviewsCard">
                {product.reviews.map((review, index) => (
                  <div className="review" key={index}>
                    <h3 className="reviewerName">{review.name}</h3>
                    <div className="reviewHead">
                      <Ratings value={review.rating} disabled={true} />
                    </div>
                    <p className="reviewDiscription">
                      Comment:
                      <span className="Comment">
                        {review.comment}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="noReviews">
                This Product Hasn't Been Reviewed Yet. Share Your Experience
              </p>
            )}
          </div>

          <div className="giveReview">
            {addRating && (
              <div className="addReviewForm">
                <hr />
                <h2>Write Review</h2>
                <Ratings
                  value={userRating}
                  disabled={false}
                  onRatingChange={setUserRating}
                />
                <textarea
                  className="writingReview"
                  placeholder="Write Your Review Here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button>
                  {reviewLoading ? "Submitting...." : "Submit"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="WhatsAppButton">What's App 💬</div>
       <Link to='/signin?redirect=/shipping'> <div className="buyButton">Buy Now</div></Link>
      </div>
    </div>
  );
}

export default ProductDetails;