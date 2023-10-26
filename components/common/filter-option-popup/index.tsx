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
import ProductFilter from "../filter/product-filter";
import ResolutionFilter from "../filter/resolution-filter";
import styles from "./index.module.css";
import OptionData from "./options-data";

import Dropdown from "../../common/inputs/dropdown";

import { FilterContext } from "../../../context";
import Loader from "../UI/Loader/loader";
import IconClickable from "../buttons/icon-clickable";
import DateUploadedFilter from "../filter-view/date-uploaded-filter";
import FileTypeFilter from "../filter-view/file-type-filter";
import LastUpdatedFilter from "../filter-view/last-updated-filter";
import OrientationFilter from "../filter-view/orientation-filter";
import Divider from "./divider";

interface FilterOptionPopupProps {
  contentType: IFilterPopupContentType;
  options: IFilterAttributeValues;
  setOptions: (data: unknown) => void;
  activeAttribute: IAttribute;
  setActiveAttribute: (val: IAttribute | null) => void;
  loading: boolean;
}

//TODO
const rulesMapper = {
  all: "All Selected",
  any: "Any Selected",
  none: "No Tags",
};

const FilterOptionPopup: React.FC<FilterOptionPopupProps> = ({
  options,
  setOptions,
  contentType,
  activeAttribute,
  setActiveAttribute,
  loading,
}) => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const [filters, setFilters] = useState(); //TODO: define type

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const showRules = activeAttribute.selectionType === "selectMultiple";

  //TODO: keep updating it until all filter views are not covered
  const hideSearch = activeAttribute.id === FilterAttributeVariants.DIMENSIONS;

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
    } else if (filterVariant === "resolution") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterResolutions: data?.filterResolutions,
      });
    } else if (filterVariant === "tags") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterNonAiTags: data?.filterNonAiTags,
      });
    } else if (filterVariant === "aiTags") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterAiTags: data?.filterAiTags,
      });
    } else if (filterVariant === "campaigns") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterCampaigns: data?.filterCampaigns,
      });
    } else if (filterVariant === "products") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterProductSku: data?.filterProductSku,
      });
    } else if (filterVariant === "fileTypes") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterFileTypes: data?.filterFileTypes,
      });
    } else if (filterVariant === "orientation") {
      setActiveSortFilter({
        ...activeSortFilter,
        filterOrientations: data?.filterOrientations,
      });
    } else if (filterVariant === "dateUploaded") {
      setActiveSortFilter({
        ...activeSortFilter,
        dateUploaded: data?.dateUploaded,
      });
    } else if (filterVariant === "lastUpdated") {
      setActiveSortFilter({
        ...activeSortFilter,
        lastUpdated: data?.lastUpdated,
      });
    } else {
      const filterKey = `custom-p${activeAttribute.id}`;
      setActiveSortFilter({
        ...activeSortFilter,
        [filterKey]: data[filterKey],
      });
    }

    setActiveAttribute(null);
  };

  const onCancel = () => {
    setActiveAttribute(null);
  };

  const onClear = () => {
    console.log("activeAttribute.id: ", activeAttribute.id);
    if (activeAttribute.id === FilterAttributeVariants.TAGS) {
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        filterNonAiTags: [],
        allNonAiTags: "all",
      });
    } else if (activeAttribute.id === FilterAttributeVariants.AI_TAGS) {
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        filterAiTags: [],
        allAiTags: "all",
      });
    } else if (activeAttribute.id === FilterAttributeVariants.CAMPAIGNS) {
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        filterCampaigns: [],
        allCampaigns: "all",
      });
    } else if (activeAttribute.id === FilterAttributeVariants.PRODUCTS) {
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        filterProductSku: undefined,
      });
    } else if (activeAttribute.id === FilterAttributeVariants.FILE_TYPES) {
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        filterFileTypes: [],
      });
    } else if (activeAttribute.id === FilterAttributeVariants.ORIENTATION) {
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        filterOrientations: [],
      });
    } else if (activeAttribute.id === FilterAttributeVariants.DATE_UPLOADED) {
      console.log("coming in here.......");
      setOptions(undefined);
      setActiveSortFilter({
        ...activeSortFilter,
        dateUploaded: undefined,
      });
    } else if (activeAttribute.id === FilterAttributeVariants.LAST_UPDATED) {
      setOptions(undefined);
      setActiveSortFilter({
        ...activeSortFilter,
        lastUpdated: undefined,
      });
    } else {
      const filterKey = `custom-p${activeAttribute.id}`;
      const filterRuleKey = `all-${activeAttribute.id}`;
      setOptions(options.map((item) => ({ ...item, isSelected: false })));
      setActiveSortFilter({
        ...activeSortFilter,
        [filterKey]: [],
        [filterRuleKey]: "all",
      });
    }
  };

  //TODO: move it to more appropriate place
  const getFilterVariant = (id: string) => {
    const values: string[] = Object.values(FilterAttributeVariants);

    if (values.includes(id)) {
      return id;
    } else return FilterAttributeVariants.CUSTOM_FIELD;
  };

  //TODO
  const onSearch = (term: string) => {
    console.log("Searching term....,", term);
  };

  const ruleIndex =
    activeAttribute.id === "tags"
      ? `allNonAiTags`
      : activeAttribute.type === "custom"
      ? `all-p${activeAttribute.id}`
      : activeAttribute;

  const onChangeRule = (ruleName: string) => {
    let id = activeAttribute.id;

    if (activeAttribute.id === "tags") {
      id = "NonAiTags";
    }

    if (activeAttribute.type === "custom") {
      id = `-p${activeAttribute.id}`;
    }
    setActiveSortFilter({
      ...activeSortFilter,
      [`all${id}`]: ruleName,
    });

    setShowDropdown(false);
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
              <button
                className={styles.clear}
                disabled={loading}
                onClick={onClear}
              >
                clear
              </button>
              <img
                src={Utilities.closeIcon}
                onClick={() => setActiveAttribute(null)}
              />
            </div>
          </div>
          {!hideSearch && (
            <div className={`${styles["search-btn"]}`}>
              <Search
                className={styles.customStyles}
                buttonClassName={styles.icon}
                placeholder={`Search ${activeAttribute.name}`}
                onSubmit={onSearch}
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
              {contentType === "list" && (
                <OptionData
                  values={options}
                  setValues={setOptions}
                  setFilters={setFilters}
                  activeAttribute={activeAttribute}
                />
              )}
              {contentType === "dimensions" && (
                <DimensionsFilter limits={options} setFilters={setFilters} />
              )}
              {contentType === "resolutions" && (
                <ResolutionFilter data={options} setFilters={setFilters} />
              )}
              {contentType === "fileTypes" && (
                <FileTypeFilter
                  values={options}
                  setValues={setOptions}
                  setFilters={setFilters}
                />
              )}
              {contentType === "orientation" && (
                <OrientationFilter
                  values={options}
                  setValues={setOptions}
                  setFilters={setFilters}
                />
              )}
              {contentType === "lastUpdated" && (
                <LastUpdatedFilter
                  data={options}
                  setData={setOptions}
                  setFilters={setFilters}
                />
              )}
              {contentType === "dateUploaded" && (
                <DateUploadedFilter
                  data={options}
                  setData={setOptions}
                  setFilters={setFilters}
                />
              )}
              {contentType === "products" && (
                <ProductFilter
                  values={options}
                  setValues={setOptions}
                  setFilters={setFilters}
                />
              )}
            </>
          )}

          {showRules && (
            <div>
              <div
                className={`${styles["rule-tag"]}`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <label>Rule:</label>
                <div className={`${styles["select-wrapper"]}`}>
                  {/* TODO */}
                  <p>
                    {rulesMapper[activeSortFilter[ruleIndex]] ??
                      rulesMapper["all"]}
                  </p>
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
                      onClick: () => onChangeRule("all"),
                    },
                    {
                      label: "Any Selected",
                      id: "Any",
                      onClick: () => onChangeRule("any"),
                    },
                    {
                      label: "No Tags",
                      id: "None",
                      onClick: () => onChangeRule("none"),
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
              disabled={loading || !filters}
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
