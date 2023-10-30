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

import {
  filterKeyMap,
  ruleKeyMap,
  rulesMapper,
} from "../../../config/data/filter";
import { FilterContext } from "../../../context";
import Loader from "../UI/Loader/loader";
import FilterContent from "../filter-view/filter-content";
import RulesOptions from "./rules-options";

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
    if (activeAttribute.id === FilterAttributeVariants.DIMENSIONS) {
      setActiveSortFilter({
        ...activeSortFilter,
        dimensionWidth: undefined,
        dimensionHeight: undefined,
      });
    } else {
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
    }

    setActiveAttribute(null);
  };

  //TODO
  const onSearch = (term: string) => {
    console.log("Searching term....,", term);
  };

  const ruleKey = ruleKeyMap[activeAttribute.id] || `all-${activeAttribute.id}`;
  const activeRuleName =
    rulesMapper[activeSortFilter[ruleKey]] ?? rulesMapper["all"];

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
            <RulesOptions
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              onChangeRule={onChangeRule}
              activeRuleName={activeRuleName}
            />
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
