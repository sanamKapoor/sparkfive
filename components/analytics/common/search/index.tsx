import React, { useContext } from "react";
import { Utilities } from "../../../../assets";
import styles from './analytics-search.module.css'
import { AnalyticsContext } from "../../../../context";

const AnalyticsSearch = () => {
  const { search, setSearch } = useContext(AnalyticsContext);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  return (
    <>
      <form className={styles.search}>
        <div className={`${styles['search-wrapper']}`}>
          <input
            type="text"
            placeholder="Search User"
            name="search2"
            value={search}
            onChange={handleSearch}
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


export default AnalyticsSearch;
