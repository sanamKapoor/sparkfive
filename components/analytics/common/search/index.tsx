import React, { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../../assets";
import styles from './analytics-search.module.css'
import { useDebounce } from "../../../../hooks/useDebounce";

const AnalyticsSearch = ({ label, setSearch }: {
  label: string,
  setSearch: (search: string) => void
}) => {

  const [input, setInput] = useState("");
  const debouncedSearchTerm = useDebounce(input, 500);

  const handleSearch = (e) => {
    setInput(e.target.value.trim());
  }

  useEffect(() => {
    if(setSearch) setSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <>
      <form className={styles.search}>
        <div className={`${styles['search-wrapper']}`}>
          <input
            type="text"
            placeholder={label ? label : "Search"}
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
