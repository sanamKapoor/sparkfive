import styles from './filter-selector.module.css'
import { Utilities } from '../../../assets'
import { useState, useEffect } from 'react'
import update from 'immutability-helper'

// Components
import IconClickable from '../buttons/icon-clickable'
import Search from '../../common/inputs/search'


const FilterSelector = ({ searchBar = true, filters, oneColumn = false, numItems }) => {

    const [selectedItem, setSelectedItem] = useState([])

    const toggleSelected = (filter) => {
        let index = selectedItem.findIndex((item) => item === filter)
        if (index !== -1) {
            setSelectedItem(update(selectedItem, {
                $splice: [[index, 1]]
            }))
        } else {
            setSelectedItem(update(selectedItem, {
                $push: [filter]
            }))
        }
    }

    return (
        <div className={`${styles.container}`}>
            <ul className={`${styles['item-list']} ${oneColumn && styles['one-column']}`}>
                {filters.slice(0, numItems).map((filter, index) => (
                    <li key={index} className={styles['select-item']}>
                        <div className={`${styles['selectable-wrapper']} ${selectedItem.includes(filter.name) && styles['selected-wrapper']}`}>
                            {selectedItem.includes(filter.name) ?
                                <IconClickable
                                    src={Utilities.radioButtonEnabled}
                                    additionalClass={styles['select-icon']}
                                    onClick={() => toggleSelected(filter.name)} />
                                :
                                <IconClickable
                                    src={Utilities.radioButtonNormal}
                                    additionalClass={styles['select-icon']}
                                    onClick={() => toggleSelected(filter.name)} />
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
