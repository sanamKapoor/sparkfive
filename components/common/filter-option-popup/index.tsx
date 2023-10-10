//🚧 work in progress 🚧
import React from "react";

import { Utilities } from "../../../assets";

import { IFilterPopupContentType } from "../../../interfaces/filters";
import Search from "../../common/inputs/search";
import Button from "../buttons/button";
import DimensionsFilter from "../filter-view/dimension-filter";
import ResolutionFilter from "../filter/resolution-filter";
import Divider from "./divider";
import styles from "./index.module.css";
import OptionData from "./options-data";
import SelectOption from "./select-option";

interface FilterOptionPopupProps {
  contentType: IFilterPopupContentType;
  options: any; //TODO;
  setShowAttrValues: (val: boolean) => void;
  activeAttribute: string;
}

const FilterOptionPopup: React.FC<FilterOptionPopupProps> = ({
  options,
  contentType,
  setShowAttrValues,
  activeAttribute,
}) => {
  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        <div className={`${styles["popup-header"]}`}>
          <span className={`${styles["main-heading"]}`}>
            Select {activeAttribute}
          </span>
          <div className={styles.buttons}>
            <button className={styles.clear}>clear</button>
            <img
              src={Utilities.closeIcon}
              onClick={() => setShowAttrValues(false)}
            />
          </div>
        </div>
        <div className={`${styles["search-btn"]}`}>
          <Search />
        </div>
        {contentType === "list" && <OptionData data={options} />}
        {contentType === "dimensions" && <DimensionsFilter limits={options} />}
        {contentType === "resolutions" && <ResolutionFilter data={options} />}

        <div className={`${styles["rule-tag"]}`}>
          <label>Rule:</label>
          <SelectOption />
        </div>
        <Divider />
        <div className={`${styles["Modal-btn"]}`}>
          <Button className={"apply"} text={"Apply"} />
          <Button className={"cancel"} text={"Cancel"}></Button>
        </div>
      </div>
    </>
  );
};

export default FilterOptionPopup;
