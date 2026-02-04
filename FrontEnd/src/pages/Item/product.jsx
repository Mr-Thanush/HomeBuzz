import React, { useEffect, useState } from "react";
import "./product.css";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartShopping,
  faStar,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../Components/cartContext";
import { useWishlist } from "../../Components/wishListContext";
import API_URL from "../../api";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API_URL}/api/v1/product/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
        setReviews(data.product.reviews || []);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const averageRating =
    product.reviews?.length > 0 ? product.ratings.toFixed(1) : "0.0";

  const handleBuyNow = () => {
    if (product.stock < 1) return;

    // 🔥 IMPORTANT PART
    addToCart({ ...product, quantity: 1 });
    navigate("/buy");
  };

  return (
    <div className="Products">
      {/* Top Icons */}
      <div className="add">
        <FontAwesomeIcon
          icon={faHeart}
          color={isWishlisted ? "red" : "black"}
          onClick={() => toggleWishlist(product)}
        />

        <div className="ratings">⭐ {averageRating}</div>

        <FontAwesomeIcon
          icon={faCartShopping}
          onClick={() => addToCart(product)}
        />
      </div>

      <div className="Product">
        {/* Images */}
        <div className="Productimg">
          {product.images?.map((img, i) => (
            <img key={i} src={img.url} alt={product.name} />
          ))}
        </div>

        {/* Details */}
        <div className="Productdetails">
          <h3>{product.name}</h3>
          <p>{product.discription}</p>
          <h2>₹{product.price}</h2>
          <p>Stock: {product.stock}</p>
          <p>Category: {product.category}</p>
          <p>Reviews: {reviews.length}</p>
        </div>

        {/* Reviews */}
        <div className="feedback">
          <div className="headOfReview">
            <h2>Reviews</h2>
            <FontAwesomeIcon icon={faPlus} onClick={() => setShowReviewForm(true)} />
          </div>

          {showReviewForm && (
            <div>
              {[1, 2, 3, 4, 5].map((s) => (
                <FontAwesomeIcon
                  key={s}
                  icon={faStar}
                  color={s <= newRating ? "green" : "gray"}
                  onClick={() => setNewRating(s)}
                />
              ))}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button>Submit</button>
            </div>
          )}

          {reviews.map((r, i) => (
            <div key={i}>
              ⭐ {r.rating}
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

        {/* BUY BUTTON */}
        <button
          className="ProductbuyBtn"
          disabled={product.stock < 1}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default Product;