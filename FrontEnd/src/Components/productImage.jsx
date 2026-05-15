import { useState } from "react";
import "../Styles/productImage.css";

export default function ProductImages({ product }) {
  const images = product?.image || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="productImage">
      {images.length > 1 && (
        <div className="sidePreview">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              className={`previewThumb ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={img.url} alt={`Preview ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      <div className="mainImageWrapper">
        <button className="arrow left" onClick={prevImage}>
          &#10094;
        </button>

        <img
          src={images[currentIndex]?.url}
          alt={product?.name}
          className="ProductImg"
        />

        <button className="arrow right" onClick={nextImage}>
          &#10095;
        </button>
      </div>

      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            type="button"
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}