import styles from './filter-selector.module.css'
import { Utilities } from '../../../assets'
import { FilterContext } from '../../../context'
import {useContext, useEffect, useState} from 'react'
import update from 'immutability-helper'

// Components
import IconClickable from '../buttons/icon-clickable'
import FiltersSelect from '../inputs/filters-select'

const FilterSelector = ({
    searchBar = true,
    filters,
    oneColumn = false,
    numItems,
    setValue,
    value,
    anyAllSelection = '',
    setAnyAll = (val) => { },
    loadFn,
    addtionalClass = '',
    capitalize = false,
    internalFilter = false, // Filter list will be get from loadFn resolve directly (useful for custom fields),
    mappingValueName = 'value'
}) => {

    const { activeSortFilter } = useContext(FilterContext)
    const [internalFilters, setInternalFilters] = useState([])

    const getFilterList = async () => {
        setInternalFilters(await loadFn())
    }

    useEffect(() => {
        // Get filter list directly without by context
        if(internalFilter){
            getFilterList()
        }else{
            loadFn()
        }

    }, [activeSortFilter])

    const toggleSelected = (selected) => {
        let index = value && value.findIndex((item) => item[mappingValueName] === selected[mappingValueName])
        if (!value || index !== -1) {
            setValue(update(value, {
                $splice: [[index, 1]]
            }))
        } else {
            setValue(update(value, {
                $push: [selected]
            }))
        }
    }

    // Set value and filters as selected
    let visibleFilters = internalFilter ? internalFilters.slice(0, numItems) : filters.slice(0, numItems)

    if (value)
        visibleFilters = [...visibleFilters, ...value.filter(selected => !visibleFilters.map(({ value }) => value).includes(selected.value))]

    return (
        <div className={`${styles.container}`}>
            {anyAllSelection !== '' &&
                <div className={styles['any-all-wrapper']}>
                    <div>
                        <IconClickable
                            src={anyAllSelection === 'all' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                            additionalClass={styles['select-icon']}
                            onClick={() => setAnyAll('all')} />
                        <div className={styles['any-all-text']}>All selected</div>
                    </div>
                    <div>
                        <IconClickable
                            src={anyAllSelection === 'any' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                            additionalClass={styles['select-icon']}
                            onClick={() => setAnyAll('any')} />
                        <div className={styles['any-all-text']}>Any selected</div>
                    </div>
                </div>
            }
            <ul className={`${styles['item-list']} ${oneColumn && styles['one-column']} ${capitalize && 'capitalize'}`}>
                {visibleFilters.map((filter, index) => {
                    const isSelected = value && value.findIndex((item) => item[mappingValueName] === filter[mappingValueName]) !== -1
                    return (
                        <li key={index} className={`${styles['select-item']} ${styles[addtionalClass]}`}>
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
                <div className={`${styles['select-filter']} search-filters`}>
                    <FiltersSelect
                        options={internalFilter ? internalFilters : filters}
                        placeholder='Search'
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
