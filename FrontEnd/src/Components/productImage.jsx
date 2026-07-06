import React, { useState } from "react";
import "../Styles/productImage.css";

export default function ProductImages({ product }) {
  const images = product?.image || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="productImage empty-state">
        <img src="/assets/placeholder.png" alt="No media available" className="ProductImg" />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="productImage-container">
      {images.length > 1 && (
        <div className="sidePreview" aria-label="Product thumbnails">
          {images.map((img, index) => (
            <button
              key={img._id || index}
              type="button"
              className={`previewThumb ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View slide image ${index + 1}`}
            >
              <img src={img.url} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <div className="mainImageWrapper">
        {images.length > 1 && (
          <button className="arrow left" onClick={prevImage} aria-label="Previous image">
            &#10094;
          </button>
        )}

        <img
          src={images[currentIndex]?.url}
          alt={product?.name || "Product view"}
          className="ProductImg"
        />

        {images.length > 1 && (
          <button className="arrow right" onClick={nextImage} aria-label="Next image">
            &#10095;
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="dots" role="tablist" aria-label="Slideshow bullets">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}