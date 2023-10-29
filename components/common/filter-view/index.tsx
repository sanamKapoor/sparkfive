import React, { useContext, useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import {
  FilterAttributeVariants,
  IAttribute,
} from "../../../interfaces/filters";
import teamApi from "../../../server-api/team";

import { FilterContext, UserContext } from "../../../context";
import useFilters from "../../../hooks/use-filters";
import {
  checkIfBadgeVisible,
  getFilterKeyForAttribute,
} from "../../../utils/filter";
import Badge from "../UI/Badge/badge";
import FilterOptionPopup from "../filter-option-popup";
import styles from "./index.module.css";
import SelectedFilters from "./selected-filters";

const FilterView = () => {
  const { activeSortFilter, setRenderedFlag, setActiveSortFilter } =
    useContext(FilterContext);

  const [attrs, setAttrs] = useState<IAttribute[]>([]);

  const {
    activeAttribute,
    loading,
    onAttributeClick,
    onClearAll,
    onRemoveFilter,
    selectedFilters,
    setActiveAttribute,
    setValues,
    values,
  } = useFilters(attrs, activeSortFilter, setActiveSortFilter);

  const { advancedConfig } = useContext(UserContext);

  const getAttributes = async () => {
    try {
      const res = await teamApi.getTeamAttributes();
      //check for filter elements to hide
      if (advancedConfig?.hideFilterElements) {
        const filteredAttrs = res.data.data.filter(
          (item) => advancedConfig?.hideFilterElements[item.id] !== false
        );
        setAttrs(filteredAttrs);
      }
    } catch (err) {
      console.log("[GET_ATTRIBUTES]: ", err);
    }
  };

  useEffect(() => {
    getAttributes();
    setRenderedFlag(true); //TODO
  }, []);

  console.log("selectedFilters: ", selectedFilters);
  return (
    <div>
      <div className={`${styles["outer-wrapper"]}`}>
        {attrs.map((attr) => {
          return (
            <div key={attr.id}>
              <div
                className={
                  checkIfBadgeVisible(activeSortFilter, attr.id)
                    ? `${styles["inner-wrapper"]} ${styles["attribute-active"]}`
                    : `${styles["inner-wrapper"]}`
                }
                onClick={(e) => {
                  onAttributeClick(attr);
                }}
              >
                {attr.name}
                {checkIfBadgeVisible(activeSortFilter, attr.id) &&
                  ![
                    FilterAttributeVariants.LAST_UPDATED,
                    FilterAttributeVariants.DATE_UPLOADED,
                  ].includes(attr.id) && (
                    <Badge
                      count={
                        activeSortFilter[getFilterKeyForAttribute(attr.id)]
                          ?.length
                      }
                    />
                  )}

                <img
                  className={`${styles["arrow-down"]}`}
                  src={Utilities.downIcon}
                  alt=""
                />
              </div>
              {activeAttribute !== null && activeAttribute?.id === attr.id && (
                <FilterOptionPopup
                  activeAttribute={activeAttribute}
                  setActiveAttribute={setActiveAttribute}
                  options={values}
                  setOptions={setValues}
                  loading={loading}
                />
              )}
            </div>
          );
        })}
      </div>
      {selectedFilters.length > 0 && (
        <SelectedFilters
          data={selectedFilters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAll}
        />
      )}
    </div>
  );
};

export default FilterView;
