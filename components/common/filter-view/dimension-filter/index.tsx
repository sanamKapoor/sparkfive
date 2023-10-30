import React from "react";
import { CommonFilterProps } from "../../../../interfaces/filters";
import styles from "./index.module.css";

interface DimensionsFilterProps extends CommonFilterProps {}

const DimensionsFilter: React.FC<DimensionsFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  console.log("options: ", options);
  const { dimensionWidth, dimensionHeight } = options;
  const handleWidthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    prop: "min" | "max"
  ) => {
    const updateDimensionWidth = (prevFilters) => {
      return {
        dimensionWidth: {
          ...prevFilters?.dimensionWidth,
          [prop]: e?.target?.value,
        },
        ...prevFilters,
      };
    };

    setOptions(updateDimensionWidth);
    setFilters(updateDimensionWidth);
  };

  const handleHeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    prop: "min" | "max"
  ) => {
    const updateDimensionHeight = (prevFilters) => {
      return {
        dimensionHeight: {
          ...prevFilters?.dimensionWidth,
          [prop]: e?.target?.value,
        },
        ...prevFilters,
      };
    };

    setOptions(updateDimensionHeight);
    setFilters(updateDimensionHeight);
  };

  return (
    <div className={`${styles.container}`}>
      <p className={styles.heading}>Width</p>
      <div className={styles.outer}>
        <input
          className={styles.inputField}
          value={dimensionWidth.min}
          onChange={(e) => handleWidthChange(e, "min")}
        />
        <div className={styles.line} />
        <input
          className={styles.inputField}
          value={dimensionWidth.max}
          onChange={(e) => handleWidthChange(e, "max")}
        />
      </div>
      <p className={styles.heading}>Height</p>
      <div className={styles.outer}>
        <input
          className={styles.inputField}
          value={dimensionHeight.min}
          onChange={(e) => handleHeightChange(e, "min")}
        />
        <div className={styles.line} />
        <input
          className={styles.inputField}
          value={dimensionHeight.max}
          onChange={(e) => handleHeightChange(e, "max")}
        />
      </div>
    </div>
  );
};

export default DimensionsFilter;
