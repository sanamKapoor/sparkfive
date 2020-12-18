import InputRange from 'react-input-range';
import { useState } from 'react'

const SliderSelector = ({minNum, maxNum}) => {

    const [valueSlider, setValueSlider] = useState( { min: minNum, max: maxNum, },)

    const handleSlider = ({ value }) => {
        setValueSlider(value)
    }

    return (
        <InputRange
            maxValue={maxNum}
            minValue={minNum}
            formatLabel={value => `${value}px`}
            value={valueSlider}
            onChange={value => handleSlider({ value: value })}
            onChangeComplete={value => console.log(value)}
        />
    )
}

export default SliderSelector