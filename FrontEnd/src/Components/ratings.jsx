import React, { useState, useEffect } from "react";
import '../Styles/ratings.css';

function Ratings({ value = 0, onRatingChange, disabled = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectRating, setSelectRating] = useState(value);

  // Sync state if props change externally
  useEffect(() => {
    setSelectRating(value);
  }, [value]);

  const handleMouseEnter = (rating) => {
    if (!disabled) setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    if (!disabled) setHoverRating(0);
  };

  const handleStarClick = (rating) => {
    if (!disabled) {
      setSelectRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  return (
    <div 
      className="ratings-container" 
      onMouseLeave={handleMouseLeave}
      role="img" 
      aria-label={`Rating: ${selectRating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= (hoverRating || selectRating);
        return (
          <span
            key={index}
            className={`star-item ${isFilled ? "filled" : "empty"} ${disabled ? "disabled" : "interactive"}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleStarClick(index)}
            style={{ pointerEvents: disabled ? "none" : "auto" }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default Ratings;