
import AccountData from "../AccountTable/Accountdata";
import AccountTableHead from "../AccountTable/Accounttablehead";
import TableHeader from "../Listheader/TableHeader";
import TableHead from "./TableHead";
import TableData from "./Tabledata";
import styles from "./UserTable.module.css";
import React from "react";
const UserTable=() => {
    return (
        <>
        
        <div className={styles.outer}>
               <TableHeader />
        <table className={styles.userTable}>
     
        <AccountTableHead/>
        <AccountData />
        </table>
        </div>
        </>

    )
}
export default UserTable;