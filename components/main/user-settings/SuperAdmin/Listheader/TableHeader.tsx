import React from "react";
import styles from "./TableHeader.module.css";

import Button from "../../../../common/buttons/button";
import Search from "../Search/Search";
import CsvBtn from "../CsvBtn/CsvBtn";

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
      <div className={styles.tableheader}>
        <div className={styles.heading}>
          <span>{headerText}</span>
        </div>
        <div className={styles.buttons}>
          <div className={styles.searchorder}>
            <Search onSubmit={onSearch} placeholder={placeholder} />
          </div>
          <div className={styles.csvorder}>
             <CsvBtn onClick={onDownload}/>
            </div>
          
        </div>
      </div>
    </>
  );
};

export default TableHeader;
