import React from "react";
import styles from "./sub-collection-data.module.css";
import { Utilities, AppImg } from "../../../assets";
import { utimesSync } from "fs";
import IconClickable from "../../common/buttons/icon-clickable";
import SubCollectionHeading from "./sub-collection-heading";

const SubCollectionData = () => {
  return (
    <>
    <SubCollectionHeading/>
     <table className={`${styles["table-head"]}`}>
        <thead>
          <tr className={`${styles["tableHead-row"]}`}>
            <th className={styles.firstColumn}>
                <div className={styles.headContent}>
                <span>Name</span>
              <img src={Utilities.arrowDownUp} />
                </div>
             
            </th>
            <th className={styles.secondColumn}>
            <div className={styles.headContent}>
              <span>Assets</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Create date</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.fourthColumn}>Action</th>
          </tr>
        </thead>
     
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
      </table>
    </>
  );
};
export default SubCollectionData;
