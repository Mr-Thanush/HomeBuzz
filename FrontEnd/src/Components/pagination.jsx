import React from "react";
import { useSelector } from "react-redux";
import "../Styles/pagination.css";

function Pagination({
  currentPage = 1,
  onPageChange,
  activeClass = "active",
  nextLabel = "Next ›",
  prevLabel = "‹ Prev",
  firstLabel = "« First",
  lastLabel = "Last »",
}) {
  const { pages, products } = useSelector((state) => state.product || {});

  if (!products || products.length === 0 || !pages || pages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const windowRange = 2;
    const start = Math.max(1, currentPage - windowRange);
    const end = Math.min(pages, currentPage + windowRange);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      {currentPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} aria-label="Go to first page">
            {firstLabel}
          </button>
          <button onClick={() => onPageChange(currentPage - 1)} aria-label="Go to previous page">
            {prevLabel}
          </button>
        </>
      )}

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={page === currentPage ? activeClass : ""}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      {currentPage < pages && (
        <>
          <button onClick={() => onPageChange(currentPage + 1)} aria-label="Go to next page">
            {nextLabel}
          </button>
          <button onClick={() => onPageChange(pages)} aria-label="Go to last page">
            {lastLabel}
          </button>
        </>
      )}
    </nav>
  );
}

export default Pagination;