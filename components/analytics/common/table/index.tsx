import React, { useContext, useState } from "react";
import { analyticsLayoutSection } from "../../../../constants/analytics";
import { AnalyticsContext } from "../../../../context";
import { useAnalyticsHold } from "../../../../hooks/use-analytics-hold";
import UserModal from "../../modals/user-modal/user-modal";
import NoData from "../no-data";
import styles from "./table-data.module.css";
import TableHeader from "./table-header";
import TableBody from "./table-body";

export default function TableData({
  columns,
  data,
  arrowColumns,
  buttonColumns,
  buttonTexts,
  activeSection,
}) {
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState<React.ReactElement | null>(null);
  const {
    tableLoading,
    data: apiData,
  } = useContext(AnalyticsContext);

  const { captureState } = useAnalyticsHold();

  const handleModals = (name, last_session) => {
    setShowModal(true);
    setActiveModal(
      activeSection === analyticsLayoutSection.ACCOUNT_USERS ? (
        <UserModal setShowModal={setShowModal} name={name} last_session={last_session} />
      ) : null,
    );

    // if (activeSection === analyticsLayoutSection.ACCOUNT_USERS) {
    //   captureState()
    // }
  };



  return (
    <>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <TableHeader
            columns={columns}
            arrowColumns={arrowColumns}
          />
          {data && data.length > 0 &&
            <TableBody
              columns={columns}
              buttonColumns={buttonColumns}
              buttonTexts={buttonTexts}
              handleModals={handleModals}
            />
          }
        </table>
        {tableLoading ? <div className={styles.backdrop}></div> : null}
      </div>
      {
        showModal && activeModal
      }
      {
        (apiData && apiData.length === 0 && (activeSection === analyticsLayoutSection.ACCOUNT_USERS || activeSection === analyticsLayoutSection.ACCOUNT_ASSETS)) &&
        <div className={styles.empty}>
          <NoData message="Data not found." wrapper={false} />
        </div>
      }
    </>
  );
}
