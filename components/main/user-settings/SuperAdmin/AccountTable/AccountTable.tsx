import AccountData from "../AccountTable/Accountdata";
import AccountTableHead from "../AccountTable/Accounttablehead";
import TableHeader from "../Listheader/TableHeader";
import LoadBtn from "../LoadButton/Loadbtn";

import styles from "./AccountTable.module.css";
import React from "react";
const AccountTable = () => {
  return (
    <>
      <div className={styles.outer}>
        <TableHeader headerText="All accounts" />
        <table className={styles.userTable}>
          <AccountTableHead />
          <AccountData />
        </table>
      </div>
      <div className={styles.loadbtnWrapper}>
        <LoadBtn />
      </div>
    </>
  );
};
export default AccountTable;
