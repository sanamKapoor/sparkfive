import IconClickable from "../../../../../components/common/buttons/icon-clickable";

import styles from './index.module.css'

import { Utilities } from '../../../../../assets'

export default function OptionList({
       data,
       oneColumn = false,
       setValue,
       value,
       addtionalClass = '',
       capitalize = false
   }){

    const toggleSelected = (selectedValue) => {
        setValue(selectedValue)
    }

    return <ul className={`${styles['item-list']} ${oneColumn && styles['one-column']} ${capitalize && 'capitalize'}`}>
        {data.map((filter, index) => {
            const isSelected = value !== undefined && value === filter.value
            return (
                <li key={index} className={`${styles['select-item']} ${styles[addtionalClass]}`}>
                    <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
                        {isSelected ?
                            <IconClickable
                                src={Utilities.radioButtonEnabled}
                                additionalClass={styles['select-icon']}
                                onClick={() => toggleSelected(filter.value)} />
                            :
                            <IconClickable
                                src={Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => toggleSelected(filter.value)} />
                        }
                    </div>
                    <p className={styles['item-name']}>{filter.label}</p>
                    {/*<div className={styles['item-total']}>{filter.count}</div>*/}
                </li>
            )
        })}
    </ul>
}
