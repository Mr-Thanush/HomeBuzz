import React, { useEffect, useState } from "react";
import "./store.css";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../../api";

function AddItemPage() {
  const { id } = useParams(); // product ID for edit mode
  const navigate = useNavigate();

  const [item, setItem] = useState({
    name: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
    discription: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Fetch product if editing
useEffect(() => {
  if (!id) return;

  setIsEdit(true);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/seller/product/${id}`,
        { credentials: "include" }
      );

      const text = await res.text();
      console.log("RAW PRODUCT RESPONSE 👉", text);

      // If backend returned HTML
      if (text.startsWith("<")) {
        throw new Error("Product API returned HTML. Check backend route.");
      }

      const data = JSON.parse(text);

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch product");
      }

      if (!data.product) {
        throw new Error("Product not found");
      }

      setItem({
        name: data.product.name,
        price: data.product.price,
        discount: data.product.discount ?? 0,
        category: data.product.category,
        stock: data.product.stock,
        discription: data.product.discription,
      });
    } catch (error) {
      console.error("Fetch product error FULL 👉", error);
      alert(error.message);
    }
  };

  fetchProduct();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, discount, category, stock, discription } = item;

    if (!name || !price || !category || !stock || !discription) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `${API_URL}/api/v1/seller/product/${id}`
        : `${API_URL}/api/v1/seller/product/create`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          discount: Number(discount),
          category,
          stock: Number(stock),
          discription,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save product");

      alert(isEdit ? "Item updated successfully!" : "Item added successfully!");
      navigate("/items-management"); // Go back to list
    } catch (error) {
      console.error("Save item error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addItemPage">
      <h2>{isEdit ? "Edit Item" : "Add New Item"}</h2>

      <form className="addItemForm" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={item.name} onChange={handleChange} />

        <label>Price</label>
        <input type="number" name="price" value={item.price} onChange={handleChange} />
        <label>Discount (%)</label>
        <input type="number" name="discount" value={item.discount} onChange={handleChange} min="0" max="100" />

        <label>Category</label>
        <input name="category" value={item.category} onChange={handleChange} />

        <label>Stock</label>
        <input type="number" name="stock" value={item.stock} onChange={handleChange} />

        <label>Description</label>
        <textarea name="discription" value={item.discription} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Item" : "Add Item")}
        </button>
      </form>
    </div>
  );
}

export default AddItemPage;