import React from 'react'
import styles from './select-option.module.css'
import { Utilities } from '../../../assets';

function SelectOption() {
  return (
    <div  className={`${styles['select-wrapper']}`}>
        <span>Any selected</span>
        <img src={Utilities.downIcon} alt="down-icon" />
    </div>
  )
}

export default SelectOption;