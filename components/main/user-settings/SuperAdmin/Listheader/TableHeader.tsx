import React from "react";
import styles from "./TableHeader.module.css";

import SearchBtn from "../SearchButton/SearchBtn";
import CsvBtn from "../CsvBtn/CsvBtn";
import PropTypes from "prop-types";

const TableHeader = ({headerText}) => {
  return (
    <>
      <div className={styles.tableheader}>
        <div className={styles.heading}>
          <span>{headerText}</span>
        </div>
        <div className={styles.buttons}>
          <div className={styles.searchorder}>
            <SearchBtn />
          </div>
          <div className={styles.csvorder}>
            <CsvBtn />
          </div>
        </div>
      </div>
    </>
  );
};
TableHeader.propTypes = {
  headerText: PropTypes.string.isRequired,
};


export default TableHeader;
