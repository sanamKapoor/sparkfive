import React, { useContext, useEffect, useState } from "react";
import { FilterContext } from "../../../../context";
import { CommonFilterProps } from "../../../../interfaces/filters";
import styles from "./index.module.css";

interface DimensionsFilterProps extends CommonFilterProps {}

const DimensionsFilter: React.FC<DimensionsFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { dimensionWidth: width, dimensionHeight: height } = options;
  const [dimensionWidth, setDimensionWidth] = useState<{
    min: number;
    max: number;
  }>({
    min: activeSortFilter?.dimensionWidth?.min || width?.min,
    max: activeSortFilter?.dimensionWidth?.max || width?.max,
  });

  const [dimensionHeight, setDimensionHeight] = useState<{
    min: number;
    max: number;
  }>({
    min: activeSortFilter?.dimensionHeight?.min || height?.min,
    max: activeSortFilter?.dimensionHeight?.max || height?.max,
  });

  useEffect(() => {
    if(options?.dimensionHeight?.min && options?.dimensionHeight?.max) setDimensionHeight({
      min: options?.dimensionHeight?.min,
      max: options?.dimensionHeight?.max,
    })
    if(options?.dimensionWidth?.min && options?.dimensionWidth?.max) setDimensionWidth({
      min: options?.dimensionWidth?.min,
      max: options?.dimensionWidth?.max,
    })
  }, [options?.dimensionHeight, options?.dimensionWidth])

  const handleWidthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    prop: "min" | "max"
  ) => {
    const value = parseInt(e.target.value);

    setDimensionWidth({ ...dimensionWidth, [prop]: value });

    const updatedState = {
      dimensionWidth: {
        ...dimensionWidth,
        [prop]: value,
      },
      dimensionHeight,
    };

    setOptions(updatedState);
    setFilters(updatedState);
  };

  const handleHeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    prop: "min" | "max"
  ) => {
    const value = parseInt(e.target.value);

    setDimensionHeight({ ...dimensionHeight, [prop]: value });

    const updatedState = {
      dimensionHeight: {
        ...dimensionHeight,
        [prop]: value,
      },
      dimensionWidth,
    };

    setOptions(updatedState);
    setFilters(updatedState);
  };

  return (
    <div className={`${styles.container}`}>
      <p className={styles.heading}>Width</p>
      <div className={styles.outer}>
        <input
          type="number"
          className={styles.inputField}
          value={dimensionWidth.min}
          onChange={(e) => handleWidthChange(e, "min")}
        />
        <div className={styles.line} />
        <input
          type="number"
          className={styles.inputField}
          value={dimensionWidth.max}
          onChange={(e) => handleWidthChange(e, "max")}
        />
      </div>
      <p className={styles.heading}>Height</p>
      <div className={styles.outer}>
        <input
          type="number"
          className={styles.inputField}
          value={dimensionHeight.min}
          onChange={(e) => handleHeightChange(e, "min")}
        />
        <div className={styles.line} />
        <input
          type="number"
          className={styles.inputField}
          value={dimensionHeight.max}
          onChange={(e) => handleHeightChange(e, "max")}
        />
      </div>
    </div>
  );
};

export default DimensionsFilter;
