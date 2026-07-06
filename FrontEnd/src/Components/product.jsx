import React from "react";
import { Link } from "react-router-dom";
import Ratings from "./ratings";
import "../Styles/product.css";

function Product({ product }) {
  if (!product) return null;

  const seller = typeof product.seller === "object" ? product.seller : null;
  const storeName = seller?.sellerInfo?.storeName || seller?.name || "Official Store";
  const imgSrc = product?.image?.[0]?.url || "/assets/placeholder.png";
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="hb-product-card" aria-labelledby={`product-${product._id}-name`}>
      <Link to={`/product/${product._id}`} className="hb-product-link" aria-label={`View ${product.name}`}>
        
        <div className="hb-product-media">
          <img 
            src={imgSrc}
            alt={product.name || "Product image"}
            loading="lazy"
            width="300"
            height="220"
          />
          <div className="hb-media-badges">
            <span className="hb-product-pill">
              <Ratings value={product.ratings || 0} disabled={true} />
              <span className="hb-reviews">({product.noOfReviews || 0})</span>
            </span>
            <span className={`hb-stock-pill ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
              {isOutOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
            </span>
          </div>
        </div>

        <div className="hb-product-body">
          <div className="hb-product-seller">
            <span className="hb-seller-store">{storeName}</span>
          </div>
          
          <h3 id={`product-${product._id}-name`} className="hb-product-title">
            {product.name}
          </h3>

          <p className="hb-product-desc">
            {product.description ? `${product.description.slice(0, 100)}...` : "No description available."}
          </p>

          <div className="hb-product-meta">
            <span className="hb-price">₹{(product.price || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>

      </Link>
    </article>
  );
}

export default Product;