import React, { useContext, useState } from "react";
import { analyticsLayoutSection } from "../../../../constants/analytics";
import NoData from "../no-data";
import styles from "./table-data.module.css";
import TableHeader from "./table-header";
import TableBody from "./table-body";
import Modal from "../modal";
import { AnalyticsContext } from "../../../../context";

export default function TableData({
  columns,
  arrowColumns,
  buttonColumns,
  buttonTexts,
  tableLoading,
  data,
  apiData,
  activeSection,
  totalRecords,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  tableFor
}) {
  const [activeId, setActiveId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { dashboardView } = useContext(AnalyticsContext);

  const handleModals = async (id: string) => {
    setShowModal(true);
    setActiveId(id)
  };

  return (
    <>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <TableHeader
            columns={columns}
            arrowColumns={arrowColumns}
            totalRecords={totalRecords}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          />
          {data?.length > 0 &&
            <TableBody
              columns={columns}
              buttonColumns={buttonColumns}
              buttonTexts={buttonTexts}
              handleModals={handleModals}
              data={data}
              dashboardView={dashboardView}
              tableFor={tableFor}
            />
          }
        </table>
        {tableLoading ? <div className={styles.backdrop}></div> : null}
      </div>
      {
        showModal && <Modal section={activeSection} setShowModal={setShowModal} id={activeId} />
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
