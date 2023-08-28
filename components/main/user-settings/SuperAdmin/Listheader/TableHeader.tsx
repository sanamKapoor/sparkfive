import React from "react";
import styles from "./TableHeader.module.css"

import SearchBtn from "../SearchButton/SearchBtn";
import CsvBtn from "../CsvBtn/CsvBtn";

const TableHeader= () => {
  return (
   <>
   <div className={styles.tableheader}>
    <div className={styles.heading}>
        <span>All users</span>
    </div>
    <div className={styles.buttons}>
 <SearchBtn />
 <CsvBtn/>
    </div>
   

   </div>
 

   </>
  );
};

export default TableHeader;
