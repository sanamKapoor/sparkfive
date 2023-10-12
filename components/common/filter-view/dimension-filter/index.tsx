import styles from "./index.module.css";

// Components
import SliderSelector from "../../../common/inputs/slider-selector";

interface DimensionsFilterProps {
  limits: {
    maxHeight: number;
    minHeight: number;
    maxWidth: number;
    minWidth: number;
  };
}

const DimensionsFilter: React.FC<DimensionsFilterProps> = ({ limits }) => {
  const { maxHeight, minHeight, maxWidth, minWidth } = limits;
  return (
    <div className={`${styles.container}`}>
      <p className={`${styles.slider} ${styles["slider-height"]}`}>
        <h5>Select Height</h5>
        <form>
          <SliderSelector
            minNum={minHeight}
            maxNum={maxHeight}
            handleSlider={() => {}} //TODO: update
            valueSlider={{
              min: minHeight,
              max: maxHeight,
            }} //TODO: update
          />
        </form>
      </p>
      <div className={`${styles.slider} ${styles["slider-width"]}`}>
        <h5>Select Width</h5>
        <form>
          <SliderSelector
            minNum={minWidth}
            maxNum={maxWidth}
            handleSlider={() => {}} //TODO: update
            valueSlider={{
              min: minWidth,
              max: maxWidth,
            }} //TODO: update
          />
        </form>
      </div>
    </div>
  );
};

export default DimensionsFilter;
