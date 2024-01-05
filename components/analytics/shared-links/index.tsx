import React from "react";
import { insights } from "../../../assets";
import IconClickable from "../../common/buttons/icon-clickable";
import Pagination from "../Pagination/pagination";
import Datefilter from "../date-filter/date-filter";
import Download from "../download-button/download";
import SearchButton from "../insight-table/analytics-search-button/analytics-search";
import TableHeading from "../insight-table/table-heading";
import styles from "./index.module.css";
import ShareLinkTable from "./share-link-table";

function ShareLinkPage({
  dashboardView = false
}: { dashboardView: boolean }) {
  const columns = ["Link", "Shared by", "Views", "Downloads", "Date created", "Types", "Actions"];
  const dashboardColumns = ["Link","Views", "Downloads", "Types", "Actions"];
  const data = [
    {
      "Link": "Best Tips for Gardening",
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
      "Link": "Delicious Recipes to Try at Home",
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
      "Link": "Ultimate Guide to Traveling Solo",
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
      "Link": "Fitness Workout Routines for Beginners",
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
      "Link": "Learn Spanish in 30 Days",
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
      "Link": "Top Destinations for Adventure Enthusiasts",
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
      "Link": "Learn Spanish in 30 Days",
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
      "Link": "Top Destinations for Adventure Enthusiasts",
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

  const arrowColumns = ["Link", "Shared by", "Views", "Downloads", "Date created", "Types"];
  const buttonColumns = ["Action"];
  const buttonTexts = { Actions: "User Info" };
  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.tableResponsive}>
          <div className={`${styles["heading-wrap"]} ${styles["web-view"]}`}>
            <TableHeading mainText={dashboardView ? "External Links" : "Top Shared Links"} descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
            <div className={`${styles["table-header-tabs"]}`}>
              {!dashboardView && <SearchButton label="Search User" />}
              <Datefilter />
              {!dashboardView && <Download />}
            </div>
          </div>
          {/* for laptop */}
          <div className={`${styles["laptop-view"]}`}>
            <div className={`${styles["heading-wrap"]}`}>
              <div>
                <TableHeading mainText={dashboardView ? "External Links" : "Top Shared Links"} descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
                <div style={{ marginTop: "22px" }}>
                  {!dashboardView && <SearchButton label="Search User" />}
                </div>
              </div>
              <div className={`${styles["table-header-tabs"]}`}>
                <Datefilter />
                {!dashboardView && <Download />}
              </div>
            </div>
          </div>
          {/* for mobile */}
          <div className={`${styles["heading-wrap"]} ${styles["mobile-view"]}`}>
            <div className={`${styles["mobile-wrap"]}`}>
              <TableHeading mainText={dashboardView ? "External Links" : "Top Shared Links"} descriptionText={dashboardView ? "View All" : "May 18 - May 25, 2023"} smallHeading={true} />
              <div className={`${styles["table-header-tabs"]}`}>
                <Datefilter />
                {!dashboardView && <Download />}
              </div>
            </div>

            <div style={{ marginTop: "22px" }}>
              <SearchButton label="Search User" />
            </div>
          </div>
          <div style={{ marginTop: "20px" }}>
            <ShareLinkTable
              columns={dashboardView ? dashboardColumns : columns}
              data={data}
              arrowColumns={arrowColumns}
              buttonColumns={buttonColumns}
              buttonTexts={buttonTexts}
              imageSource="ImageSource"
              dashboardView={dashboardView}
            />
          </div>
          {!dashboardView && <div>
            <Pagination/>
          </div>}
        </div>
      </div>
    </>
  );
}

export default ShareLinkPage;
