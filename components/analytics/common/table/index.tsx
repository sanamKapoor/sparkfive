import React, { useContext, useState } from "react";
import { analyticsLayoutSection } from "../../../../constants/analytics";
import NoData from "../no-data";
import styles from "./table-data.module.css";
import TableHeader from "./table-header";
import TableBody from "./table-body";
import Modal from "../modal";

export default function TableData({
  columns,
  arrowColumns,
  tableLoading,
  data,
  apiData,
  totalRecords,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  tableFor,
  dashboardView = false,
}) {
  const [activeId, setActiveId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeModalFor, setActiveModalFor] = useState('');

  const handleModals = async (id: string, section: string) => {    
    setActiveModalFor(section);
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
              handleModals={handleModals}
              data={data}
              tableFor={tableFor}
              dashboardView={dashboardView}
            />
          }
        </table>
        {tableLoading ? <div className={styles.backdrop}></div> : null}
      </div>
      {
        showModal && <Modal section={activeModalFor} setShowModal={setShowModal} id={activeId} />
      }
      {
        apiData?.length === 0 &&
        <div className={styles.empty}>
          <NoData message="Data not found." wrapper={false} />
        </div>
      }
    </>
  );
}
