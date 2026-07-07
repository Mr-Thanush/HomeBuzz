import React, { useEffect, useRef, useState } from "react";
import { BsBookmarkHeart } from "react-icons/bs";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Components/navBar.jsx";
import Loader from "../Components/loader.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import Ratings from "../Components/ratings.jsx";
import Pagination from "../Components/pagination.jsx";
import { getProduct, removeErrors, clearProducts } from "../Components/features/Products/productSlice";
import { addToLikeList, removeError, removeMessage } from "../Components/features/Like/likeSlice";
import "../Styles/search.css";

function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  const { keyword } = useParams();
  const [searchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const { loading: likeLoading, error: likeError, message, success } = useSelector((state) => state.like);
  const { loading, error, products = [], pages = 1 } = useSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const pageFromURL = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);

  const handleAddToLikeList = (productId) => {
    dispatch(addToLikeList({ id: productId, quantity: 1 }));
  };

  useEffect(() => {
    if (!keyword && !category) {
      dispatch(clearProducts());
    }
    inputRef.current?.focus();
  }, [dispatch, keyword, category]);

  useEffect(() => {
    if (!keyword && !category) return;

    const cleanKeyword = keyword ? keyword.trim() : "";
    setSearch(cleanKeyword);
    setHasSearched(true);

    dispatch(
      getProduct({
        keyword: cleanKeyword,
        category,
        page: currentPage,
      })
    );
  }, [dispatch, keyword, category, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (likeError) {
      toast.error(likeError, { position: "top-center", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, likeError]);

  useEffect(() => {
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setCurrentPage(1);
    setHasSearched(true);
    navigate(`/search/${encodeURIComponent(search.trim())}`);
  };

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);

    const params = new URLSearchParams(location.search);
    page === 1 ? params.delete("page") : params.set("page", page);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="search-page-wrapper">
      {loading && <Loader />}
      <Navbar />
      <PageTitle title="Search Products - HomeBuzz" />

      <main className="search-page">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search our collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {!hasSearched && (
          <p className="before-results">Start typing to search products...</p>
        )}

        {hasSearched && !loading && products.length === 0 && (
          <p className="no-results">
            No products found {category ? `in ${category}` : `for "${search}"`}
          </p>
        )}

        <div className="results-list">
          {hasSearched &&
            products.map((product) => {
              const stockClass =
                product.stock === 0
                  ? "out"
                  : product.stock <= 5
                  ? "limited"
                  : "available";

              return (
                <div key={product._id} className={`result-card-item ${stockClass}`}>
                  <Link to={`/product/${product._id}`} className="link">
                    <div className="resultImage">
                      <img
                        src={product.image?.[0]?.url || "/assets/placeholder.png"}
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  <div className="resultDetails">
                    <div className="resultActions">
                      <Ratings value={product.ratings || 0} disabled />
                      <button
                        type="button"
                        className="likeButton"
                        disabled={likeLoading || product.stock <= 0}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToLikeList(product._id);
                        }}
                        aria-label="Add to wishlist"
                      >
                        <BsBookmarkHeart className="icon wish" />
                      </button>
                    </div>

                    <Link to={`/product/${product._id}`} className="link-details-overlay">
                      <div className="resultDescription">
                        <span className="resultBrand">{product.brand}</span>
                        <h3 className="resultName">{product.name}</h3>
                        <p className="resultDiscription">{product.description}</p>
                        <span className="resultPrice">₹ {product.price}</span>
                        <span className={`stock-indicator-badge ${stockClass}`}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>

        {hasSearched && pages > 1 && (
          <div className="pagination-container-layout">
            <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Search;