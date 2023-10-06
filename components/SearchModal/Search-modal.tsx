
import { Utilities } from "../../assets";
import styles from "./Search-modal.module.css";
import React from "react";


const SearchModal= ({  }) => {
  
  return (
    <>
      <form
        className={styles.search}
      >
        <div className={styles.searchinput}>
          <input
            type="text"
            name="search2"
            placeholder="search"
          />
        </div>
        <div className={styles.searchbtn}>
          <img className={styles.image} src={Utilities.search} />
        </div>
      </form>
    </>
  );
};
export default SearchModal;