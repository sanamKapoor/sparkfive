import styles from './filter-container.module.css'
import { Utilities } from '../../../assets'

// Components


const FilterContainer = () => {

    return (
        <main className={`${styles.container}`}>
           <div className={styles['top-bar']}>
                <h3>Filters</h3>
                <p>Clear</p>
                <div>&#10005;</div>
            </div>
        </main>

    )
}

export default FilterContainer
