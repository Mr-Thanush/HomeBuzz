import React from "react";
import "./cart.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../Components/cartContext";

function Cart() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const increaseQty = (item) => addToCart(item);

  const decreaseQty = (item) => {
    if (item.quantity === 1) removeFromCart(item._id);
    else addToCart({ ...item, quantity: -1 });
  };

  return (
    <div className="cartPage">
      <h1 className="cartTitle">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="emptyCart">Your cart is empty</p>
      ) : (
        <>
          <div className="cartItemsContainer">
            {cartItems.map((item) => (
              <div key={item._id} className="cartItemCard">
                <Link to={`/product/${item._id}`} className="cartItemImgLink">
                  <img
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    className="cartItemImg"
                  />
                </Link>

                <div className="cartItemInfo">
                  <h3 className="cartItemName">{item.name}</h3>
                  <p className="cartItemPrice">₹{item.price}</p>

                  {/* Quantity Control */}
                  <div className="cartQuantityControl">
                    <button
                      className="qtyBtn"
                      onClick={() => decreaseQty(item)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="qtyNumber">{item.quantity}</span>
                    <button
                      className="qtyBtn"
                      onClick={() => increaseQty(item)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>

                <button
                  className="removeItemBtn"
                  onClick={() => removeFromCart(item._id)}
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <h2 className="totalAmount">Total: ₹{total}</h2>
            <Link to="/buy">
              <button
                className="checkoutBtn"
                disabled={!cartItems.length}
              >
                Proceed to Buy
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;