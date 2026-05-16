import React, { useEffect } from "react";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import Product from "../Components/product";
import "../Styles/home.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../Components/features/Products/productSlice";
import Loader from "../Components/loader";
import { toast } from "react-toastify";

function Home() {
  const { loading, error, products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

 
  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);


  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  
  const goToSearch = () => { 
    navigate("/search");
  };

 
  const categories = products?.length > 0 
    ? [...new Set(products.map((p) => p.category).filter(Boolean))]
    : [];

    const goToCategorySearch=(category)=>{
      navigate(`/search?category=${encodeURIComponent(category)}`)
    }
 
  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="Home - HomeBuzz"/>
      <Navbar />

      <div className="home-container">
       
        <div className="home-search">
          <input
            type="text"
            placeholder="Search homemade food, pickles, handmade items..."
            readOnly
            onClick={goToSearch}
          />
        </div>

       
        <section className="home-section">
          <h2>Top Seller Items</h2>
          <div className="horizontal-scroll">
            {products
              ?.filter((product) => (product.ratings || 0) > 0)
              .map((product) => (
                <Product key={product._id} product={product} />
              ))}
          </div>
        </section>

       
        <section className="home-section">
          <h2>Latest Deals</h2>
          <div className="horizontal-scroll">
            {products?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </section>

        
        <section className="home-section">
          <h2>Categories</h2>
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category} 
              className="category-card"
              onClick={()=>goToCategorySearch(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;