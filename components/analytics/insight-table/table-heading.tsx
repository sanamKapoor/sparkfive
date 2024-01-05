

import React from 'react';
import PropTypes from 'prop-types';
import styles from './insight-table.module.css';

const TableHeading = ({ mainText, descriptionText, smallHeading = false }) => {
  return (
    <section className={styles.tableHeading}>
      <span className={smallHeading ? styles.smallHeading : styles.heading}>{mainText}</span>
      {descriptionText && <span className={styles.description}>{descriptionText}</span>}
    </section>
  );
};

TableHeading.propTypes = {
  mainText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
};

export default TableHeading;
