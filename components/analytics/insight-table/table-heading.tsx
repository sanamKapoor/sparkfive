

import React from 'react';
import styles from './insight-table.module.css';

const TableHeading = ({ mainText, descriptionText, smallHeading = false }) => {
  return (
    <section className={styles.tableHeading}>
      <span className={smallHeading ? styles.smallHeading : styles.heading}>{mainText}</span>
      {descriptionText && <span className={styles.description}>{descriptionText}</span>}
    </section>
  );
};

export default TableHeading;
