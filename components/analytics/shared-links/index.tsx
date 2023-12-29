import React from "react";
import styles from "./index.module.css";
import { Utilities, insights } from "../../../assets";
import ShareLinkTable from "./share-link-table";
import IconClickable from "../../common/buttons/icon-clickable";
import TableHeading from "../insight-table/table-heading";
import SearchButton from "../insight-table/analytics-search-button/analytics-search";
import Download from "../download-button/download";
import Datefilter from "../date-filter/date-filter";
import Pagination from "../Pagination/pagination";

function ShareLinkPage() {
  const columns = ["Link name", "Shared by", "Views", "Downloads", "Date created", "Types", "Actions"];
  const data = [
    {
      "Link name": "Best Tips for Gardening",
      "Shared by": "Seraphina Alexandra Montgomery-Smith",
      icon: insights.userImg1,
      Views: "4,1388",
      Downloads: "444",
      "Date created": "01/03/23",
      Types: "Collection",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Delicious Recipes to Try at Home",
      "Shared by": "Harvey Elliott",
      icon: insights.userImg2,
      Views: "4,077",
      Downloads: "572",
      "Date created": "03/23/23",
      Types: "Portal",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Ultimate Guide to Traveling Solo",
      "Shared by": "Charles Wells",
      icon: insights.userImg3,
      Views: "4,077",
      Downloads: "572",
      "Date created": "03/23/23",
      Types: "Collection",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Fitness Workout Routines for Beginners",
      "Shared by": "John Ali",
      icon: insights.userImg4,
      Views: "4,077",
      Downloads: "572",
      "Date created": "03/23/23",
      Types: "Portal",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Learn Spanish in 30 Days",
      "Shared by": "Clyde Booth",
      icon: insights.userImg1,
      Views: "4,077",
      Downloads: "572",
      "Date created": "03/23/23",
      Types: "Collection",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Top Destinations for Adventure Enthusiasts",
      "Shared by": "Beverly Marshall",
      icon: insights.userImg2,
      Views: "4,077",
      Downloads: "572",
      "Date created": "03/23/23",
      Types: "Files",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Learn Spanish in 30 Days",
      "Shared by": "Irene James",
      icon: insights.userImg4,
      Views: "4,077",
      Downloads: "377",
      "Date created": "03/23/23",
      Types: "Collection",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
    {
      "Link name": "Top Destinations for Adventure Enthusiasts",
      "Shared by": "Betty Anderson",
      icon: insights.userImg3,
      Views: "4,077",
      Downloads: "377",
      "Date created": "03/23/23",
      Types: "Files",
      Actions: [
        <IconClickable src={insights.tableEye} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableUser} additionalClass={`${styles["action-icon"]} ${styles["eye-icon"]}`} />,
        <IconClickable src={insights.tableHome} additionalClass={`${styles["action-icon"]}`} />,
      ],
    },
  ];

  const arrowColumns = ["Link name", "Shared by", "Views", "Downloads", "Date created", "Types"];
  const buttonColumns = ["Action"];
  const buttonTexts = { Actions: "User Info" };
  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.tableResponsive}>
          <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
            <TableHeading mainText="Top Shared Links" descriptionText="May 18 - May 25, 2023" />
            <div className={`${styles["table-header-tabs"]}`}>
              <SearchButton label="Search User" />
              <Datefilter />
              <Download />
            </div>
          </div>
          {/* for laptop */}
          <div className={`${styles["laptop-view"]}`}>
            <div className={`${styles["heading-wrap"]}`}>
              <div>
                <TableHeading mainText="Top Shared Links" descriptionText="May 18 - May 25, 2023" />
                <div style={{ marginTop: "22px" }}>
                  <SearchButton label="Search User" />
                </div>
              </div>
              <div className={`${styles["table-header-tabs"]}`}>
                <Datefilter />
                <Download />
              </div>
            </div>
          </div>
          {/* for mobile */}
          <div className={`${styles["heading-wrap"]} ${styles["mobile-view"]}`}>
            <div className={`${styles["mobile-wrap"]}`}>
              <TableHeading mainText="Top Shared Links" descriptionText="May 18 - May 25, 2023" />
              <div className={`${styles["table-header-tabs"]}`}>
                <Datefilter />
                <Download />
              </div>
            </div>

            <div style={{ marginTop: "22px" }}>
              <SearchButton label="Search User" />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <ShareLinkTable
              columns={columns}
              data={data}
              arrowColumns={arrowColumns}
              buttonColumns={buttonColumns}
              buttonTexts={buttonTexts}
              imageSource="ImageSource"
            />
          </div>
          <div>
            <Pagination/>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShareLinkPage;
