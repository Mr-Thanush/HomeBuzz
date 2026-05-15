import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../../Components/navBar';
import PageTitle from "../../../Components/pageTitle";
import { useEffect, useState } from 'react';
import {fetchSellerProducts,fetchProductReviews, removeErrors, deleteProductReview, removeSuccess, removeMessage} from '../../../Components/features/AdminSeller/sellerSlice';
import Loader from '../../../Components/loader';
import { toast } from 'react-toastify';
import Ratings from '../../../Components/ratings';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

export default function AllReviews() {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { products, reviews, loading, error,success,message } = useSelector(
    state => state.seller
  );

  

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

  const handleDeleteReview=(productId,reviewId)=>{
      const confirm=window.confirm("Are You Sure You Want To Delete This Review?");
      if(confirm){
        dispatch(deleteProductReview({productId,reviewId}))
      }
  }

  useEffect(() => {
      if (error) {
        toast.error(error, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeErrors());
      }
      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeSuccess());
        dispatch(removeMessage());
        dispatch(fetchSellerProducts());
        setActiveProductId(null);
      }
    }, [dispatch, error,success,message]);
  

  return (
    <>
      <Navbar />
      <PageTitle title="Product Reviews" />

      <section className="reviews-accordion">
        {loading && <Loader />}

        {products?.map(product => (
          <div key={product._id} className="product-block">
        
            <button
              className={`product-header ${
                activeProductId === product._id ? 'active' : ''
              }`}
              onClick={() => handleToggle(product._id)}
            >
              <span className='nameOfTheProduct'>{product.name}</span>
              <span className='noOfReviewsSeller'>Reviews({product.noOfReviews})</span>
              <span className="chevron">
                {activeProductId === product._id ? '−' : '+'}
              </span>
              
            </button>

           
            {activeProductId === product._id && (
              <div className="reviews-panel">
                {reviews.length === 0 ? (
                  <p className="no-reviews">
                    No reviews for this product yet.
                  </p>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <strong>
                          {review.name || 'Anonymous'}
                        </strong>
                        <Ratings
                         value={review.rating}
                         disabled={true}/>
                      </div>
                      <div className="review-header">
                      <p className="review-text">
                        {review.comment}
                      </p>
                      <button className='deleteBtnReviews' onClick={()=>handleDeleteReview(activeProductId,review._id)}><BsTrash size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
}