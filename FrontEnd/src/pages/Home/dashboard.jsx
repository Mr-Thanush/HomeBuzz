import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:9090/api/v1/products");
        const data = await res.json();

        const fetchedProducts = data.products || [];
        setProducts(fetchedProducts);

        // CASE-INSENSITIVE UNIQUE CATEGORIES
        const categoryMap = new Map();

        fetchedProducts.forEach((p) => {
          if (!p.category) return;

          const normalized = p.category.toLowerCase(); // fashion, electronics

          if (!categoryMap.has(normalized)) {
            categoryMap.set(normalized, {
              _id: normalized,
              name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
            });
          }
        });

        setCategories(Array.from(categoryMap.values()));
        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  // Rating Renderer
  const renderRating = (product) => {
    const rating = product.ratings ? product.ratings.toFixed(1) : "0.0";
    const count = product.noOfReviews || 0;

    return (
      <div className="ratingBlock">
        <span className="stars">⭐ {rating}</span>
        <span className="reviewCount">
          ({count} review{count !== 1 ? "s" : ""})
        </span>
      </div>
    );
  };

  // Latest deals (60%+ discount)
  const latestDeals = [...products]
    .filter((p) => (p.discount || 0) >= 60)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Higher selling
  const higherSelling = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  return (
    <div className="HomePage">

      {/* Search Bar */}
      <Link to="/search" className="searchLink">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search..."
            className="Search"
            disabled
          />
          <button className="searchBtn">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </Link>

      {/* Higher Selling */}
      <div className="HigherSelling">
        <h1 className="HigherSellingName">Higher Selling</h1>

        <div className="sliderTrack">
          {higherSelling.map((p) => (
            <div className="slide" key={p._id}>
              <Link to={`/product/${p._id}`} className="link">
                <div className="productDiv">Product Image</div>
                <h2>{p.name}</h2>
                {renderRating(p)}
                <p>₹{p.price || 0}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Deals */}
      <div className="latest">
        <h1 className="latestName">Latest Deals &gt; 60% Off</h1>

        <div className="latestItems">
          {latestDeals.map((p) => (
            <div className="latestCard" key={p._id}>
              <Link to={`/product/${p._id}`} className="link">
                <div className="productDiv">Product Image</div>
                <h3 className="dealName">{p.name}</h3>
                {renderRating(p)}
                <h4 className="Price">₹{p.price || 0}</h4>
                <h5 className="Discount">{p.discount || 0}% off</h5>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/*  Categories */}
      <div className="categoryItems">
        <h1 className="categoryHeading">Categories</h1>

        <div className="categoriesContaniors">
          {categories.map((c) => (
            <Link
              to={`/search?category=${c.name}`}
              key={c._id}
              className="categoryLink"
            >
              <div className="categoryCard">
                <div className="categoryDiv">Category</div>
                <h3 className="categoryName">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;