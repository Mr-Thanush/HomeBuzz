import { useEffect, useState } from "react";
import { BsBookmarkHeart, BsX } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addToLikeList, removeError, removeItemFromLike, removeMessage } from "../Components/features/Like/likeSlice";
import { toast } from "react-toastify";

function LikeItem({ item }) {
  if (!item) return null;
  const dispatch = useDispatch();
  const { loading, error,success,message} = useSelector((state) => state.like);

  const initialQuantity = item.quantity ?? 1;
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  const handleIncrement = () => {
    if (item.stock && quantity >= item.stock) {
      toast.error(`Only ${item.stock} items available`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    setQuantity((q) => q - 1);
  };

  const handleUpdate = () => {
    if (loading) return;
    if (quantity === initialQuantity) {
      toast.info("Quantity already up to date");
      return;
    }
    if (quantity > item.stock) {
    toast.error(`Only ${item.stock} items available`);
    return;
  }
    dispatch(addToLikeList({ id: item.product, quantity }));
  };


  const handleDelete=()=>{
    if (loading) return;
    dispatch(removeItemFromLike(item.product));
    toast.success(`${item.name} Item Removed From Cart Successfully`);
  }


   useEffect(()=>{
          if(error){
            toast.error(error.message,{position:'top-center',autoClose:3000});
            dispatch(removeError())
          }
        },[dispatch,error])
  
        useEffect(()=>{
          if(success){
            toast.success(message,{position:'top-center',autoClose:3000,toastId:"cart-update"});
            dispatch(removeMessage())
          }
        },[dispatch,success,message])

  return (
    <div className="ll-card">
      <div className="ll-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="ll-content">
        <h3>{item.name}</h3>
        <p>By {item.sellerName}</p>
        <p>₹{item.price ? Number(item.price).toFixed(2) : "0.00"}</p>

        <div className="llQuantity">
          <button onClick={handleDecrement} disabled={loading}>−</button>
          <input value={quantity} readOnly />
          <button onClick={handleIncrement} disabled={loading}>+</button>
        </div>
      </div>

      <div className="ll-actions">
        <button disabled={loading} onClick={handleDelete}>
          <BsX size={26} />
        </button>

        <button
          onClick={handleUpdate}
          disabled={loading || quantity === initialQuantity}
        >
          <BsBookmarkHeart size={24} />
        </button>
      </div>
    </div>
  );
}

export default LikeItem;