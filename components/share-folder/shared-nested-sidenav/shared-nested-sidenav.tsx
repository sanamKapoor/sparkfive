import React from "react";
import styles from "./shared-nested-sidenav.module.css";
import { Utilities } from "../../../assets";
const data = [
  { id: 1, name: "City", quantity: 6 },
  { id: 2, name: "Renaissance", quantity: 12 },
  { id: 3, name: "Interior", quantity: 12 },
  { id: 4, name: "House", quantity: 29 },
];

export default function SharedPageSidenav() {
  return (
    <div className={`${styles["shared-sidenav-outer"]}`}>
      {/* heading */}
      <div
        className={`${styles["collection-heading"]} ${styles["collection-heading-active"]}`}
      >
        <span>New collection(4)</span>
      </div>
      {/* list contents */}
      <div className={styles["sidenavScroll"]}>
        <div className={styles["sidenav-list1"]}>
          <ul>
            {data.map((item) => (
              <li
                key={item.id}
                className={`${styles["list1-description"]} ${styles["border-bottom"]}`}
              >
                <div className={styles["list1-left-contents"]}>
                  <div className={styles.icon}>
                    <img src={Utilities.folder} alt="" />
                  </div>
                  <div className={styles["icon-description"]}>
                    <span>{item.name}</span>
                  </div>
                </div>
                <div className={styles["list1-right-contents"]}>
                  <span>{item.quantity}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
