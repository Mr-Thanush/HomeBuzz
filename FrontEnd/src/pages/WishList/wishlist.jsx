import React from "react";
import "./wishlist.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useWishlist } from "../../components/wishlistContext";
import { useCart } from "../../components/cartContext";

function WishList() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlistPage">
      <h1 className="wishlistTitle">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="emptyWishlist">No items in your wishlist</p>
      ) : (
        <div className="wishlistItemsContainer">
          {wishlist.map((item) => (
            <div key={item._id} className="wishlistItemCard">
              <Link to={`/product/${item._id}`} className="wishlistItemImgLink">
                <img
                  src={item.images?.[0]?.url || "/placeholder.png"}
                  alt={item.name}
                  className="wishlistItemImg"
                />
              </Link>

              <div className="wishlistItemInfo">
                <h3 className="wishlistItemName">{item.name}</h3>
                <p className="wishlistItemPrice">₹{item.price}</p>
                <p className="wishlistItemRating">⭐ {item.ratings || 0}</p>
              </div>

              <div className="wishlistItemActions">
                <button
                  className="removeWishlistBtn"
                  onClick={() => toggleWishlist(item)}
                >
                  <FontAwesomeIcon icon={faX} />
                </button>

                <button
                  className="addCartBtn"
                  onClick={() => addToCart(item)}
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishList;