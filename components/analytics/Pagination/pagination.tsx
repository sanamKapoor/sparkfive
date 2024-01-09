import React, { useContext } from 'react';
import styles from './pagination.module.css';
import { insights } from '../../../assets';
import { AnalyticsContext } from '../../../context';

function Pagination() {
  const { page, limit, setPage, totalRecords } = useContext(AnalyticsContext);
  const totalPages = totalRecords > limit ? Math.ceil(totalRecords / limit) : totalRecords;

  const handlePrevClick = () => {
    if(page === 1) return;
    setPage(Math.max(page - 1, 1))
  };

  const handleNextClick = () => {
    if(page === totalPages) return;
    setPage(Math.min(page + 1, totalPages))
  };

  const handlePageClick = (newPage) => {
    setPage(newPage)
  };

  const renderNumericPagination = () => {
    const pages = [];
    const maxPagesToShow = 5; // Adjust this based on how many pages you want to show
  
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <span
            key={i}
            className={i === page ? 'active' : ''}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </span>
        );
      }
    } else {
      // Show ellipsis before and after the current page
      const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
      if (startPage > 1) {
        pages.push(<span key="ellipsis-start">...</span>);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <span
            key={i}
            className={i === page ? 'active' : ''}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </span>
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
        <span>{page}-{totalRecords > limit ? limit : totalRecords} of {totalRecords} items</span>
      </div>
      <div className={`${styles['pagination-right']}`}>
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`} onClick={handlePrevClick}>
          <img src={insights.paginationLeft} alt="left -arrow" />
        </div>
        {/* {pageNumbers.map((pageNumber) => (
          <div key={pageNumber} className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
            <span className={pageNumber === 1 ? styles['active'] : ''}>{pageNumber}</span>
          </div>
        ))} */}
        {renderNumericPagination()}
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`} onClick={handleNextClick}>
          <img src={insights.paginationRight} alt="right-arrow" />
        </div>
      </div>
    </section>
  );
}

export default Pagination;
