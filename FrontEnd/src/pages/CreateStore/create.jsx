import React, { useState } from "react";
import "./create.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api";

function CreateStore() {
  const navigate = useNavigate();

  // Form state
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const finalCategory = category === "custom" ? customCategory : category;

  const handleCreateStore = async () => {
    if (!storeName || !storeEmail || !finalCategory || !description) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", storeName);
      formData.append("email", storeEmail);
      formData.append("category", finalCategory);
      formData.append("description", description);
      if (logoFile) formData.append("logo", logoFile);

      const res = await fetch(`${API_URL}/api/v1/store/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Store created successfully!");
        navigate("/profile");
      } else {
        alert("Failed to create store: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Create store error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createStore">
      <h2 className="createHeading">Create Store</h2>
      <form className="inputOfSeller" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Store Name"
          required
          className="StoreName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Store Email"
          required
          className="StoreName"
          value={storeEmail}
          onChange={(e) => setStoreEmail(e.target.value)}
        />

        <select
          required
          className="selectStore"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
          <option value="custom">Custom</option>
        </select>

        {category === "custom" && (
          <input
            type="text"
            className="customEnter"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <p className="categoryCreated">
          <strong>Selected Category:</strong> {finalCategory || "None"}
        </p>

        <textarea
          placeholder="Store Description"
          required
          className="StoreTextArea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="storeLogo"
          onChange={(e) => setLogoFile(e.target.files[0])}
        />

        {logoFile && (
          <div className="logoPreviewContainer">
            <p>Logo Preview:</p>
            <img
              src={URL.createObjectURL(logoFile)}
              alt="logo preview"
              className="logoPreview"
            />
          </div>
        )}

        <button
          type="button"
          className="BtnStore"
          onClick={handleCreateStore}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>
    </div>
  );
}

export default CreateStore;