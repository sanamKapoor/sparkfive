

import React from 'react';
import PropTypes from 'prop-types';
import styles from './insight-table.module.css';

const TableHeading = ({ mainText, descriptionText }) => {
  return (
    <section className={styles.tableHeading}>
      <span className={styles.heading}>{mainText}</span>
      <span className={styles.description}>{descriptionText}</span>
    </section>
  );
};

TableHeading.propTypes = {
  mainText: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
};

export default TableHeading;
