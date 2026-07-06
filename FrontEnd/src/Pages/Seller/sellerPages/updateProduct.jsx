import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import Loader from "../../../Components/loader";
import { getProductDetails } from "../../../Components/features/Products/productSlice";
import { removeErrors, removeSuccess, updateProduct } from "../../../Components/features/AdminSeller/sellerSlice";

export default function UpdateProduct() {
  const { updateId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { product } = useSelector((state) => state.product || {});
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
  const [oldImages, setOldImages] = useState([]);
  const [imagePrev, setImagePrev] = useState([]);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [returnPolicy, setReturnPolicy] = useState(false);

  useEffect(() => {
    if (updateId) {
      dispatch(getProductDetails(updateId));
    }
  }, [dispatch, updateId]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setQuantity(product.quantity || "");
      setContainerType(product.containerType || "");
      setFoodType(product.foodType || "");
      setExpireDate(product.expireDate?.substring(0, 10) || "");
      setIngredients(product.madeUpOf || "");
      setDescription(product.description || "");
      setReturnPolicy(product.returnPolicy || false);
      setOldImages(product.image || []);
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Catalog record updated successfully.", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/seller/products");
    }
  }, [dispatch, error, success, navigate]);

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

  const handleImgChange = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
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
    
    dispatch(updateProduct({ id: updateId, formData: myForm }));
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="Seller Modify Product" />
      <section className="form-workspace-centering">
        <div className="structured-form-card">
          <h1 className="form-workspace-title">Modify Catalog Offering</h1>
          <p className="form-workspace-subtitle">Mutate current field properties and upload updated media assets.</p>

          <form className="modern-fluid-form" onSubmit={handleSubmit}>
            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="updateName">Product Label</label>
                <input id="updateName" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group-node">
                <label htmlFor="updatePrice">Pricing Standard (INR)</label>
                <input id="updatePrice" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
            </div>

            <div className="input-group-node">
              <label>Classification Category Context</label>
              <div className="custom-dropdown-context">
                <div className="dropdown-trigger-box has-value" onClick={() => setOpen(!open)}>
                  {category || "Choose Category Alignment..."}
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
                <label htmlFor="updateStock">Warehouse Stock Volume</label>
                <input id="updateStock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
              <div className="input-group-node">
                <label htmlFor="updateQuantity">Measurement Specification</label>
                <input id="updateQuantity" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
            </div>

            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="updateContainer">Container Geometry</label>
                <input id="updateContainer" type="text" value={containerType} onChange={(e) => setContainerType(e.target.value)} />
              </div>
              <div className="input-group-node">
                <label htmlFor="updateFood">Dietary Alignment</label>
                <select id="updateFood" value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                  <option value="">Choose Food Type...</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="NonVeg">Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div className="form-grid-dual-column">
              <div className="input-group-node">
                <label htmlFor="updateExpire">Batch Absolute Expiry</label>
                <input id="updateExpire" type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />
              </div>
              <div className="input-group-node">
                <label htmlFor="updateIngredients">Component Composition</label>
                <input id="updateIngredients" type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
              </div>
            </div>

            <div className="input-group-node">
              <label htmlFor="updateDesc">Public Descriptions Prose</label>
              <textarea id="updateDesc" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="checkbox-alignment-wrapper">
              <input id="updateReturn" type="checkbox" checked={returnPolicy} onChange={(e) => setReturnPolicy(e.target.checked)} />
              <label htmlFor="updateReturn">Enable customer return policy routes for this specific product line profile.</label>
            </div>

            <div className="input-group-node">
              <label>Append Supplemental Imagery Assets</label>
              <input type="file" accept="image/*" multiple onChange={handleImgChange} className="file-input-modifier" />
              
              <div className="structural-asset-heading-label">Staged Buffer For Committal:</div>
              <div className="imagery-grid-preview">
                {imagePrev.map((img, index) => (
                  <img src={img} alt="Staged File Preview Node" key={index} className="thumbnail-node-preview pending-border" />
                ))}
              </div>

              <div className="structural-asset-heading-label divider-line">Currently Active Remote CDN Storage Assets:</div>
              <div className="imagery-grid-preview">
                {oldImages.map((img, index) => (
                  <img src={img.url} alt="Active Remote Asset Node" key={index} className="thumbnail-node-preview checked-border" />
                ))}
              </div>
            </div>

            <button type="submit" className="form-action-submit-btn update-tint-btn">
              Execute Database Matrix Mutation
            </button>
          </form>
        </div>
      </section>
    </>
  );
}