import React from "react";
import styles from "./sub-collection-data.module.css";
import { Utilities, AppImg } from "../../../assets";
import { utimesSync } from "fs";
import IconClickable from "../../common/buttons/icon-clickable";

const SubCollectionData = () => {
  return (
    <>
      <tbody>
        <tr className={`${styles["table-head-row"]}`}>
          <td>
            <div className={styles.DataContainer}>
              <div className={styles.imageWrapper}>
                <img src={AppImg.abstraction1} />
              </div>
              <span>Architecture</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>72</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edit}
                additionalClass={styles["edit-icon"]}
              />
              <IconClickable
                src={Utilities.tabulardots}
                additionalClass={styles["dot-icon"]}
              />
            </div>
          </td>
        </tr>
        <tr className={`${styles["table-head-row"]}`}>
          <td>
            <div className={styles.DataContainer}>
              <div className={styles.imageWrapper}>
                <img src={AppImg.subcollection5} />
              </div>
              <span>Renaissance</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>72</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edit}
                additionalClass={styles["edit-icon"]}
              />
              <IconClickable
                src={Utilities.tabulardots}
                additionalClass={styles["dot-icon"]}
              />
            </div>
          </td>
        </tr>
        <tr className={`${styles["table-head-row"]}`}>
          <td>
            <div className={styles.DataContainer}>
              <div className={styles.imageWrapper}>
                <img src={AppImg.subcollection9} />
              </div>
              <span>Interior</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>72</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edit}
                additionalClass={styles["edit-icon"]}
              />
              <IconClickable
                src={Utilities.tabulardots}
                additionalClass={styles["dot-icon"]}
              />
            </div>
          </td>
        </tr>
        <tr className={`${styles["table-head-row"]}`}>
          <td>
            <div className={styles.DataContainer}>
              <div className={styles.imageWrapper}>
                <img src={AppImg.subcollection9} />
              </div>
              <span>Interior</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>72</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edit}
                additionalClass={styles["edit-icon"]}
              />
              <IconClickable
                src={Utilities.tabulardots}
                additionalClass={styles["dot-icon"]}
              />
            </div>
          </td>
        </tr>
       
      </tbody>
    </>
  );
};
export default SubCollectionData;
