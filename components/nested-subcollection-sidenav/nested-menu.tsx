import React from "react";
import styles from "./nested-menu.module.css";
import { Utilities } from "../../assets";

const NestedMenu = () => {
  return (
    <div className={styles.nestedMenu}>
      <div className={styles.menuIcon}>
        <img className={styles.rightIcon} src={Utilities.menu} />
      </div>
      <div className={styles.menuDesc}>
        <span>Menu</span>

      </div>

    </div>
  );
};

export default NestedMenu;
