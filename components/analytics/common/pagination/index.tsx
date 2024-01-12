import React, { useContext } from 'react';
import styles from './pagination.module.css';
import { insights } from '../../../../assets';
import { AnalyticsContext } from '../../../../context';
import { analyticsLayoutSection } from '../../../../constants/analytics';

function Pagination() {
  const pageNumbers = ["1", "2", "3", "4"]
  const { page, limit, setPage, totalRecords, activeSection } = useContext(AnalyticsContext);
  const totalPages = Math.ceil(totalRecords / limit);

  const handlePrevClick = () => {
    if (page === 1) return;
    setPage(page - 1)
  };

  const handleNextClick = () => {
    if (page === totalPages) return;
    setPage(page + 1)
  };

  const handlePageClick = (newPage) => {
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
            className={`${styles['pagination-left-arrow']} ${styles['pagination-box']} ${page === i && styles['active']}`}
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
            className={`${styles['pagination-left-arrow']} ${styles['pagination-box']} ${page === i && styles['active']}`}
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
        <span>{(page - 1) * limit + 1}-{Math.min(page * limit, totalRecords)} of {totalRecords}</span>
      </div>
      <div className={`${styles['pagination-right']}`}>
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`} style={{
          cursor: page === 1 ? 'not-allowed' : 'pointer'
        }} onClick={handlePrevClick}>
          <img src={insights.paginationLeft} alt="left -arrow" />
        </div>
        {activeSection === analyticsLayoutSection.ACCOUNT_USERS ? renderNumericPagination() :
          pageNumbers.map((pageNumber) => (
            <div key={pageNumber} className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
              <span className={page === 1 ? styles['active'] : ''}>{pageNumber}</span>
            </div>
          ))
        }
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`} style={{
          cursor: page === totalPages ? 'not-allowed' : 'pointer'
        }} onClick={handleNextClick}>
          <img src={insights.paginationRight} alt="right-arrow" />
        </div>
      </div>
    </section>
  );
}

export default Pagination;
