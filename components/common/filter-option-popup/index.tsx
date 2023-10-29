//🚧 work in progress 🚧
import React, { useContext, useState } from "react";

import { Utilities } from "../../../assets";

import {
  FilterAttributeVariants,
  IAttribute,
  IFilterAttributeValues,
} from "../../../interfaces/filters";
import Search from "../../main/user-settings/SuperAdmin/Search/Search";
import Button from "../buttons/button";
import styles from "./index.module.css";

import Dropdown from "../../common/inputs/dropdown";

import {
  filterKeyMap,
  ruleKeyMap,
  rulesMapper,
} from "../../../config/data/filter";
import { FilterContext } from "../../../context";
import Loader from "../UI/Loader/loader";
import IconClickable from "../buttons/icon-clickable";
import FilterContent from "../filter-view/filter-content";
import Divider from "./divider";

interface FilterOptionPopupProps {
  options: IFilterAttributeValues;
  setOptions: (data: unknown) => void;
  activeAttribute: IAttribute;
  setActiveAttribute: (val: IAttribute | null) => void;
  loading: boolean;
}

const FilterOptionPopup: React.FC<FilterOptionPopupProps> = ({
  options,
  setOptions,
  activeAttribute,
  setActiveAttribute,
  loading,
}) => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const [filters, setFilters] = useState(); //TODO: define type

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const showRules = activeAttribute.selectionType === "selectMultiple";

  const hideSearch =
    activeAttribute.id === FilterAttributeVariants.DIMENSIONS ||
    activeAttribute.id === FilterAttributeVariants.LAST_UPDATED ||
    activeAttribute.id === FilterAttributeVariants.DATE_UPLOADED;

  const onApply = (id: string, data: any) => {
    //TODO: handle case if some filters already exists and new ones are added for a particular filterKey
    const filterKey = filterKeyMap[id] || `custom-p${activeAttribute.id}`;

    if (id === FilterAttributeVariants.DIMENSIONS) {
      setActiveSortFilter({
        ...activeSortFilter,
        dimensionWidth: data.dimensionWidth,
        dimensionHeight: data.dimensionHeight,
      });
    } else {
      console.log("coming inside else - onApply");

      console.log("data: ", data);
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
    const filterKey =
      filterKeyMap[activeAttribute.id] || `custom-p${activeAttribute.id}`;
    const ruleKey =
      ruleKeyMap[activeAttribute.id] || `all-${activeAttribute.id}`;

    const clearOptions =
      activeAttribute.id !== FilterAttributeVariants.DATE_UPLOADED &&
      activeAttribute.id !== FilterAttributeVariants.LAST_UPDATED;

    setOptions(
      clearOptions
        ? options.map((item) => ({ ...item, isSelected: false }))
        : undefined
    );

    const clearFilter = {};
    clearFilter[filterKey] = clearOptions ? [] : undefined;
    clearFilter[ruleKey] = clearOptions ? "all" : undefined;

    setActiveSortFilter({
      ...activeSortFilter,
      ...clearFilter,
    });
  };

  //   if (activeAttribute.id === FilterAttributeVariants.TAGS) {
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       filterNonAiTags: [],
  //       allNonAiTags: "all",
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.AI_TAGS) {
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       filterAiTags: [],
  //       allAiTags: "all",
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.CAMPAIGNS) {
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       filterCampaigns: [],
  //       allCampaigns: "all",
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.PRODUCTS) {
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       filterProductSku: [], //TODO: verify
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.FILE_TYPES) {
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       filterFileTypes: [],
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.ORIENTATION) {
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       filterOrientations: [],
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.DATE_UPLOADED) {
  //     console.log("coming in here.......");
  //     setOptions(undefined);
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       dateUploaded: undefined,
  //     });
  //   } else if (activeAttribute.id === FilterAttributeVariants.LAST_UPDATED) {
  //     setOptions(undefined);
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       lastUpdated: undefined,
  //     });
  //   } else {
  //     const filterKey = `custom-p${activeAttribute.id}`;
  //     const filterRuleKey = `all-${activeAttribute.id}`;
  //     setOptions(options.map((item) => ({ ...item, isSelected: false })));
  //     setActiveSortFilter({
  //       ...activeSortFilter,
  //       [filterKey]: [],
  //       [filterRuleKey]: "all",
  //     });
  //   }
  // };

  //TODO
  const onSearch = (term: string) => {
    console.log("Searching term....,", term);
  };

  const ruleKey = ruleKeyMap[activeAttribute.id] || `all-${activeAttribute.id}`;

  const onChangeRule = (ruleName: string) => {
    setActiveSortFilter({
      ...activeSortFilter,
      [ruleKey]: ruleName,
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
            <FilterContent
              options={options}
              setOptions={setOptions}
              setFilters={setFilters}
              activeAttribute={activeAttribute}
            />
          )}

          {showRules && (
            <div>
              <div
                className={`${styles["rule-tag"]}`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <label>Rule:</label>
                <div className={`${styles["select-wrapper"]}`}>
                  <p>
                    {rulesMapper[activeSortFilter[ruleKey]] ??
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
              disabled={loading}
              onClick={() => onApply(activeAttribute.id, filters)}
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
