import styles from './filter-selector.module.css'
import { Utilities } from '../../../assets'
import { useState, useEffect } from 'react'

// Components
import IconClickable from '../buttons/icon-clickable'
import Search from '../../common/inputs/search'


const FilterSelector = ({searchBar = true, filters, oneColumn = false, numItems}) => {

    const [isSelected, setIsSelected] = useState('')

    const toggleSelected = (name) => {
        if (isSelected === '') {
            setIsSelected(name)
        } else {
            setIsSelected('')
        }
    }

    return (
        <div className={`${styles.container}`}>
            <ul className={`${styles['item-list']} ${oneColumn && styles['one-column']}`}>
                {filters.slice(0, numItems).map((filter, index) => (
                    <li key={index} className={styles['select-item']}>
                        <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
                            {isSelected ?
                                <IconClickable src={Utilities.radioButtonEnabled} additionalClass={styles['select-icon']} onClick={() => toggleSelected(filter.name)} />
                                :
                                <IconClickable src={Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={() => toggleSelected(filter.name)} />
                            }
                        </div>
                        <p className={styles['item-name']}>{filter.name}</p>
                        <p className={styles['item-total']}>{filter.total}</p>
                    </li>
                ))}
            </ul>
            {searchBar &&
                <Search
                    placeholder={'Search'}
                />}
        </div>

    )
}

export default FilterSelector
