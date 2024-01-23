import React, { useContext } from "react";
import { insights } from "../../../../assets";
import { userActivityModalArrowColumns, userActivityModalButtonColumns, userActivityModalButtonTexts, userActivityModalcolumns, userModalarrowColumns, userModalbuttonColumns, userModalbuttonTexts, userModalcolumns, userModaldata } from "../../../../data/analytics";
import IconClickable from "../../../common/buttons/icon-clickable";
import SearchButton from "../../common/search";
import Datefilter from "../../common/date-filter";
import Download from "../../common/download-button";
import Pagination from "../../common/pagination";
import TableData from "../../common/table";
import styles from "./models.module.css";
import { AnalyticsContext } from "../../../../context";

function UserModal({
  setShowModal,
  id
}: { setShowModal: (show: boolean) => void, id: string }) {

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className={`${styles.backdrop}`}>
      <section className={`${styles["user-modal-outer"]}`}>
        <div className={`${styles["user-modal"]}`}>
          {/* {
            activeSection === analyticsLayoutSection.ACCOUNT_USERS &&
            <div className={styles["usernameWithImage"]}>
              <div className={`${styles["image-wrapper"]}`}>
                {row.profilePhoto !== null ? (
                  <img src={row.profilePhoto} alt="user" className={styles.userImage} />
                ) : (
                  <div className={styles.userAvatar}>{row.name.charAt(0).toUpperCase()}</div>
                )}
              </div>
              <span className={`${styles["user-name"]}`}>{row.name}</span>
            </div>
          } */}
          <div className={`${styles["user-detail-top"]}  ${styles["web-view"]}`}>
            <div className={`${styles["user-detail"]}`}>
              <p>Email: <span>harveyelliott@mail.com</span></p>
              <p>
                {/* Last Session Date: <span>{last_session ? last_session : "05/14/23"}</span> */}
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
            columns={userActivityModalcolumns}
            arrowColumns={userActivityModalArrowColumns}
            buttonColumns={userActivityModalButtonColumns}
            buttonTexts={userActivityModalButtonTexts}
          />
          <Pagination />
        </div>
      </section>
    </div>

  );
}

export default UserModal;
