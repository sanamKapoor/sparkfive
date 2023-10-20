//🚧 work in progress 🚧
import React, { useContext, useState } from "react";

import { Utilities } from "../../../assets";

import {
  FilterAttributeVariants,
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

import { FilterContext } from "../../../context";
import Loader from "../UI/Loader/loader";
import IconClickable from "../buttons/icon-clickable";
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
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);
  const [filters, setFilters] = useState(); //TODO: define type
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

  //TODO: keep updating it until all filter views are not covered
  const hideSearch = activeAttribute.id === FilterAttributeVariants.DIMENSIONS;
  const hideClear = activeAttribute.id === FilterAttributeVariants.DIMENSIONS;

  /**
   * TODO:
   * 1. Add types
   * 2. Refactor
   */
  const onApply = (filterVariant: string, data: any) => {
    console.log("current filter variant: ", filterVariant);
    console.log("data: ", data);
    if (filterVariant === "dimensions") {
      setActiveSortFilter({
        ...activeSortFilter,
        dimensionWidth: data.dimensionWidth,
        dimensionHeight: data.dimensionHeight,
      });
    } else if (filterVariant === "resolutions") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterResolutions: data.filterResolutions,
      });
    }

    setActiveAttribute(null);
  };

  const onCancel = () => {
    setActiveAttribute(null);
  };

  //TODO: move it to more appropriate place
  const getFilterVariant = (id: string) => {
    const values: string[] = Object.values(FilterAttributeVariants);

    if (values.includes(id)) {
      return id;
    } else return FilterAttributeVariants.CUSTOM_FIELD;
  };

  return (
    <>
      <div className={`${styles["main-container"]}`}>
        <div className={`${styles["outer-wrapper"]}`}>
          <div className={`${styles["popup-header"]}`}>
            <span className={`${styles["main-heading"]}`}>
              Select {activeAttribute?.name}
            </span>
            <div className={styles.buttons}>
              {!hideClear && <button className={styles.clear}>clear</button>}
              <img
                src={Utilities.closeIcon}
                onClick={() => setActiveAttribute(null)}
              />
            </div>
          </div>
          {!hideSearch && (
            <div className={`${styles["search-btn"]}`}>
              {/* TODO: */}
              <Search
                className={styles.customStyles}
                buttonClassName={styles.icon}
                placeholder={`Search ${activeAttribute.name}`}
                onSubmit={() => {}}
              />
            </div>
          )}

          {loading ? (
            <Loader className={styles.customLoader} />
          ) : (
            <>
              {/* TODO: 1. move this into a separate Content Component
               *       2. fix type error
               */}
              {contentType === "list" && <OptionData data={options} />}
              {contentType === "dimensions" && (
                <DimensionsFilter limits={options} setFilters={setFilters} />
              )}
              {contentType === "resolutions" && (
                <ResolutionFilter data={options} setFilters={setFilters} />
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
            <Button
              className={"apply"}
              text={"Apply"}
              disabled={loading}
              onClick={() =>
                onApply(getFilterVariant(activeAttribute.id), filters)
              }
            />
            <Button
              className={"cancel"}
              text={"Cancel"}
              disabled={loading}
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterOptionPopup;
