import "../Styles/search.css";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import { BsBookmarkHeart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/loader";
import { toast } from "react-toastify";
import {getProduct,removeErrors,clearProducts} from "../Components/features/Products/productSlice";
import PageTitle from "../Components/pageTitle";
import Ratings from "../Components/ratings";
import {Link,useLocation, useNavigate, useParams,useSearchParams} from "react-router-dom";
import Pagination from "../Components/pagination";
import {addToLikeList,removeError,removeMessage} from "../Components/features/Like/likeSlice";

function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  const { keyword } = useParams();
  const [searchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const {loading: likeLoading,error: likeError,message,success} = useSelector((state) => state.like);

  const { loading, error, products = [], pages = 1 } = useSelector(
    (state) => state.product
  );

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
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (likeError) {
      toast.error(likeError, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeError());
    }
  }, [dispatch, likeError]);

  
  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setCurrentPage(1);
    setHasSearched(true);
    navigate(`/search/${search.trim()}`);
  };

 
  const handlePageChange = (page) => {
    if (page === currentPage) return;

    setCurrentPage(page);

    const params = new URLSearchParams(location.search);
    page === 1 ? params.delete("page") : params.set("page", page);
    navigate(`?${params.toString()}`);
  };

  return (
    <>
      {loading && <Loader />}

      <div className="search-page">
        <Navbar />
        <PageTitle title="Search - HomeBuzz" />

        {/* SEARCH BAR */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* BEFORE SEARCH */}
        {!hasSearched && (
          <p className="before-results">
            Start typing to search products
          </p>
        )}

        {/* NO RESULTS */}
        {hasSearched && !loading && products.length === 0 && (
          <p className="no-results">
            No products found{" "}
            {category ? `in ${category}` : `for "${search}"`}
          </p>
        )}

        {/* RESULTS */}
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
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="link"
                >
                  <div className={`result ${stockClass}`}>
                    <div className="resultImage">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                      />
                    </div>

                    <div className="resultDetails">
                      <div className="resultActions">
                        <Ratings value={product.ratings || 0} disabled />

                        <button
                          className="likeButton"
                          disabled={likeLoading || product.stock <= 0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToLikeList(product._id);
                          }}
                        >
                          <BsBookmarkHeart className="icon wish" />
                        </button>
                      </div>

                      <div className="resultDescription">
                        <p className="resultBrand">{product.brand}</p>
                        <p className="resultName">{product.name}</p>
                        <p className="resultDiscription">
                          {product.description}
                        </p>
                        <p className="resultPrice">
                          <b>₹ {product.price}</b>
                        </p>
                        <p className="resultStock">
                          {product.stock > 0
                            ? `In Stock (${product.stock})`
                            : "Out of Stock"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

          {/* PAGINATION */}
          {hasSearched && pages > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Search;