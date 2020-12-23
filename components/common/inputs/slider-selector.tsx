import InputRange from 'react-input-range';

const SliderSelector = ({ minNum, maxNum, valueSlider, handleSlider }) => {

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