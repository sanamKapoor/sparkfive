import React from "react";
import styles from "./asset-listing-data.module.css";
import { Utilities, AppImg } from "../../../../assets";
import { utimesSync } from "fs";
import IconClickable from "../../../common/buttons/icon-clickable";

const AssetData = () => {
  return (
    <>
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
              <span>Size</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Uploaded date</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Date modified</span>
              <img src={Utilities.arrowDownUp} />
              </div>
            </th>
            <th className={styles.thirdColumn}>
            <div className={styles.headContent}>
              <span>Extension</span>
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
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.abstraction2} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.abstraction3} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.abstraction4} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.collection1} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.collection2} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.collection10} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
                <img src={AppImg.collection8} />
              </div>
              <span>Blueprints.jpg</span>
            </div>
          </td>
          <td>
            <div className={styles.assetBox}>
              <span>13.37KB</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>05/14/23</span>
            </div>
          </td>
          <td>
            <div className={styles.createDate}>
              <span>jpeg</span>
            </div>
          </td>
          <td>
            <div className={styles.actionBtn}>
              <IconClickable
                src={Utilities.edits}
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
export default AssetData;
