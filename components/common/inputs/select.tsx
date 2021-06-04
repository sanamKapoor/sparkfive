import styles from './select.module.css'
import ReactSelect from 'react-select'

const Select = ({ options, placeholder, value = null, onChange = (selected) => { }, styleType = '', isClearable = false, menuPlacement = 'auto', isMulti = false, additionalClass = '' }) => (
  <ReactSelect
    placeholder={placeholder}
    options={options}
    className={`${styles.container} ${styleType} ${styles[styleType]}`}
    value={value}
    onChange={onChange}
    classNamePrefix={`${additionalClass} select-prefix`}
    isClearable={isClearable}
    menuPlacement={menuPlacement}
    isMulti={isMulti}
  />
)

export default Select


