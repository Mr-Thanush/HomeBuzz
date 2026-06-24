
import { useEffect } from 'react';
import Navbar from '../../../Components/navBar';
import PageTitle from "../../../Components/pageTitle";
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchSellerProducts, removeErrors, removeSuccess } from '../../../Components/features/AdminSeller/sellerSlice';
import Ratings from '../../../Components/ratings';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../Components/loader';

export default function SellerAllProducts() {
  const {products:AllProducts,error,loading,deleting}=useSelector((state)=>state.seller);
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(fetchSellerProducts());
  },[dispatch])

  useEffect(()=>{
   if(error){
    toast.error(error,{
        position: "top-center",
        autoClose: 3000,
      })
      dispatch(removeErrors());
   }  
  },[dispatch,error])

  const handleDelete=(productId)=>{
    const isConfirmed=window.confirm("Are You Sure You Want To Delete This Product?")
    if(isConfirmed){
      dispatch(deleteProduct(productId)).then((action)=>{
        if(action.type==="seller/deleteProduct.fulfilled"){
          toast.success("Product Deleted Successfully",{
        position: "top-center",
        autoClose: 3000,
      })
      dispatch(removeSuccess());
      dispatch(fetchSellerProducts());
        }
      })
    }
  } 

  return (
    <>
    <Navbar/>
    <PageTitle title="Seller All Products"/>
    <section className="seller-page">
     <h1>All Products</h1>

     {AllProducts&&AllProducts.length>0 ?( 
      AllProducts.map((product)=>(
        <div className="seller-card" key={product._id}>
           <img src={product.image?.[0]?.url || ""} alt={product.name} />
        <p><b>Product:</b>{product.name}</p>
        <p><b>Stock:</b>{product.stock}</p>
        <p><b>Price:</b> {product.price}</p>
        <p><b>Category:</b>{product.category}</p>
        <p><b>Created At:</b>{new Date(product.createdAt).toLocaleDateString()}</p>
        <p><b>Ratings:</b>
         <Ratings
         value={product.ratings}
         disabled={true}/></p>
        <Link to={`/seller/product/${product._id}`}><button className='sellerUpdateProducts'>Update</button></Link>
       <button className='sellerDeleteProducts' disabled={deleting[product._id]} onClick={()=>handleDelete(product._id)}>{deleting[product._id]?<Loader/>:"Delete"}</button>
      </div>
      ))
      ):(
         !loading && <h2 className="noProducts">No products found</h2>
      )}

    </section>
    </>
  );
}