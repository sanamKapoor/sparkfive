import styles from './filter-selector.module.css'
import { Utilities } from '../../../assets'
import { useState, useEffect } from 'react'

// Components
import IconClickable from '../buttons/icon-clickable'
import Search from '../../common/inputs/search'


const FilterSelector = () => {

    const [isSelected, setIsSelected] = useState(false)

    const tags = [
        {
            name: 'Women',
            total: '25'
        },
        {
            name: 'men',
            total: '15'
        },
        {
            name: 'fall',
            total: '34'
        },
        {
            name: 'winter',
            total: '3'
        },
        {
            name: 'summer',
            total: '2'
        },
        {
            name: 'spring',
            total: '18'
        },
    ]

    const toggleSelected = () => {
        if (!isSelected) {
            setIsSelected(true)
        } else {
            setIsSelected(false)
        }
    }


    return (
        <div className={`${styles.container}`}>
            <ul className={styles['item-list']}>
                {tags.map((tag, index) => (
                    <li key={index} className={styles['select-item']}>
                        <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
                            {isSelected ?
                                <IconClickable src={Utilities.radioButtonEnabled} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                                :
                                <IconClickable src={Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                            }
                        </div>
                        <p className={styles['item-name']}>{tag.name}</p>
                        <p className={styles['item-total']}>{tag.total}</p>
                    </li>
                ))}
            </ul>
            <Search
                placeholder={'Search'}
            />
        </div>

    )
}

export default FilterSelector
