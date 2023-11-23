import React, { useContext, useState } from "react";

import { Utilities } from "../../../assets";

import {
  FilterAttributeVariants,
  IAttribute,
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
import NoResultsPopup from "../UI/NoResultsPopup";
import FilterContent from "../filter-view/filter-content";
import RulesOptions from "./rules-options";

interface FilterOptionPopupProps {
  values: Array<unknown> | Record<string, unknown>;
  options: unknown;
  setOptions: (data: unknown) => void;
  activeAttribute: IAttribute;
  setActiveAttribute: (val: IAttribute | null) => void;
  loading: boolean;
}

const FilterOptionPopup: React.FC<FilterOptionPopupProps> = ({
  values,
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

  const hideSearch = (
    [
      FilterAttributeVariants.DIMENSIONS,
      FilterAttributeVariants.LAST_UPDATED,
      FilterAttributeVariants.DATE_UPLOADED,
      FilterAttributeVariants.RESOLUTION,
      FilterAttributeVariants.FILE_TYPES,
      FilterAttributeVariants.ORIENTATION,
    ] as string[]
  ).includes(activeAttribute.id);

  const onApply = (id: string, data: any) => {
    if (data) {
      if (id === FilterAttributeVariants.DIMENSIONS) {
        setActiveSortFilter({
          ...activeSortFilter,
          dimensionWidth: data.dimensionWidth,
          dimensionHeight: data.dimensionHeight,
        });
      }
    }

    setActiveAttribute(null);
  };

  const onClose = () => {
    setActiveAttribute(null);
  };

  const onCancel = () => {
    onClose();
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

  const onSearch = (term: string) => {
    if (term.trim() === "") {
      setOptions(values); // Reset to the original list when search term is empty
    } else {
      let filteredResults = [];
      if (activeAttribute.id === FilterAttributeVariants.PRODUCTS) {
        filteredResults = values.filter(
          (option) => option.sku.toLowerCase().includes(term.toLowerCase()) // Replace 'name' with the property you want to search in
        );
      } else {
        filteredResults = values.filter(
          (option) => option.name.toLowerCase().includes(term.toLowerCase()) // Replace 'name' with the property you want to search in
        );
      }

      setOptions(filteredResults);
    }
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

  const checkIfValuesExist = () => {
    if (activeAttribute) {
      if (
        [
          FilterAttributeVariants.LAST_UPDATED,
          FilterAttributeVariants.DATE_UPLOADED,
          FilterAttributeVariants.DIMENSIONS,
        ].includes(activeAttribute?.id)
      ) {
        return true;
      } else {
        return values instanceof Array
          ? values.length > 0
          : Object.keys(values).length > 0;
      }
    }
  };

  const showModalActionBtns =
    activeAttribute.id === FilterAttributeVariants.DIMENSIONS;

  return (
    <div className={`${styles["main-container"]}`}>
    <div className={`${styles["outer-wrapper"]}`}>
   
      {checkIfValuesExist() ? (
        <>
          <div className={`${styles["popup-mobile-view"]}`}>
            <div className={`${styles["popup-mobile-header"]}`}>
              <img src={Utilities.leftArrow} alt="left-arrow" />
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
                  className={styles.closeIcon}
                  src={Utilities.closeIcon}
                  onClick={onClose}
                  onKeyDown={onClose}
                />
              </div>
            </div>
          </div>

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
                className={styles.closeIcon}
                src={Utilities.closeIcon}
                onClick={onClose}
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
          {showModalActionBtns && (
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
          )}
        </>
      ) : (
        <NoResultsPopup onClose={onClose} />
      )}
    </div>
    </div>
  );
};

export default FilterOptionPopup;
