import React, { useContext } from "react";
import { Utilities } from "../../../../assets";
import styles from './analytics-search.module.css'
import { AnalyticsContext } from "../../../../context";

const search = () => {

  const { search, setSearch } = useContext(AnalyticsContext);

  return (
    <>
      <form className={styles.search}>
        <div className={`${styles['search-wrapper']}`}>
          <input
            type="text"
            placeholder="Search User"
            name="search2"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchinput}
           />
        </div>
        <div className={`${styles.searchbtn}`}>
          <img className={styles.image} src={Utilities.search} alt="Search Icon" />
        </div>
      </form>
    </>
  );
};


export default search;
