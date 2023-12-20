import React from 'react';
import styles from "./insights.header.module.css";

export default function InsightsHeader({ title, companyName }) {
  return (
    // header-on-toggle this will be added conditionally 
    <section className={styles.header}>
      <span className={styles.titles}>
        {title}
      </span>
      <span className={styles.hyphen}>
        {' - '}
      </span>
      <span className={styles.companyName}>
        {companyName}
      </span>
    </section>
  );
}
