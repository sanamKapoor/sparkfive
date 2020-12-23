import styles from './filter-selector.module.css'
import { Utilities } from '../../../assets'
import { useState, useEffect } from 'react'
import update from 'immutability-helper'

// Components
import IconClickable from '../buttons/icon-clickable'
import FiltersSelect from '../inputs/filters-select'

const FilterSelector = ({
    searchBar = true,
    filters,
    oneColumn = false,
    numItems,
    clearSelector,
    setValue,
    value,
    placeholder
}) => {

    const toggleSelected = (selected) => {
        let index = value.findIndex((item) => item.value === selected.value)
        if (index !== -1) {
            setValue(update(value, {
                $splice: [[index, 1]]
            }))
        } else {
            setValue(update(value, {
                $push: [selected]
            }))
        }
    }

    return (
        <div className={`${styles.container}`}>
            <ul className={`${styles['item-list']} ${oneColumn && styles['one-column']}`}>
                {filters.slice(0, numItems).map((filter, index) => {
                    const isSelected = value.findIndex((item) => item.value === filter.value) !== -1
                    return (
                        <li key={index} className={styles['select-item']}>
                            <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
                                {isSelected ?
                                    <IconClickable
                                        src={Utilities.radioButtonEnabled}
                                        additionalClass={styles['select-icon']}
                                        onClick={() => toggleSelected(filter)} />
                                    :
                                    <IconClickable
                                        src={Utilities.radioButtonNormal}
                                        additionalClass={styles['select-icon']}
                                        onClick={() => toggleSelected(filter)} />
                                }
                            </div>
                            <p className={styles['item-name']}>{filter.name}</p>
                            <div className={styles['item-total']}>{filter.count}</div>
                        </li>
                    )
                })}
            </ul>
            {searchBar &&
                <div className={styles['select-filter']}>
                    <FiltersSelect
                        options={filters}
                        placeholder={placeholder}
                        styleType='filter'
                        onChange={(selected) => setValue(selected)}
                        value={value}
                        isClearable={true}
                        hasCount={true}
                    />
                </div>}
        </div>

    )
}

export default FilterSelector
