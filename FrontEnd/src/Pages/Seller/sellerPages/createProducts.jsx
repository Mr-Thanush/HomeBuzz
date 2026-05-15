import { useEffect, useState } from "react";
import Navbar from "../../../Components/navBar";
import PageTitle from "../../../Components/pageTitle";
import "../seller.css";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, removeErrors, removeSuccess } from "../../../Components/features/AdminSeller/sellerSlice";
import { toast } from "react-toastify";
import Loader from "../../../Components/loader";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const { loading, success, error } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate=useNavigate();

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
      toast.error(error, { position: "top-center",autoClose:3000 });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product Created Successfully", {
        position: "top-center",
        autoClose:3000
      });
      dispatch(removeSuccess());
      navigate("/seller/products");
      setName("");
      setPrice("");
      setCategory("");
      setStock("");
      setQuantity("");
      setContainerType("");
      setFoodType("");
      setExpireDate("");
      setIngredients("");
      setDescription("");
      setReturnPolicy(false);
      setImages([]);
      setImagePrev([]);
    }
  }, [dispatch, error, success]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <PageTitle title="Seller Create Products" />

      <section className="seller-page create-product">
        <h1>Create Product</h1>

        <form className="seller-form" onSubmit={createProductSubmit}>
          <label htmlFor="name" className="LabelsForCreateProducts">Product Name</label>
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            name="name"
          />
        <label htmlFor="price" className="LabelsForCreateProducts">Price</label>
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            name="price"
          />

         <label htmlFor="category" className="LabelsForCreateProducts">Category</label>
          <div className="dropdown">
            <div
              className={`dropdown-header ${category ? "active" : ""}`}
              onClick={() => setOpen(!open)}
            >
              {category || "Choose Category"}
            </div>

            {open && (
              <div className="dropdown-list">
                {categories.map((item) => (
                  <div
                    key={item}
                    className="dropdown-item"
                    onClick={() => {
                      setCategory(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

<label htmlFor="stock" className="LabelsForCreateProducts">Stock</label>
          <input
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            name="stock"
          />


<label htmlFor="ingredients" className="LabelsForCreateProducts">Made Up Of</label>
          <input
            placeholder="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            name="ingredients"
          />

<label htmlFor="quantity" className="LabelsForCreateProducts">Quantity Per Pack</label>
          <input
            placeholder="Quantity Per Pack"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            name="quantity"
          />

<label htmlFor="containerType" className="LabelsForCreateProducts">Container Type (Optional)</label>
          <input
            placeholder="Container Type"
            value={containerType}
            onChange={(e) => setContainerType(e.target.value)}
            name="containerType"
          />

<label htmlFor="foodType" className="LabelsForCreateProducts">Food Type (Optional)</label>
          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            name="foodType"
          >
            <option value="">Choose Food Type</option>
            <option value="Veg">Vegetarian</option>
            <option value="NonVeg">Non-Veg</option>
          </select>

<label htmlFor="expireDate" className="LabelsForCreateProducts">Expire Date (Optional)</label>
          <input
            type="date"
            className="expireDateInput"
            placeholder="Expire Date"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            name="expireDate"
          />

          <label htmlFor="description">Description</label>
          <input
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label htmlFor="returnPolicy" className="LabelsForCreateProducts">
             Return
            <input
              type="checkbox"
              checked={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.checked)}
              name="returnPolicy"
            />
           </label>
         

   <label htmlFor="Image" className="LabelsForCreateProducts">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImgUpload}
            className="imgInput"
          />

          <div className="Prev-Img">
            {imagePrev.map((img, index) => (
              <img
                src={img}
                alt="Preview"
                key={index}
                className="sellerPrevImg"
              />
            ))}
          </div>

          <button type="submit">
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>

      </section>
    </>
  );
}