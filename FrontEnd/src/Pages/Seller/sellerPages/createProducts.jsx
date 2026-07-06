import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import Loader from "../../../Components/loader";
import { createProduct, removeErrors, removeSuccess } from "../../../Components/features/AdminSeller/sellerSlice";

export default function CreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.seller || {});

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState("");
  const [containerType, setContainerType] = useState("");
  const [foodType, setFoodType] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [images, setImages] = useState([]);
  const [imagePrev, setImagePrev] = useState([]);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState(false);

  const categories = [
    "Pickles & Preserves",
    "Homemade Masalas & Powders",
    "Beauty & Personal Care",
    "Homemade Condiments & Spreads",
    "Fashion",
    "Gifts & Special Items",
    "Bakery & Snacks (Homemade)",
    "Home Made",
  ];

  const createProductSubmit = (e) => {
    e.preventDefault();
    if (!category) return toast.warn("Please select a target ecosystem classification category.");

    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("price", price);
    myForm.append("category", category);
    myForm.append("stock", stock);
    myForm.append("quantity", quantity);
    myForm.append("containerType", containerType);
    myForm.append("foodType", foodType);
    myForm.append("expireDate", expireDate);
    myForm.append("madeUpOf", ingredients);
    myForm.append("description", description);
    myForm.append("returnPolicy", returnPolicy);

    images.forEach((img) => {
      myForm.append("image", img);
    });

    dispatch(createProduct(myForm));
  };

  const handleImgUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePrev([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePrev((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product provisioned to storage records successfully.", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/seller/products");
    }
  }, [dispatch, error, success, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="Seller Create Products" />
      <section className="form-workspace-centering">
        <div className="structured-form-card">
          <h1 className="form-workspace-title">Register Catalog Offering</h1>
          <p className="form-workspace-subtitle">Populate product properties, inventory counts, and image arrays.</p>

          <form className="modern-fluid-form" onSubmit={createProductSubmit}>
            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="name">Item Display Name</label>
                <input id="name" type="text" placeholder="e.g. Traditional Mango Pickle" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group-node">
                <label htmlFor="price">Base Asset Value (INR)</label>
                <input id="price" type="number" placeholder="₹ Value" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
            </div>

            <div className="input-group-node">
              <label>Ecosystem Classification Category</label>
              <div className="custom-dropdown-context">
                <div className={`dropdown-trigger-box ${category ? "has-value" : ""}`} onClick={() => setOpen(!open)}>
                  {category || "Select Product Category Context..."}
                </div>
                {open && (
                  <div className="dropdown-options-tray">
                    {categories.map((item) => (
                      <div key={item} className="dropdown-option-row" onClick={() => { setCategory(item); setOpen(false); }}>
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="stock">Available Stock Units</label>
                <input id="stock" type="number" placeholder="Units Count" value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
              <div className="input-group-node">
                <label htmlFor="quantity">Net Mass/Volume Content</label>
                <input id="quantity" type="text" placeholder="e.g. 500g / 1 Litre" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
            </div>

            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="containerType">Enclosure Container (Optional)</label>
                <input id="containerType" type="text" placeholder="Glass Jar, Plastic Box" value={containerType} onChange={(e) => setContainerType(e.target.value)} />
              </div>
              <div className="input-group-node">
                <label htmlFor="foodType">Dietary Metric Alignment</label>
                <select id="foodType" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                  <option value="">Select Classification...</option>
                  <option value="Veg">Vegetarian Alignment</option>
                  <option value="NonVeg">Omnivore / Non-Veg Alignment</option>
                </select>
              </div>
            </div>

            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="expireDate">Batch Expiration Metric</label>
                <input id="expireDate" type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />
              </div>
              <div className="input-group-node">
                <label htmlFor="ingredients">Primary Formulation Ingredients</label>
                <input id="ingredients" type="text" placeholder="Spices, Organic Extracts" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
              </div>
            </div>

            <div className="input-group-node">
              <label htmlFor="description">Public Product Narrative</label>
              <textarea id="description" rows="4" placeholder="Detail nutritional indicators, taste notes, storage instructions..." value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="checkbox-alignment-wrapper">
              <input id="returnPolicy" type="checkbox" checked={returnPolicy} onChange={(e) => setReturnPolicy(e.target.checked)} />
              <label htmlFor="returnPolicy">Authorize customer returns for this specific batch product line.</label>
            </div>

            <div className="input-group-node">
              <label>Display Imagery Portfolio</label>
              <input type="file" accept="image/*" multiple onChange={handleImgUpload} className="file-input-modifier" />
              <div className="imagery-grid-preview">
                {imagePrev.map((img, index) => (
                  <img src={img} alt={`Preview Target ${index}`} key={index} className="thumbnail-node-preview" />
                ))}
              </div>
            </div>

            <button type="submit" className="form-action-submit-btn">
              Compile & Register Offering
            </button>
          </form>
        </div>
      </section>
    </>
  );
}