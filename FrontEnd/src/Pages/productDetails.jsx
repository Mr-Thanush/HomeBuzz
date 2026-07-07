import React, { useEffect, useState } from "react";
import Navbar from "../Components/navBar.jsx";
import { BsBookmarkHeart } from "react-icons/bs";
import Ratings from "../Components/ratings.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createReview, getProductDetails, removeErrors, removeSuccess } from "../Components/features/Products/productSlice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Components/loader.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import { addToLikeList, removeError, removeMessage } from "../Components/features/Like/likeSlice";
import ProductImages from "../Components/productImage.jsx";
import "../Styles/productDetails.css";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [addRating, setAddRating] = useState(false);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
  const { loading: likeLoading, error: likeError, message, success: likeSuccess } = useSelector((state) => state.like);

  useEffect(() => {
    if (id) dispatch(getProductDetails(id));
    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (likeError) {
      toast.error(likeError, { position: "top-center", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, likeError]);

  useEffect(() => {
    if (likeSuccess && message) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [dispatch, likeSuccess, message]);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review Submitted Successfully", { position: "top-center", autoClose: 3000 });
      setUserRating(0);
      setComment("");
      setAddRating(false);
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    }
  }, [dispatch, reviewSuccess, id]);

  const handleIncrement = () => {
    if (quantity >= product?.stock) {
      toast.error(`Only ${product.stock} items available in inventory`, { position: "top-center", autoClose: 3000 });
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      toast.error("Quantity selection cannot be zero", { position: "top-center", autoClose: 3000 });
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
      toast.error("Please provide a valid metric star score rating", { position: "top-center", autoClose: 3000 });
      return;
    }
    dispatch(createReview({ rating: userRating, comment, productId: id }));
  };

  if (loading) {
    return (
      <div className="pd-loading-layout">
        <Navbar />
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-empty-layout">
        <Navbar />
        <PageTitle title="Product Context Not Found" />
        <div className="pd-error-message">
          <p>The requested product profile could not be retrieved.</p>
          <Link to="/" className="pd-back-link">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page-wrapper">
      <Navbar />
      <PageTitle title={`${product.name || "Items"} - Details | HomeBuzz`} />

      <main className="product-details-container-main">
        {/* Card Main Block Box Left */}
        <div className="productContainer">
          <div className="productActions">
            <button
              className="likeButton"
              onClick={handleAddToLikeList}
              disabled={likeLoading || product.stock <= 0}
              aria-label="Save product selection"
            >
              <BsBookmarkHeart className="icon like" />
            </button>
            <div className="rating-summary-row">
              <Ratings value={product.ratings || 0} disabled={true} />
              <span className="noOfReviews">({product.reviews?.length || 0} customer reviews)</span>
            </div>
          </div>

          <div className="productImage">
            <ProductImages product={product} />
          </div>

          <div className="productDetails">
            <span className="productBrand">{product.brand || "HomeBuzz Original"}</span>
            <h1 className="productName">{product.name}</h1>
            <p className="productDiscription">{product.description}</p>

            <div className="productPriceBlock">
              <span className="productPrice">₹{(product.price || 0).toFixed(2)}</span>
              {product.originalPrice && (
                <span className="originalPrice">₹{Number(product.originalPrice).toFixed(2)}</span>
              )}
            </div>

            <p className={`stock-status-text ${product.stock <= 0 ? "outOfStock" : "productStock"}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} Available)` : "✕ Out Of Stock"}
            </p>

            {product.stock > 0 && (
              <div className="productQuantity">
                <span className="quantity-label">Quantity:</span>
                <div className="qty-stepper-wrapper">
                  <button type="button" className="quantity-button" onClick={handleDecrement}>-</button>
                  <input type="text" value={quantity} readOnly className="Quantity" aria-label="Selected count" />
                  <button type="button" className="quantity-button" onClick={handleIncrement}>+</button>
                </div>
              </div>
            )}

            {product.returnPolicy && <p className="productReturn">✓ 7-Day Free Replacement Policy Guard</p>}

            {/* =========================================================
                NEW: PRODUCT SPECIFICATIONS MATRIX BLOCK
               ========================================================= */}
            <div className="productSpecsBlock">
              <h3 className="specsTitle">Product Specifications</h3>
              <table className="specsTable">
                <tbody>
                  <tr>
                    <td><strong>Origin (Made In):</strong></td>
                    <td>{product.madeIn || "India"}</td>
                  </tr>
                  <tr>
                    <td><strong>Net Quantity:</strong></td>
                    <td>{product.quantityPerUnit || product.volume || "1 Bottle / Pack"}</td>
                  </tr>
                  {product.category && (
                    <tr>
                      <td><strong>Category:</strong></td>
                      <td>{product.category}</td>
                    </tr>
                  )}
                  {product.weight && (
                    <tr>
                      <td><strong>Item Weight:</strong></td>
                      <td>{product.weight}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card Block Lower Secondary Reviews Panels */}
        <div className="productContainer2">
          <div className="submitedReviews">
            <div className="reviews-header-row">
              <h2>Customer Testimonials</h2>
              <button
                type="button"
                className="clickToWriteReviews"
                onClick={() => setAddRating(!addRating)}
                aria-label="Toggle review window parameters"
              >
                {addRating ? "Close Form ×" : "Write Review +"}
              </button>
            </div>

            {addRating && (
              <form className="giveReview addReviewForm" onSubmit={handleRatingSubmit}>
                <h3>Share Your Experience</h3>
                <div className="rating-input-line">
                  <span>Select Score Rating:</span>
                  <Ratings value={userRating} disabled={false} onRatingChange={setUserRating} />
                </div>
                <textarea
                  className="writingReview"
                  placeholder="What did you like or dislike? Share comprehensive application parameters..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button type="submit" className="submit-review-action-btn" disabled={reviewLoading}>
                  {reviewLoading ? "Submitting review..." : "Publish Review"}
                </button>
              </form>
            )}

            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviewsCard">
                {product.reviews.map((review, index) => (
                  <article className="review" key={review._id || index}>
                    <h4 className="reviewerName">{review.name || "Verified Purchase User"}</h4>
                    <div className="reviewHead">
                      <Ratings value={review.rating} disabled={true} />
                    </div>
                    <p className="reviewDiscription">
                      <strong>Comment:</strong> <span className="Comment">{review.comment}</span>
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="noReviews">This product hasn't received reviews yet. Be the first to build insight records!</p>
            )}
          </div>
        </div>

        {/* Persistent Bottom Mobile Navigation Anchors Blocks handles */}
        <div className="pd-mobile-sticky-action-bar">
          <a
            href={`https://wa.me/919999999999?text=Hi, I am interested in purchasing ${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="WhatsAppButton"
          >
            Chat via WhatsApp 💬
          </a>
          <Link to="/signin?redirect=/shipping" className="buyButton">
            Instant Purchase Now
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;