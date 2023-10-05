import ReactSelect from "react-select";
import styles from "./select.module.css";

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
  additionalStyles=null,
}) => {
  const customOptions = [
    {
      label: label,
      disabled: true,
    },
    ...options,
  ];

 

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
           backgroundColor: state.isSelected ? '#FAF8F5' : 'transparent', 
           color: state.isSelected && '#08135e' , 
          ':hover': {
            backgroundColor: '#00b8d91a',
           
          },
          ...(additionalStyles && { ...additionalStyles }),
        }),
        
        
      }}
    
    />
  );
};

export default Select;
