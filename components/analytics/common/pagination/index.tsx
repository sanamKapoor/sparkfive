import React, { useContext, useEffect, useState } from "react";
import styles from "./pagination.module.css";
import { insights } from "../../../../assets";
import { AnalyticsContext } from "../../../../context";
import { analyticsLayoutSection } from "../../../../constants/analytics";

function Pagination() {
  const pageNumbers = ["1", "2", "3", "4"];
  const { page, limit, setPage, totalRecords, activeSection } = useContext(AnalyticsContext);
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    setActivePage(typeof page === 'number' ? page : 1)
  }, [page])

  useEffect(() => {
    if (totalRecords > 0 && limit > 0) setTotalPages(Math.ceil(totalRecords / limit));
  }, [totalRecords, limit]);

  const handlePrevClick = () => {
    if (activePage === 1) return;
    setActivePage(activePage - 1)
    setPage(activePage - 1)
  };

  const handleNextClick = () => {
    if (activePage === totalPages) return;
    setActivePage(activePage + 1)
    setPage(activePage + 1)
  };

  const handlePageClick = (newPage) => {
    setActivePage(newPage)
    setPage(newPage)
  };

  const renderNumericPagination = () => {
    const pages = [];
    const maxPagesToShow = 3; // Adjust this based on how many pages you want to show

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <span
            key={i}
            className={`${styles['pagination-left-arrow']} ${styles['pagination-box']} ${activePage === i && styles['active']}`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </span>,
        );
      }
    } else {
      // Show ellipsis before and after the current page
      const startPage = Math.max(1, activePage - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (startPage > 1) {
        pages.push(<span key="ellipsis-start">...</span>);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <span
            key={i}
            className={`${styles['pagination-left-arrow']} ${styles['pagination-box']} ${activePage === i && styles['active']}`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </span>,
        );
      }

      if (endPage < totalPages) {
        pages.push(<span key="ellipsis-end">...</span>);
      }
    }

    return pages;
  };

  return (
    <section className={styles.pagination}>
      <div className={`${styles['pagination-left']}`}>
        <span>{(activePage - 1) * limit + 1}-{Math.min(activePage * limit, totalRecords)} of {totalRecords}</span>
      </div>
      <div className={`${styles['pagination-right']}`}>
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']} ${activePage === 1 ? styles['disable'] : ''}`} onClick={handlePrevClick}>
        <img src={activePage === 1 ? insights.paginationDisableLeft : insights.paginationLeft} alt="disabled-left-arrow" />
        </div>
        {
          renderNumericPagination() 
          // pageNumbers.map((pageNumber) => (
          //   <div key={pageNumber} className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
          //     <span className={activePage === 1 ? styles['active'] : ''}>{pageNumber}</span>
          //   </div>
          // ))
        }
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']} ${activePage === totalPages ? styles['disable'] : ''}`} onClick={handleNextClick}>
          <img src={activePage === totalPages ? insights.paginationDisableRight : insights.paginationRight} alt="right-arrow" />
        </div>
      </div>
    </section>
  );
}

export default Pagination;
