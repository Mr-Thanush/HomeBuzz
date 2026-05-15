import react, { useState } from "react";
import '../Styles/ratings.css'

function Ratings({ value, onRatingChange, disabled }) {
    const [hoverRating,setHoverRating]=useState(0);
    const [selectRating,setSelectRating]=useState(value||0);
   

    const handleMouseEnter = (rating) => {
        if (!disabled) {
            setHoverRating(rating); 
        }
    };

    const handleMouseLeave = () => {
        if (!disabled) {
            setHoverRating(0);
        }
    };

    const handleStarClick = (rating) => {
        if (!disabled) {
            setSelectRating(rating);
            if(onRatingChange){
                onRatingChange(rating);
            }
        }
    };

    //generate stars based on ratings
    const generateStars=()=>{
        const stars=[];
        for(let i=1;i<=5;i++){
            const isfilled=i<=(hoverRating||selectRating);
            stars.push(
                <span
                key={i}
                className={`stars ${isfilled ? "filled" : "empty"}`}
                onMouseEnter={()=>handleMouseEnter(i)}
                onMouseLeave={handleMouseLeave} 
                onClick={()=>handleStarClick(i)}
                style={{pointerEvents:disabled?"none":"auto"}}
                >⭑</span>
            )
        }
        return stars;
    }



    return(
        <div className="ratings-container">
            {generateStars()}
        </div>
    )
}

export default Ratings;