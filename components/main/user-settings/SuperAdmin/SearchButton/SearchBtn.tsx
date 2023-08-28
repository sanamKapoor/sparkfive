import { Utilities } from "../../../../../assets";
import styles from "./SearchBtn.module.css";
import React from "react";
const SearchBtn=() => {
    return (
        <>
        <form className={styles.example} action="/action_page.php">
            <div className={styles.searchinput}>
            <input type="text" placeholder="Search user" name="search2" />
            </div>
            <div className={styles.searchbtn}>
            <button type="submit"><img className={styles.image} src={Utilities.search} /></button>
            </div>
         
            </form>
        </>

    )
}
export default SearchBtn;