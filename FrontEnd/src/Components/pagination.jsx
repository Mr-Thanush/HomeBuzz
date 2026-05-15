import React from "react";
import { useSelector } from "react-redux";
import "../Styles/pagination.css";

function Pagination({
  currentPage = 1,
  onPageChange,
  activePage = "active",
  nextPage = ">",
  prevPage = "<",
  firstPage = "|<",
  lastPage = ">|",
}) {
  //CORRECT SLICE NAME
  const { pages, products } = useSelector((state) => state.product);

  //SAFETY CHECK
  if (!products || products.length === 0 || !pages || pages <= 1) {
    return null;
  }

  // GENERATE PAGE NUMBERS
  const getPageNumbers = () => {
    const pageNumbers = [];
    const window = 2;

    const start = Math.max(1, currentPage - window);
    const end = Math.min(pages, currentPage + window);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      {/* FIRST + PREV */}
      {currentPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>
            {firstPage}
          </button>

          <button onClick={() => onPageChange(currentPage - 1)}>
            {prevPage}
          </button>
        </>
      )}

      {/* PAGE NUMBERS */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={page === currentPage ? activePage : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* NEXT + LAST */}
      {currentPage < pages && (
        <>
          <button onClick={() => onPageChange(currentPage + 1)}>
            {nextPage}
          </button>

          <button onClick={() => onPageChange(pages)}>
            {lastPage}
          </button>
        </>
      )}
    </div>
  );
}

export default Pagination;