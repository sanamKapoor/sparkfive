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
import styles from "./index.module.css";
import OptionData from "./options-data";

import Dropdown from "../../common/inputs/dropdown";

import IconClickable from "../buttons/icon-clickable";
import Loader from "../UI/Loader/loader";
import Divider from "./divider";

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
  const showRules = activeAttribute.selectionType === "selectMultiple";

  console.log("options: ", options);

  return (
    <>
      <div className={`${styles["main-container"]}`}>
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
            <Search
              className={styles.customStyles}
              buttonClassName={styles.icon}
              placeholder={`Search ${activeAttribute.name}`}
              onSubmit={() => {}}
            />
          </div>

          {loading ? (
            <Loader className={styles.customLoader} />
          ) : (
            <>
              {/* TODO: 1. move this into a separate Content Component
               *       2. fix type error
               */}
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

          {showRules && (
            <div>
              <div
                className={`${styles["rule-tag"]}`}
                onClick={() => setShowdropdown(!showDropdown)}
              >
                <label>Rule:</label>
                <div className={`${styles["select-wrapper"]}`}>
                  <p>All Selected</p>
                  <IconClickable
                    additionalClass={styles["dropdown-icon"]}
                    src={Utilities.arrowDark}
                  />
                </div>
              </div>
              {showDropdown && (
                <Dropdown
                  additionalClass={styles["dropdown-menu"]}
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
              <Divider />
            </div>
          )}
          <div className={`${styles["Modal-btn"]}`}>
            <Button className={"apply"} text={"Apply"} disabled={loading} />
            <Button
              className={"cancel"}
              text={"Cancel"}
              disabled={loading}
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterOptionPopup;
