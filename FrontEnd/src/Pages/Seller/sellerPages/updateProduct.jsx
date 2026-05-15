import { useEffect, useState } from "react";
import Navbar from "../../../Components/Navbar";
import PageTitle from "../../../Components/pageTitle";
import "../seller.css";
import Loader from "../../../Components/loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails } from "../../../Components/features/Products/productSlice";
import ProductImages from "../../../Components/productImage";
import { removeErrors, removeSuccess, updateProduct } from "../../../Components/features/AdminSeller/sellerSlice";
import { toast } from "react-toastify";

export default function UpdateProduct() {
  const { product} = useSelector((state) => state.product);
   const {loading,success,error} = useSelector((state) => state.seller);
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const {updateId}=useParams();
  console.log(product);
  
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

  useEffect(()=>{
    dispatch(getProductDetails(updateId))
  },[dispatch,updateId]);

  useEffect(()=>{
     if(product){
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
  },[product]);

   useEffect(() => {
      if (error) {
        toast.error(error, { position: "top-center",autoClose:3000 });
        dispatch(removeErrors());
      }
  
      if (success) {
        toast.success("Product Updated Successfully", {
          position: "top-center",
          autoClose:3000
        });
        dispatch(removeSuccess());
        navigate("/seller/products");
}
}, [dispatch, error, success]);

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


  const handleImgChange=(e)=>{
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
  }


  const handleSubmit=(e)=>{
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
    dispatch(updateProduct({id:updateId,formData:myForm}))
  }




  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <PageTitle title="Seller Create Products" />

      <section className="seller-page create-product">
        <h1>Update Product</h1>

        <form className="seller-form" onSubmit={handleSubmit}>
          <label htmlFor="name" className="LabelsForCreateProducts">Product Name</label>
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
          />
        <label htmlFor="price" className="LabelsForCreateProducts">Price</label>
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            
            name="stock"
          />


<label htmlFor="ingredients" className="LabelsForCreateProducts">Made Up Of</label>
          <input
            placeholder="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            
            name="ingredients"
          />

<label htmlFor="quantity" className="LabelsForCreateProducts">Quantity Per Pack</label>
          <input
            placeholder="Quantity Per Pack"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
           
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
            className="imgInput"
            onChange={handleImgChange}
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
<hr className="newImg-oldImg"/>
          <div className="Prev-Img">
            {oldImages.map((img, index) => (
              <img
                src={img.url}
                alt="Preview"
                key={index}
                className="sellerPrevImg"
              />
            ))}
          </div>

          <button type="submit">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>

      </section>
    </>
  );
}