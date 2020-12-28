import styles from './dimensions-filter.module.css'
import { useEffect } from 'react'

// Components
import SliderSelector from '../../common/inputs/slider-selector'

const DimensionsFilter = ({
    heightDimensionLimits,
    widthdimensionLimits,
    handleHeight,
    valueHeight,
    handleWidth,
    valueWidth,
    loadFn
}) => {

    useEffect(() => {
        loadFn()
    }, [])

    return (
        <div className={`${styles.container}`}>
            <p className={`${styles.slider} ${styles['slider-height']}`}>
                <h5>Select Height</h5>
                <form>
                    <SliderSelector
                        minNum={heightDimensionLimits.min}
                        maxNum={heightDimensionLimits.max}
                        handleSlider={handleHeight}
                        valueSlider={valueHeight}
                    />
                </form>
            </p>
            <div className={`${styles.slider} ${styles['slider-width']}`}>
                <h5>Select Width</h5>
                <form>
                    <SliderSelector
                        minNum={widthdimensionLimits.min}
                        maxNum={widthdimensionLimits.max}
                        handleSlider={handleWidth}
                        valueSlider={valueWidth}
                    />
                </form>
            </div>
        </div>

    )
}

export default DimensionsFilter


