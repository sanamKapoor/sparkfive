import { useEffect, useState } from "react";
import { AssetOps, Utilities } from "../../../assets";
import { useDebounce } from "../../../hooks/useDebounce";
import styles from "./search-input.module.css";

// Components
import Button from "../buttons/button";

const Search = (props) => {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounce(term, 500);

  useEffect(() => {
    if (props.onlyInput && props.onChange) {
      props.onChange(debouncedTerm);
    }
  }, [debouncedTerm]);

  useEffect(() => {
    // Clear search value if user do submit in another search input
    if (props.name !== props.searchType) {
      setTerm("");
    }
  }, [props.searchType]);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(term);
      }}
    >
      <div
        className={`${styles["input-container"]} ${
          props.inputContainerStyle || ""
        }`}
      >
        {!props?.nonIcon && <img src={Utilities.search} />}
        <input
          {...props}
          onChange={(e) => {
            setTerm(e.target.value);
          }}
          value={term}
          placeholder={props.placeholder || "Search"}
          className={`${styles.container} ${
            props.styleType && styles[props.styleType]
          }`}
        />
        {term.length > 0 && <img src={AssetOps.cancel} onClick={() => setTerm('')}/>}
      </div>
      {!props.onlyInput && (
        <Button
          className={"container submit exclude-min-height primary"}
          type={"submit"}
          text="Search"
        />
      )}
    </form>
  );
};

export default Search;
