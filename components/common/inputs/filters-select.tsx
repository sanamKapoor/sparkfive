import { useState } from "react";
import ReactSelect, { components, createFilter } from "react-select";
import { Utilities } from "../../../assets";
import styles from "./filters-select.module.css";

const FiltersSelect = ({
  options,
  placeholder,
  value = null,
  onChange = (selected) => {},
  styleType = "",
  isClearable = false,
  closeMenuOnSelect = false,
  hasCount = false,
  scrollBottomAfterSearch = false,
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onInputChange = (value) => {
    setInputValue(value);
    if (!value || value.length === 0) {
      setOptionsVisible(false);
    } else if (!optionsVisible && value.length > 0) {
      setOptionsVisible(true);
    }

    // Scroll bottom
    if (scrollBottomAfterSearch) {
      setTimeout(() => {
        var objDiv = document.getElementById("scroll-search-bottom-container");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 100);
    }
  };

  const onChangeWrapper = (selected) => {
    if (inputValue) {
      onChange(selected);
    }
  };

  const Option = (props) => (
    <components.Option {...props}>
      <div className={styles.option}>
        <img
          src={
            props.isSelected
              ? Utilities.radioButtonEnabled
              : Utilities.radioButtonNormal
          }
        />
        <div className={styles.label}>{props.label}</div>
        {hasCount && <div>{props.data.count}</div>}
      </div>
    </components.Option>
  );

  return (
    <>
      <img className={styles.search} src={Utilities.search} />
      <ReactSelect
        controlShouldRenderValue={false}
        placeholder={placeholder}
        options={options}
        closeMenuOnSelect={closeMenuOnSelect}
        components={{ Option }}
        className={`${styles.container} ${styleType} ${styles[styleType]}`}
        value={value}
        isMulti={true}
        hideSelectedOptions={false}
        onChange={(selected) => onChangeWrapper(selected)}
        classNamePrefix={`select-prefix`}
        isClearable={isClearable}
        menuIsOpen={optionsVisible}
        onInputChange={onInputChange}
        filterOption={createFilter({
          matchFrom: "any",
          stringify: (option) => `${option.label}`,
        })}
      />
    </>
  );
};

export default FiltersSelect;
