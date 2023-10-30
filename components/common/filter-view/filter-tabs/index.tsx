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
import Button from "../../buttons/button";
import IconClickable from "../../buttons/icon-clickable";

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
    setRenderedFlag(true); //TODO
  }, []);

  return (
    <>
      <div className={`${styles["outer-wrapper"]}`}>
        <div className={`${styles["filter-header-mobile"]}`}>
          <div className={`${styles["filter-heading-mobile"]}`}>
            <div>
              <span>Filter</span>
            </div>
            <div className={`${styles["close-buttons"]}`}>
              <Button text={"Clear"} className="text-secondary-btn" />
              <IconClickable
                additionalClass={styles["close-button"]}
                src={Utilities.bigblueClose}
              />
            </div>
          </div>
        </div>

        {/* more filter button with icon */}
        <div className={`${styles["more-filter-btnIcon"]}`}>
          <div className={`${styles["filter-btn-withIcon"]}`}>
            <IconClickable src={Utilities.filterSetting} />
            <Button text={"More filter"} className="text-primary-btn"></Button>
          </div>
        </div>

        {attributes.map((attr) => {
          return (
            <div className={`${styles["main-wrapper"]}`} key={attr.id}>
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
        <div className={`${styles["more-filter-btn"]}`}>
          <Button text={"More filter"} className="text-primary-btn"></Button>
        </div>
      </div>
    </>
  );
};

export default FilterTabs;
