import styles from './filters-select.module.css'
import ReactSelect, { components, createFilter } from 'react-select'
import { useState } from 'react'
import { Utilities } from '../../../assets'

const FiltersSelect = ({
  options,
  placeholder,
  value = null,
  onChange = (selected) => { },
  styleType = '',
  isClearable = false,
  closeMenuOnSelect = false,
  hasCount = false
}) => {

  const [optionsVisible, setOptionsVisible] = useState(false)

  const onInputChange = (value) => {
    if (!value || value.length === 0) {
      setOptionsVisible(false)
    }
    else if (!optionsVisible && value.length > 0) {
      setOptionsVisible(true)
    }
  }

  const Option = props => (
    <components.Option {...props} >
      <div className={styles.option}>
        <img src={props.isSelected ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal} />
        <div className={styles.label}>{props.label}</div>
        {hasCount && <div>{props.data.count}</div>}
      </div>
    </components.Option>
  )

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
        onChange={onChange}
        classNamePrefix='select-prefix'
        isClearable={isClearable}
        menuIsOpen={optionsVisible}
        onInputChange={onInputChange}
        filterOption={createFilter({
          matchFrom: 'any',
          stringify: option => `${option.label}`,
        })}
      />
    </>
  )
}

export default FiltersSelect


