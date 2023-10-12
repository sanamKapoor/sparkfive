import { useState } from "react";
import { Utilities } from "../../../../../assets";
import styles from "./Search.module.css";

interface SearchProps {
  onSubmit: (term: string) => void;
  placeholder: string;
}

const Search: React.FC<SearchProps> = ({ onSubmit, placeholder }) => {
  const [term, setTerm] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  return (
    <>
      <form
        className={styles.search}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(term);
        }}
      >
        <div className={styles.searchinput}>
          <input
            type="text"
            placeholder={placeholder}
            name="search2"
            value={term}
            onChange={onChange}
          />
        </div>
        <div className={styles.searchbtn}>
          <img className={styles.image} src={Utilities.search} />
        </div>
      </form>
    </>
  );
};
export default Search;
