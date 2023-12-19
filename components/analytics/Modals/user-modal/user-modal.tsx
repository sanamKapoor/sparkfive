import React from "react";
import styles from "./index.module.css";
import SearchButton from "../../insight-table/analytics-search-button/analytics-search";
import Download from "../../download-button/download";
import Datefilter from "../../date-filter/date-filter";
import Pagination from "../../Pagination/pagination";
import { insights } from "../../../../assets";
import IconClickable from "../../../common/buttons/icon-clickable";
import TableComponent from "../../insight-table/insight-table";
import TableData from "../../table-data/table-data";

function UserModal() {
  const columns = ["Viewed Link", "Viewed File", "Download File", "Date", "Actions"];
  const data = [
    {
      "Viewed Link": "Best Tips for Gardening",
      "Viewed File": "sparkfive_noah_johnson_78652439.png",
      "Download File": "—",
      Date: "Today at 04:22 pm",
      Actions: "Edit",
    },
    {
      "Viewed Link": "Delicious Recipes to Try at Home",
      "Viewed File": "sparkfive_noah_johnson_78652439.png",
      "Download File": "sparkfive_ava_anderson_75849321_3.png",
      Date: "Yesterday 03:55 pm",
      Actions: "Edit",
    },
    {
      "Viewed Link": "Ultimate Guide to Traveling Solo",
      "Viewed File": "sparkfive_sophia_wilson_36548712.png",
      "Download File": "sparkfive_william_martinez_35671248_3.png",
      Date: "Yesterday 03:55 pm",
      Actions: "Edit",
    },
    {
      "Viewed Link": "Fitness Workout Routines for Beginners",
      "Viewed File": "sparkfive_ethan_thompson_92468135.png",
      "Download File": "sparkfive_olivia_smith_12458967_2.pngg",
      Date: "05/14/23",
      Actions: "Edit",
    },
    {
      "Viewed Link": "Learn Spanish in 30 Days",
      "Viewed File": "—",
      "Download File": "—",
      Date: "05/14/23",
    },
    {
      "Viewed Link": "Chief Science Officer",
      "Viewed File": "sparkfive_william_martinez_35671248.png",
      "Download File": "sparkfive_ethan_thompson_92468135_2.png",
      Date: "05/14/23",
    },
  ];

  const arrowColumns = ["Viewed Link", "Viewed File", "Download File", "Sessions", "Date"];
  const buttonColumns = ["Actions"];
  const buttonTexts = { Actions: "View Asset" };
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
            <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} />
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
              <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} />
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
    </section>
  );
}

export default UserModal;
