import React, { useState, useEffect } from "react";
import './store.css';
import API_URL from "../../api";

function StoreSettings({ store }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize form with existing store data
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
        email: store.email || "",
        whatsapp: store.whatsapp || "",
        address: store.address || "",
      });
      setLoading(false);
    }
  }, [store]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try { 
      const res = await fetch(`${API_URL}/api/v1/store/${store._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Store details updated successfully!");
      } else {
        alert("Failed to update: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h3>Loading store details...</h3>;
  if (!store) return <h3>No store found!</h3>;

  return (
    <div className="storeSettings">
      <h3>Edit Store Details</h3>
      <form onSubmit={handleSave}>
        <label>Store Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Store Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Store WhatsApp Number:</label>
        <input
          type="text"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default StoreSettings;