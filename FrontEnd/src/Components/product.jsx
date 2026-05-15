import React, { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./ratings";

function Product({ product }) {

  const[rating,setRating]=useState(product.ratings||0);

  const handleRatingChange=(newRating)=>{
     setRating(newRating);

  }

  
  return (
    <Link to={`/product/${product._id}`} className="product-link">
    <div className="product-card">
      <h2 className="product-seller">{product.seller}</h2>
      <img
        src={product.image[0]?.url}
        alt={product.name}
      />
      <div className="productDetails">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">
        <strong>₹{product.price}</strong>
      </p>
      <div className="product-ratings">
        <Ratings
        key={product._id}
        value={product.ratings}
        onRatingChange={handleRatingChange}
        disabled={true}
        />
      </div>
      
      <span className="productCard-noOfReviews">( {product.noOfReviews} {product.noOfReviews===1?'Review':'Reviews'} )</span>
      </div>
    </div>
    </Link>
  );
}

export default Product;