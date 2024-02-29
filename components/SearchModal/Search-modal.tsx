
import { Utilities } from "../../assets";
import styles from "./Search-modal.module.css";
import React, { useEffect, useState } from "react";
import { useDebounce } from '../../hooks/useDebounce'

interface SearchModalProps {
  filteredData: () => void;
  input: string;
  setInput: (value: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ filteredData, input, setInput }) => {

  const debouncedSearchTerm = useDebounce(input, 500);
  useEffect(() => {
    filteredData();
  }, [debouncedSearchTerm]);

  const onEnterClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      filteredData();
    }
  }

  return (
    <>
      <form
        className={styles.search}
        onSubmit={(e) => { e.preventDefault() }}
      >
        <div className={styles.searchinput}>
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={onEnterClick}
            value={input}
            placeholder={'Search'}
            name="search2"
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