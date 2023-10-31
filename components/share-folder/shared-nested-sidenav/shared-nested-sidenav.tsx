import React from "react";
import styles from "./shared-nested-sidenav.module.css";
import { Utilities } from "../../../assets";
import Draggable from "react-draggable";
import IconClickable from "../../common/buttons/icon-clickable";
import NestedButton from "../../nested-subcollection-sidenav/button";
const data = [
  { id: 1, name: "City", quantity: 6 },
  { id: 2, name: "Renaissance", quantity: 12 },
  { id: 3, name: "Interior", quantity: 12 },
  { id: 4, name: "House", quantity: 29 },
];

export default function SharedPageSidenav() {
  return (
    <>
      <div className={`${styles["shared-sidenav-outer"]}`}>
        <div
          className={`${styles["collection-heading"]} ${styles["collection-heading-active"]}`}
        >
          <span>New collection(4)</span>
        </div>
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

      {/* portals */}
      {/* <div className={`${styles["shared-sidenav-outer"]}`}>
        <div
          className={`${styles["collection-heading"]} ${styles["collection-heading-active"]}`}
        >
          <span>New collection(4)</span>
        </div>
        <div className={styles["sidenavScroll"]}>
          <div>
             <div className={`${styles["flex"]} ${styles.nestedbox}`}>
            <div className={styles.clickable}>
              <img className={styles.rightIcon} src={Utilities.arrowBlue} />
            </div>

            <div className={`${styles["dropdownMenu"]} ${styles.active}`}>
              <div className={styles.w100}>
                <div className={styles.mainWrapper}>
                  <div className={styles.flex}>
                    <img src={Utilities.folder} />
                    <div className={styles["icon-descriptions"]}>
                      <span>name</span>
                    </div>
                  </div>
                  <div className={styles.totalCount}>
                    <div className={styles["list1-right-contents"]}>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div className={styles.folder}>
            <div className={styles.subfolderList}>
              <>
                <Draggable
                  axis="both"
                  defaultPosition={{ x: 0, y: 0 }}
                  grid={[25, 25]}
                  scale={1}
                >
                  <div className={styles.dropdownOptions}>
                    <div className={styles["folder-lists"]}>
                      <div className={styles.dropdownIcons}>
                        <img
                          className={styles.subfolder}
                          src={Utilities.folder}
                        />
                        <div className={styles["icon-descriptions"]}>
                          <span>name</span>
                        </div>
                      </div>
                      <div className={styles["list1-right-contents"]}>
                        <span>content</span>
                      </div>
                    </div>
                    
                  </div>
                </Draggable>
              </>
            </div>
          </div>

          </div>
         
        </div>
      </div> */}
    </>
  );
}
