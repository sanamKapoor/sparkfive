import TableHeader from "../Listheader/TableHeader";
import LoadBtn from "../LoadButton/Loadbtn";
import TableHead from "./TableHead";
import TableData from "./Tabledata";
import styles from "./UserTable.module.css";
import React from "react";
const UserTable = () => {
  return (
    <>
      <div className={styles.outer}>
        <TableHeader headerText="All Users" />
        <table className={styles.userTable}>
          <TableHead />
          <TableData />
        </table>
      </div>
      <LoadBtn />
    </>
  );
};
export default UserTable;
