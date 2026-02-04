import React, { useState, useEffect } from "react";
import './store.css';
import { useNavigate } from 'react-router-dom';

function ItemsManagement() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:9090/api/v1/seller/products", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch products");

      setItems(data.products || []);
    } catch (error) {
      console.error("Fetch items error:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:9090/api/v1/seller/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");

      setItems((prev) => prev.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Delete item error:", error);
      alert(error.message);
    }
  };

  if (loading) return <h3>Loading items...</h3>;

  return (
    <div className="itemsManagement">
      <div className="manageItems">
        <h3>Manage Items</h3>
        <button className="AddItems" onClick={() => navigate('/add-item')}>ADD</button>
      </div>

      <div className="itemsList">
        {items.length === 0 && <p>No items added yet.</p>}
        {items.map(item => (
          <div key={item._id} className="itemCard">
            <h4>{item.name}</h4>
            <p>Price: ₹{item.price}</p>
            <p>Category: {item.category}</p>
            <p>Stock: {item.stock}</p>
            <div className="editDelete">
              <button className="editItem" onClick={() => navigate(`/add-item/${item._id}`)}>Edit</button>
              <button onClick={() => deleteItem(item._id)} className="deleteItem">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsManagement;