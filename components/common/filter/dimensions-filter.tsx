import styles from './dimensions-filter.module.css'
import { useState, useEffect } from 'react'
import { ItemFields, Utilities } from '../../../assets'


// Components
import SliderSelector from '../../common/inputs/slider-selector'


const DimensionsFilter = () => {

    return (
        <div className={`${styles.container}`}>
            <p className={`${styles.slider} ${styles['slider-height']}`}>
                <h5>Select Height</h5>
                <form>
                    <SliderSelector 
                        minNum={125}
                        maxNum={900}
                    />
                </form>
            </p>
            <div className={`${styles.slider} ${styles['slider-width']}`}>
                <h5>Select Width</h5>
                <form>
                    <SliderSelector 
                        minNum={125}
                        maxNum={900}
                    />
                </form>
            </div>
        </div>

    )
}

export default DimensionsFilter


