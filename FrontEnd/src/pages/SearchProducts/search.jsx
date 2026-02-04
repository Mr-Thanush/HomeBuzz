import React, { useEffect, useState } from "react";
import "./search.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHeart, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../components/cartContext";
import API_URL from "../../api";

// Simple helper to render stars for ratings
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <>
      {"★".repeat(fullStars)}
      {halfStar && "½"}
      {"☆".repeat(emptyStars)}
    </>
  );
};

function SearchBar() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/products`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    setSearchTerm(searchInput.trim());
    setHasSearched(true);
  };

  useEffect(() => { if (category) setHasSearched(true); }, [category]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) return prev.filter(p => p._id !== product._id);
      return [...prev, product];
    });
  };

  if (loading) return <h2>Loading products...</h2>;

  const filteredProducts = products.filter(p => {
    const matchesCategory = category ? p.category.toLowerCase() === category.toLowerCase() : true;
    const matchesSearch = searchTerm
      ? (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (p.brand || "brand").toLowerCase().includes(searchTerm.toLowerCase()) ||
         p.category.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="SearchItems">
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search..."
          className="Search"
          value={searchInput}
          autoComplete="off"
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <button className="searchBtn" onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <div className="items">
        {!hasSearched && <h4 className="searchProducts">Search products</h4>}
        {hasSearched && filteredProducts.length === 0 && <h4 className="NoProducts">No products found</h4>}

        {hasSearched && filteredProducts.map(p => (
          <div className="item" key={p._id}>
            <div className="add">
              <FontAwesomeIcon
                icon={faHeart}
                style={{ color: wishlist.find(w => w._id === p._id) ? "red" : "black", cursor: "pointer" }}
                onClick={() => toggleWishlist(p)}
              />
              <p className="ItemRating">({p.ratings.toFixed(1)})</p>
              <FontAwesomeIcon
                icon={faCartShopping}
                onClick={() => addToCart(p)}
                style={{ cursor: "pointer" }}
              />
            </div>

            <Link to={`/product/${p._id}`} className="searchLink">
              <div className="itemimg">
                <div className="productDiv">Product Div</div>
                {p.stock < 5 && <h6 className="limited">Limited Stock</h6>}
              </div>
            </Link>

            <div className="itemdetails">
              <h4 className="BrandName">{p.brand || "Brand"}</h4>
              <h5 className="ItemName">{p.name}</h5>
              <p className="ItemABout">{p.about || "No description"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;