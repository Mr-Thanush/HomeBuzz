import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../Components/navbar";
import PageTitle from "../../../Components/pageTitle";
import { useEffect } from "react";
import { fetchAdminProducts } from "../../../Components/features/AdminSeller/adminSlice";
import Ratings from "../../../Components/ratings";
import { Link } from "react-router-dom";
import '../admin.css'


 function AdminProducts() {
  const {products,loading,error}=useSelector(state=>state.admin);
  const dispatch=useDispatch();
  
  useEffect(()=>{
    dispatch(fetchAdminProducts())
  },[dispatch]);
  
  return (
    <>
     <Navbar/>
    <PageTitle title="Admin Products View"/>

    <section className="admin-page2">
      <h1>All Products</h1>

    <div className="admin-table">
  {loading && <p>Loading...</p>}

  {products && products.length > 0 ? (
    products.map((product) => (
      <div className="admin-row" key={product._id}>
        <img src="product.img[0].url" alt=""/>
        <span><b>Name:</b>{product.name}</span>
        <span><b>Price:</b>₹{product.price}</span>
        <span><b>Stock:</b>{product.stock}</span>
         <span><b>Category:</b>{product.category}</span>
          <span><b>Created At:</b>{new Date(product.createdAt).toLocaleDateString()}</span>
         <span><b>Ratings:</b>
         <Ratings
         value={product.ratings}
         disabled={true}/>
         </span>
        <div className="buttonsProducts">
        <Link to={`admin/product/${product._id}`}><button className="danger">Delete</button></Link>
        </div>
      </div>
    ))
  ) : (
    !loading && <h2 className="noProducts">No products found</h2>
  )}
</div>
    </section>
    </>
  );
}


export default AdminProducts;