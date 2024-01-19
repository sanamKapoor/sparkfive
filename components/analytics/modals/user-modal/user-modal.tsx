import React, { useContext } from "react";
import { insights } from "../../../../assets";
import { userModalarrowColumns, userModalbuttonColumns, userModalbuttonTexts, userModalcolumns, userModaldata } from "../../../../data/analytics";
import IconClickable from "../../../common/buttons/icon-clickable";
import SearchButton from "../../common/search";
import Datefilter from "../../common/date-filter";
import Download from "../../common/download-button";
import Pagination from "../../common/pagination";
import TableData from "../../common/table";
import styles from "./models.module.css";
import { AnalyticsContext } from "../../../../context";
import { analyticsLayoutSection } from "../../../../constants/analytics";
import { useAnalyticsHold } from "../../../../hooks/use-analytics-hold";

function UserModal({
  setShowModal,
  name,
  last_session
}: { setShowModal: (show: boolean) => void, name: string, last_session: string }) {

  const { restoreState } = useAnalyticsHold();
  const { activeSection } = useContext(AnalyticsContext);

  const handleCloseModal = () => {
    setShowModal(false)
    // restoreState();
  }

  return (
    <div className={`${styles.backdrop}`}>
 <section className={`${styles["user-modal-outer"]}`}>
      <div className={`${styles["user-modal"]}`}>
        <div className={`${styles["user-detail-top"]}  ${styles["web-view"]}`}>
          <div className={`${styles["user-detail"]}`}>
            {
              activeSection === analyticsLayoutSection.ACCOUNT_USERS ?
                <p>User name: <span>{name}</span></p>
                :
                <p>Email: <span>harveyelliott@mail.com</span></p>
            }
            <p>
              Last Session Date: <span>{last_session ? last_session : "05/14/23"}</span>
            </p>
          </div>
          <div className={`${styles["table-header-tabs"]}`}>
            <SearchButton label="Search User" />
            <Datefilter />
            <Download />
            <IconClickable src={insights.insightClose} additionalClass={styles.closeIcon} text={""} onClick={handleCloseModal} />
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
    </div>
   
  );
}

export default UserModal;
