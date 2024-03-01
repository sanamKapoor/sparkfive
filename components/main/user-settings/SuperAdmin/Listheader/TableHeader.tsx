import React from "react";
import styles from "./TableHeader.module.css";

import CsvBtn from "../CsvBtn/CsvBtn";
import Search from "../Search/Search";

interface TableHeaderProps {
  headerText: string;
  onDownload: () => void;
  onSearch: (term: string) => void;
  placeholder: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headerText,
  onDownload,
  onSearch,
  placeholder,
}) => {
  return (
    <>
      <div className={styles.desktop}>
        <div className={styles.tableheader}>
          <div className={styles.heading}>
            <span>{headerText}</span>
          </div>
          <div className={styles.buttons}>
            <Search onSubmit={onSearch} placeholder={placeholder} />
            <div className={styles.csvorder}>
              <CsvBtn onClick={onDownload} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobile}>
        <div className={styles.tableheader}>
          <div className={styles.userWrap}>
            <div className={styles.heading}>
              <span>{headerText}</span>
            </div>
            <CsvBtn onClick={onDownload} />
          </div>
        </div>
        <div className={styles.searchorder}>
          <Search onSubmit={onSearch} placeholder={placeholder} />
        </div>
      </div>
    </>
  );
};

export default TableHeader;
