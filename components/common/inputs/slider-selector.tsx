import { useState } from "react";
import InputRange from "react-input-range";

const SliderSelector = ({ minNum, maxNum, valueSlider, handleSlider }) => {
  const [sliderValue, setSliderValue] = useState(valueSlider);
  return (
    <InputRange
      maxValue={maxNum}
      minValue={minNum}
      formatLabel={(value) => `${value}px`}
      value={sliderValue && sliderValue.min ? sliderValue : valueSlider}
      onChange={(value: any) => setSliderValue(value)}
      onChangeComplete={(value) => handleSlider({ value: value })}
    />
  );
};

export default SliderSelector;
