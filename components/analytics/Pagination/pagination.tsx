import React from 'react';
import styles from './pagination.module.css';
import { insights } from '../../../assets';

function Pagination() {
  const pageNumbers = [1, 2, 3, 4]; 

  return (
    <section className={styles.pagination}>
      <div className={`${styles['pagination-left']}`}>
        <span>1-10 of 112 items</span>
      </div>
      <div className={`${styles['pagination-right']}`}>
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
          <img src={insights.paginationLeft} alt="left -arrow" />
        </div>
        {pageNumbers.map((pageNumber) => (
          <div key={pageNumber} className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
            <span className={pageNumber === 1 ? styles['active'] : ''}>{pageNumber}</span>
          </div>
        ))}
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
          <span>...</span>
        </div>
        <div className={`${styles['pagination-left-arrow']} ${styles['pagination-box']}`}>
          <img src={insights.paginationRight} alt="right-arrow" />
        </div>
      </div>
    </section>
  );
}

export default Pagination;
