import React, { useContext, useEffect } from "react";

import { FilterContext, UserContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import teamApi from "../../../../server-api/team";
import {
  checkIfBadgeVisible,
  getFilterKeyForAttribute,
} from "../../../../utils/filter";

import { Utilities } from "../../../../assets";
import {
  FilterAttributeVariants,
  IAttribute,
} from "../../../../interfaces/filters";
import Badge from "../../UI/Badge/badge";
import FilterOptionPopup from "../../filter-option-popup";
import styles from "../index.module.css";

interface IFilterTabsProps {
  attributes: IAttribute[];
  setAttributes: (data: IAttribute[]) => void;
}

const FilterTabs: React.FC<IFilterTabsProps> = ({
  attributes,
  setAttributes,
}) => {
  const { activeSortFilter, setActiveSortFilter, setRenderedFlag } =
    useContext(FilterContext);
  const {
    activeAttribute,
    loading,
    onAttributeClick,
    setActiveAttribute,
    setValues,
    values,
  } = useFilters(attributes, activeSortFilter, setActiveSortFilter);

  const { advancedConfig } = useContext(UserContext);

  const getAttributes = async () => {
    try {
      const res = await teamApi.getTeamAttributes();
      //check for filter elements to hide
      if (advancedConfig?.hideFilterElements) {
        const filteredAttrs = res.data.data.filter(
          (item) => advancedConfig?.hideFilterElements[item.id] !== false
        );
        setAttributes(filteredAttrs);
      }
    } catch (err) {
      console.log("[GET_ATTRIBUTES]: ", err);
    }
  };

  useEffect(() => {
    getAttributes();
    setRenderedFlag(true);
  }, []);

  return (
    <div className={`${styles["outer-wrapper"]}`}>
      {attributes.map((attr) => {
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
                  FilterAttributeVariants.DIMENSIONS,
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
  );
};

export default FilterTabs;
