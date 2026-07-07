import React, { useEffect } from "react";
import Navbar from "../Components/navBar.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import Product from "../Components/product.jsx";
import Loader from "../Components/loader.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeErrors } from "../Components/features/Products/productSlice";
import { toast } from "react-toastify";
import "../Styles/home.css";

function Home() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products } = useSelector((state) => state.product);

  // Mount logic fetch
  useEffect(() => {
    dispatch(getProduct({ keyword: "" }));
  }, [dispatch]);

  // Error boundary tracker
  useEffect(() => {
    if (error) {
      const errorMsg = typeof error === "string" ? error : error.message || "Failed to fetch products";
      toast.error(errorMsg, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const goToSearch = () => { 
    navigate("/search");
  };

  // Memoized array sorting logic fallbacks
  const topSellerProducts = products?.length
    ? [...products]
        .filter((product) => (product.ratings || 0) > 0)
        .sort((a, b) => (b.noOfReviews || 0) - (a.noOfReviews || 0))
    : [];

  const latestDeals = products?.length
    ? [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const categories = products?.length
    ? [...new Set(products.map((p) => p.category).filter(Boolean))]
    : [];

  const goToCategorySearch = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="home-page-wrapper">
      <PageTitle title="Home - HomeBuzz"/>
      <Navbar />

      <main className="home-container">
        {/* Clickable Search Bar Input Bar Mask */}
        <div className="home-search">
          <input
            type="text"
            placeholder="Search homemade food, pickles, handmade items..."
            readOnly
            onClick={goToSearch}
            aria-label="Search items link wrapper"
          />
        </div>

        {/* Top Sellers Segment */}
        {topSellerProducts.length > 0 && (
          <section className="home-section">
            <h2>Top Seller Items</h2>
            {/* Added home-track class wrapper */}
            <div className="horizontal-scroll home-track">
              {topSellerProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Deals Segment */}
        {latestDeals.length > 0 && (
          <section className="home-section">
            <h2>Latest Deals</h2>
            {/* Added home-track class wrapper */}
            <div className="horizontal-scroll home-track">
              {latestDeals.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Category Map Element */}
        {categories.length > 0 && (
          <section className="home-section">
            <h2>Browse Categories</h2>
            <div className="category-grid">
              {categories.map((category) => (
                <button 
                  key={category} 
                  className="category-card"
                  onClick={() => goToCategorySearch(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;