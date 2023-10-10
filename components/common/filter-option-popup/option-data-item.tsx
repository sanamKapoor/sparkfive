import React from 'react'
import styles from "./option-data-item.module.css"
import IconClickable from '../buttons/icon-clickable'
import { Utilities } from '../../../assets'

const OptionDataItem = () => {
  return (
    <div  className={`${styles['tags-wrapper']}`}>
                <div  className={`${styles['tags-left-side']}`}>
                <IconClickable src={Utilities.radioButtonNormal} />
                <span>name</span>
                </div>
             <div>
                <span>12</span>
                </div>
                
             </div>
  )
}

export default OptionDataItem