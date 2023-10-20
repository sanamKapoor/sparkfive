import React, { useContext, useEffect, useState } from "react";
import { FilterContext } from "../../../../context";
import styles from "./index.module.css";

interface DimensionsFilterProps {
  limits: {
    maxHeight: number;
    minHeight: number;
    maxWidth: number;
    minWidth: number;
  };
  setFilters: (data: any) => void; //TODO
}

const DimensionsFilter: React.FC<DimensionsFilterProps> = ({
  limits,
  setFilters,
}) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { maxHeight, minHeight, maxWidth, minWidth } = limits;

  //TODO: check if this is actually required
  useEffect(() => {
    setFilters({ dimensionHeight, dimensionWidth });
  }, []);

  const [dimensionWidth, setDimensionWidth] = useState<{
    min: string;
    max: string;
  }>({
    min: activeSortFilter?.dimensionWidth?.min || minWidth,
    max: activeSortFilter?.dimensionWidth?.max || maxWidth,
  });

  const [dimensionHeight, setDimensionHeight] = useState<{
    min: string;
    max: string;
  }>({
    min: activeSortFilter?.dimensionHeight?.min || minHeight,
    max: activeSortFilter?.dimensionHeight?.max || maxHeight,
  });

  const handleWidthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    prop: "min" | "max"
  ) => {
    setDimensionWidth({ ...dimensionWidth, [prop]: e.target.value });
    setFilters({
      dimensionWidth: {
        ...dimensionWidth,
        [prop]: e.target.value,
      },
      dimensionHeight,
    });
  };

  const handleHeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    prop: "min" | "max"
  ) => {
    setDimensionHeight({ ...dimensionHeight, [prop]: e.target.value });
    setFilters({
      dimensionHeight: {
        ...dimensionHeight,
        [prop]: e.target.value,
      },
      dimensionWidth,
    });
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
