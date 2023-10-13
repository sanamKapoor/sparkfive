//🚧 work in progress 🚧
import React, { useState } from "react";

import { Utilities } from "../../../assets";

import {
  IAttribute,
  IFilterAttributeValues,
  IFilterPopupContentType,
} from "../../../interfaces/filters";
import Search from "../../main/user-settings/SuperAdmin/Search/Search";
import Button from "../buttons/button";
import DimensionsFilter from "../filter-view/dimension-filter";
import DateUploaded from "../filter/date-uploaded";
import ProductFilter from "../filter/product-filter";
import ResolutionFilter from "../filter/resolution-filter";
import Divider from "./divider";
import styles from "./index.module.css";
import OptionData from "./options-data";

import Dropdown from "../../common/inputs/dropdown";

import IconClickable from "../buttons/icon-clickable";
import Spinner from "../spinners/spinner";

interface FilterOptionPopupProps {
  contentType: IFilterPopupContentType;
  options: IFilterAttributeValues;
  activeAttribute: IAttribute;
  setActiveAttribute: (val: IAttribute | null) => void;
  loading: boolean;
}

const FilterOptionPopup: React.FC<FilterOptionPopupProps> = ({
  options,
  contentType,
  activeAttribute,
  setActiveAttribute,
  loading,
}) => {
  console.log("activeAttribute inside FilterOptionPopup: ", activeAttribute);
  const [lastUpdatedStartDate, setLastUpdatedStartDate] = useState<Date>(
    new Date()
  );
  const [lastUpdatedEndDate, setLastUpdatedEndDate] = useState<Date>(
    new Date()
  );

  const [dateUploadedStartDate, setDateUploadedStartDate] = useState<Date>(
    new Date()
  );
  const [dateUploadedEndDate, setDateUploadedEndDate] = useState<Date>(
    new Date()
  );

  const [showDropdown, setShowdropdown] = useState<boolean>(false);
  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        <div className={`${styles["popup-header"]}`}>
          <span className={`${styles["main-heading"]}`}>
            Select {activeAttribute?.name}
          </span>
          <div className={styles.buttons}>
            <button className={styles.clear}>clear</button>
            <img
              src={Utilities.closeIcon}
              onClick={() => setActiveAttribute(null)}
            />
          </div>
        </div>
        <div className={`${styles["search-btn"]}`}>
          {/* TODO: */}
          <Search placeholder="Some Placeholder" onSubmit={() => {}} />
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* TODO: move this into a separate Content Component */}
            {contentType === "list" && <OptionData data={options} />}
            {contentType === "dimensions" && (
              <DimensionsFilter limits={options} />
            )}
            {contentType === "resolutions" && (
              <ResolutionFilter data={options} />
            )}
            {contentType === "lastUpdated" && (
              <DateUploaded
                startDate={lastUpdatedStartDate}
                endDate={lastUpdatedEndDate}
                setStartDate={setLastUpdatedStartDate}
                setEndDate={setLastUpdatedEndDate}
              />
            )}
            {contentType === "dateUploaded" && (
              <DateUploaded
                startDate={dateUploadedStartDate}
                endDate={dateUploadedEndDate}
                setStartDate={setDateUploadedStartDate}
                setEndDate={setDateUploadedEndDate}
              />
            )}
            {contentType === "products" && (
              <ProductFilter productFilters={options} />
            )}
          </>
        )}

        <div>
          <div
            className={`${styles["rule-tag"]}`}
            onClick={() => setShowdropdown(!showDropdown)}
          >
            <label>Rule:</label>
            <div>
              <p>All Selected</p>
              <IconClickable src={Utilities.arrowDark} />
            </div>
          </div>
          {showDropdown && (
            <Dropdown
              additionalClass={styles["view-dropdown"]}
              onClickOutside={() => {}}
              options={[
                {
                  label: "All selected",
                  id: "All selected",
                  onClick: () => {},
                },
                {
                  label: "Any Selected",
                  id: "Any",
                  onClick: () => {},
                },
                {
                  label: "No Tags",
                  id: "None",
                  onClick: () => {},
                },
              ]}
            />
          )}
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
