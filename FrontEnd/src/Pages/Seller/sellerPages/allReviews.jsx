import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import PageTitle from "../../../Components/pageTitle";
import Loader from '../../../Components/loader';
import Ratings from '../../../Components/ratings';
import { fetchSellerProducts, fetchProductReviews, removeErrors, deleteProductReview, removeSuccess, removeMessage } from '../../../Components/features/AdminSeller/sellerSlice';

export default function AllReviews() {
  const dispatch = useDispatch();
  const { products = [], reviews = [], loading, error, success, message } = useSelector(state => state.seller || {});
  const [activeProductId, setActiveProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const handleToggle = (productId) => {
    if (activeProductId === productId) {
      setActiveProductId(null);
    } else {
      setActiveProductId(productId);
      dispatch(fetchProductReviews(productId));
    }
  };

  const handleDeleteReview = (productId, reviewId) => {
    if (window.confirm("Are you sure you want to drop this consumer feedback review score?")) {
      dispatch(deleteProductReview({ productId, reviewId }));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message || "Review status mutated.", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(removeMessage());
      dispatch(fetchSellerProducts());
      setActiveProductId(null);
    }
  }, [dispatch, error, success, message]);

  return (
    <>
      <PageTitle title="Product Reviews" />
      <section className="seller-view-wrapper">
        <div className="view-header-row">
          <h1 className="view-main-title">Consumer Quality Index & Feedback</h1>
          <p className="view-subtitle">Review verification strings and drop problematic marketplace reviews.</p>
        </div>

        <div className="reviews-accordion-container">
          {loading && reviews.length === 0 && <Loader />}

          {products?.map(product => (
            <div key={product._id} className="accordion-product-node">
              <button
                className={`accordion-trigger-bar ${activeProductId === product._id ? 'state-expanded' : ''}`}
                onClick={() => handleToggle(product._id)}
              >
                <div className="trigger-left-block">
                  <span className="product-identity-string">{product.name}</span>
                  <span className="count-pill-badge">Total Records: {product.noOfReviews || 0}</span>
                </div>
                <span className="chevron-indicator-icon">
                  {activeProductId === product._id ? '−' : '+'}
                </span>
              </button>

              {activeProductId === product._id && (
                <div className="accordion-panel-content">
                  {reviews.length === 0 ? (
                    <p className="no-feedback-alert">No consumer feedback strings recorded against this entity profile.</p>
                  ) : (
                    <div className="feedback-cards-stack">
                      {reviews.map(review => (
                        <div key={review._id} className="individual-feedback-card">
                          <div className="feedback-card-header">
                            <span className="user-signature-label">{review.name || 'Anonymous User'}</span>
                            <Ratings value={review.rating} disabled={true} />
                          </div>
                          <div className="feedback-card-body">
                            <p className="comment-prose-text">"{review.comment}"</p>
                            <button 
                              className="feedback-purge-action" 
                              onClick={() => handleDeleteReview(activeProductId, review._id)}
                              title="Delete Feedback"
                            >
                              <BsTrash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}