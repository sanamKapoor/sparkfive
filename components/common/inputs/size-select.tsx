import styles from './filters-select.module.css'
import ReactSelect, { components, createFilter } from 'react-select'
import { useState } from 'react'
import { Utilities } from '../../../assets'

const SizeSelect = ({
  options,
  placeholder,
  value = null,
  onChange = (selected) => { },
  styleType = '',
  isClearable = false,
  closeMenuOnSelect = true,
  additionalClass = '',
  disabled=false,
}) => {

  return (
    <>
      <ReactSelect
        placeholder={placeholder}
        options={options}
        closeMenuOnSelect={closeMenuOnSelect}
        className={`${styles.container} ${styleType} ${styles[styleType]} ${additionalClass}`}
        value={value}
        isMulti={false}
        onChange={onChange}
        classNamePrefix={`select-prefix`}
        isClearable={isClearable}
        isSearchable={false}
        isDisabled={disabled}
      />
    </>
  )
}

export default SizeSelect


