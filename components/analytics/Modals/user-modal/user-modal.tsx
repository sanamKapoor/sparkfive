import React from "react";
import styles from "./index.module.css";
import SearchButton from "../../common/analytics-search-button/analytics-search";
import Download from "../../common/download-button/download";
import Datefilter from "../../common/date-filter/date-filter";
import Pagination from "../../Pagination/pagination";
import { insights } from "../../../../assets";
import IconClickable from "../../../common/buttons/icon-clickable";
import TableComponent from "../../insight-table/insight-table";
import TableData from "../../table-data/table-data";
import { userModalcolumns,userModaldata,userModalarrowColumns, userModalbuttonColumns,userModalbuttonTexts  } from "../../../../data/analytics";

function UserModal({
  setShowModal
}: { setShowModal: (show: boolean) => void }) {



  return (
    <section className={`${styles["user-modal-outer"]}`}>
      <div className={`${styles["user-modal"]}`}>
        <div className={`${styles["user-detail-top"]}  ${styles["web-view"]}`}>
          <div className={`${styles["user-detail"]}`}>
            <p>
              Email: <span>harveyelliott@mail.com</span>
            </p>
            <p>
              Last Session Date: <span>05/14/23</span>
            </p>
          </div>
          <div className={`${styles["table-header-tabs"]}`}>
            <SearchButton label="Search User" />
            <Datefilter />
            <Download />
            <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} onClick={() => setShowModal(false)} />
          </div>
        </div>
        {/* for laptop */}
        <div className={`${styles["laptop-view"]}`}>
          <div className={`${styles["heading-wrap"]}`}>
            <div className={`${styles["laptop-view-wrap"]}`}>
              <div className={`${styles["user-detail"]}`}>
                <p>
                  Email: <span>harveyelliott@mail.com</span>
                </p>
                <p>
                  Last Session Date: <span>05/14/23</span>
                </p>
              </div>
              <div>
                <SearchButton label="Search User" />
              </div>
            </div>
            <div className={`${styles["table-header-tabs"]}`}>
              <Datefilter />
              <Download />
              <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} onClick={() => setShowModal(false)} />
            </div>
          </div>
        </div>
        {/* for mobile */}
        <div className={`${styles["mobile-view"]}`}>
          <div className={`${styles["heading-wraps"]}`}>
            <div className={`${styles["teb-mob-view"]}`}>
              <div className={`${styles["user-detail"]}`}>
                <p>
                  Email: <span>harveyelliott@mail.com</span>
                </p>
                <p>
                  Last Session Date: <span>05/14/23</span>
                </p>
              </div>
              <div className={`${styles["close-mob"]}`}>
                <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} onClick={() => setShowModal(false)} />
              </div>
            </div>
            <div className={`${styles["filter-mob"]}`}>
              <Datefilter />
              <Download />
            </div>
          </div>

          <div style={{ marginTop: "22px" }}>
            <SearchButton label="Search User" />
          </div>
        </div>

        <TableData
          columns={userModalcolumns}
          data={userModaldata}
          arrowColumns={userModalarrowColumns}
          buttonColumns={userModalbuttonColumns}
          buttonTexts={userModalbuttonTexts}
          imageSource="ImageSource"
        />
        <Pagination />
      </div>
    </section>
  );
}

export default UserModal;
