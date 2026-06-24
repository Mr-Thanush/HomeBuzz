import React from "react";
import { Link } from "react-router-dom";
import Ratings from "./ratings";
import "../Styles/product.css";

function Product({ product }) {
  const seller = typeof product.seller === "object" ? product.seller : null;
  const sellerDisplayName = seller?.name || seller?.sellerInfo?.storeName || product.seller || "Unknown Seller";
  const imgSrc = product?.image?.[0]?.url || "/assets/placeholder.png";
  const storeName = seller?.sellerInfo?.storeName;
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
          <span className="hb-product-pill">{product.category || "Product"}</span>
          <span className="hb-stock-pill">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
        </div>

        <div className="hb-product-body">
          <h3 id={`product-${product._id}-name`} className="hb-product-title">{product.name}</h3>
          <div className="hb-product-seller">
            <span className="hb-seller-name">{sellerDisplayName}</span>
            {storeName && <span className="hb-seller-store"> · {storeName}</span>}
          </div>

          <p className="hb-product-desc" aria-hidden="false">{product.description?.slice(0,120) || "No description"}</p>

          <div className="hb-product-meta">
            <div className="hb-price">₹{product.price}</div>
            <div className="hb-ratings">
              <Ratings value={product.ratings || 0} disabled={true} />
              <span className="hb-reviews">({product.noOfReviews || 0})</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default Product;