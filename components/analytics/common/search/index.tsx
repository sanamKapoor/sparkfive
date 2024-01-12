import React, { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../../assets";
import styles from './analytics-search.module.css'
import { AnalyticsContext } from "../../../../context";
import { useDebounce } from "../../../../hooks/useDebounce";

const AnalyticsSearch = () => {
  const { setSearch } = useContext(AnalyticsContext);

  const [input, setInput] = useState("");
  const debouncedSearchTerm = useDebounce(input, 500);

  const handleSearch = (e) => {
    setInput(e.target.value.trim());
  }

  useEffect(() => {
    setSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <>
      <form className={styles.search}>
        <div className={`${styles['search-wrapper']}`}>
          <input
            type="text"
            placeholder="Search User"
            name="search2"
            value={input}
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
