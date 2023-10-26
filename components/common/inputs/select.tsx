import ReactSelect from "react-select";
import styles from "./select.module.css";
import { getThemeFromLocalStorage } from "../../../utils/theme";
import {
  defaultAdditionalColor,
  defaultHeadNavColor,
  defaultPrimaryColor,
  defaultSecondaryColor,
} from "../../../constants/theme";
import { useEffect, useState } from "react";

const Select = ({
  label = "",
  options,
  placeholder,
  value = null,
  onChange = (selected) => {},
  styleType = "",
  isClearable = false,
  menuPlacement = "auto",
  isMulti = false,
  additionalClass = "",
  containerClass = "",
  additionalStyles = null,
}) => {
  const customOptions = [
    {
      label: label,
      disabled: true,
    },
    ...options,
  ];

  const [secondaryColor, setSecondaryColor] = useState(defaultSecondaryColor);
  const [additionalColor, setAdditionalColor] = useState(defaultAdditionalColor);

  const loadCurrentTheme = () => {
    // Call API to get team theme then set to local storage
    const theme = getThemeFromLocalStorage();

    setSecondaryColor(theme?.secondary || defaultSecondaryColor);
    setAdditionalColor(theme?.additional || defaultAdditionalColor);
  };

  useEffect(() => {
    loadCurrentTheme();
  }, []);

  return (
    <ReactSelect
      defaultValue={customOptions[0]}
      placeholder={placeholder}
      options={label ? customOptions : options}
      className={`${styles.container} ${styleType} ${styles[styleType]} ${containerClass}`}
      value={value}
      onChange={onChange}
      classNamePrefix={`${additionalClass} select-prefix`}
      isClearable={isClearable}
      menuPlacement={menuPlacement}
      isMulti={isMulti}
      isOptionDisabled={(option) => option.disabled}
      styles={{
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? "#FAF8F5" : "transparent",
          ":hover": {
            backgroundColor: additionalColor,
          },
          ...(additionalStyles && { ...additionalStyles }),
        }),
      }}
    />
  );
};

export default Select;
