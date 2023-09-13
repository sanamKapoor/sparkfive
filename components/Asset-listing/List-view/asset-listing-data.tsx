import React from "react";
import styles from "./asset-listing-data.module.css";
import { Utilities, AppImg } from "../../../assets";
import { utimesSync } from "fs";
import IconClickable from "../../common/buttons/icon-clickable";

const AssetData = () => {
  return (
    <>
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
export default AssetData;
