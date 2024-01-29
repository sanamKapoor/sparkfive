import React from "react";
import styles from "./insights.header.module.css";
import { Utilities } from "../../../../assets";

export default function InsightsHeader({ title, companyName = "Hooli Inc." }) {
  return (
    <>
      <section className={styles.header}>
        <div className={styles.menubar}>
          <div className={styles.nestedMenu}>
            <div className={styles.menuIcon}>
              <img className={styles.rightIcon} src={Utilities.menu} />
            </div>
            <div className={styles.menuDesc}>
              <span>Menu</span>
            </div>
          </div>
        </div>

        {/* header-on-toggle this will be added conditionally  */}
        <div className={styles.tabletop}>
          <span className={styles.titles}>{title}</span>
          <span className={styles.hyphen}>{" - "}</span>
          <span className={styles.companyName}>{companyName}</span>
        </div>
      </section>
    </>
  );
}
