import { useState } from "react";
import { Utilities } from "../../../../../assets";
import styles from "./Search.module.css";

interface SearchProps {
  onSubmit: (term: string) => void;
  placeholder: string;
  className?: string;
  buttonClassName?: string;
}

const Search: React.FC<SearchProps> = ({
  onSubmit,
  placeholder,
  className,
  buttonClassName,
}) => {
  const [term, setTerm] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const searchClassName = className
    ? `${styles.search} ${className}`
    : styles.search;

  return (
    <>
      <form
        className={searchClassName}
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
        <div className={`${styles.searchbtn} ${buttonClassName}`}>
          <img className={styles.image} src={Utilities.search} />
        </div>
      </form>
    </>
  );
};
export default Search;
