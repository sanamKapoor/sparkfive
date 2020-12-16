import styles from './filter-container.module.css'

// Components
import FilterSelector from './filter-selector'


const FilterContainer = () => {

    const tags = ['Q3 Creative', 'women', 'men', 'inside', 'spring', 'outdoor']

    return (
        <div className={`${styles.container}`}>
           <section className={styles['top-bar']}>
                <h3>Filters</h3>
                <div className={`${styles.clear}`}>
                    <p>Clear</p>
                    <div>&#10005;</div>
                </div>
            </section>
            <section>
                <h4>Tags</h4>
                <FilterSelector />
            </section>
        </div>

    )
}

export default FilterContainer
