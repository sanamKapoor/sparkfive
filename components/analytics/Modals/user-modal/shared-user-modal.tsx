import React from "react";
import styles from "./index.module.css";
import TableData from "../../table-data/table-data";
import SearchButton from "../../insight-table/analytics-search-button/analytics-search";
import Download from "../../download-button/download";
import Datefilter from "../../date-filter/date-filter";
import Pagination from "../../Pagination/pagination";
import IconClickable from "../../../common/buttons/icon-clickable";
import { insights } from "../../../../assets";


function SharedUserModal() {
  const columns = ["Activity", "User name", "Date"];
  const data = [
    {
      Activity: "Downloaded sparkfive_julia_martinez_23540872.png",
      "User name": "rsorwheide@acme.com",
      Date: "Today at 04:22 pm",
    },
    {
      Activity: "Viewed sparkfive_david_anderson_67215691.png",
      "User name": "dmoon@acme.com",
      Date: "Today at 04:22 pm",
    },
    {
        Activity: "Viewed sparkfive_sarah_johnson_81754025.png",
        "User name": "tweber@acme.com",
        Date: "Yesterday 03:55 pm"
    },
    {
        Activity: "Downloaded sparkfive_emily_rodriguez_94820356.png",
        "User name": "ajefferson@acme.com",
        Date: "05/14/23"
    },
    {
        Activity: "Downloaded sparkfive_leo_graham_94820356.png",
        "User name": "jgraham@acme.com",
        Date: "05/14/23"
    },
  ];

  const arrowColumns = ["Activity", "User name", "Date"];
  const buttonColumns = ["Actions"];
  const buttonTexts = { Actions: "View Asset" };
  return (
    <section className={`${styles["user-modal-outer"]}`}>
    <div className={`${styles["user-modal"]}`}>
    <div>
          <div className={`${styles["user-detail-top"]}  ${styles["web-view"]}`}>
          <div className={`${styles["user-detail-link"]}`}>
          <p className={styles.shareHeading}>Pepsi Colab - <span className={styles.shareInfo}>User Activity</span></p>
          <span  className={styles.link}><a href="">https://app.sparkfivetest.com/collections/spiderverseee_IIc/38aba57c820fdfa624567100f9ecd424/test123</a></span>
          </div>
          <div className={`${styles["table-header-tabs"]}`}>
            <SearchButton label="Search User" />
            <Datefilter />
            <Download />
            <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} />
          </div>
        </div>
        {/* for laptop */}
        <div className={`${styles["laptop-view"]}`}>
          <div className={`${styles["heading-wrap"]}`}>
            <div className={`${styles["laptop-view-wrap"]}`}>
              <div className={`${styles["user-detail-link"]}`}>
              <p className={styles.shareHeading}>Pepsi Colab - <span className={styles.shareInfo}>User Activity</span></p>
              <span className={styles.link} ><a href="">https://app.sparkfivetest.com/collections/spiderverseee_IIc/38aba57c820fdfa624567100f9ecd424/test123</a></span>
              </div>
              <div>
                <SearchButton label="Search User" />
              </div>
            </div>
            <div className={`${styles["table-header-tabs"]}`}>
              <Datefilter />
              <Download />
              <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} />
            </div>
          </div>
        </div>
        {/* for mobile */}
        <div className={`${styles["mobile-view"]}`}>
          <div className={`${styles["heading-wraps"]}`}>
            <div className={`${styles["teb-mob-view"]}`}>
            <div className={`${styles["user-detail-link"]}`}>
              <p className={styles.shareHeading}>Pepsi Colab - <span className={styles.shareInfo}>User Activity</span></p>
              <span className={styles.link} ><a href="">https://app.sparkfivetest.com/collections/spiderverseee_IIc/38aba57c820fdfa624567100f9ecd424/test123</a></span>
              </div>
              <div className={`${styles["close-mob"]}`}>
                <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} />
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
        columns={columns}
        data={data}
        arrowColumns={arrowColumns}
        buttonColumns={buttonColumns}
        buttonTexts={buttonTexts}
        imageSource="ImageSource"
      />
      <Pagination />
    </div>
    </div>
    </section>
  );
}

export default SharedUserModal;
