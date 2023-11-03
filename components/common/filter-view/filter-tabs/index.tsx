import React, { useContext, useEffect, useState } from "react";

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
import Button from "../../buttons/button";
import IconClickable from "../../buttons/icon-clickable";
import FilterOptionPopup from "../../filter-option-popup";
import MoreFiltersOptionPopup from "../../filter-option-popup/more-filters-option-popup";
import styles from "../index.module.css";

interface IFilterTabsProps {
  attributes: IAttribute[];
  setAttributes: (data: IAttribute[]) => void;
}

const FilterTabs: React.FC<IFilterTabsProps> = ({
  attributes,
  setAttributes,
}) => {
  const { activeSortFilter, setRenderedFlag } = useContext(FilterContext);
  const {
    activeAttribute,
    loading,
    onAttributeClick,
    setActiveAttribute,
    values,
    filteredOptions,
    setFilteredOptions,
  } = useFilters(attributes);

  const { advancedConfig } = useContext(UserContext);

  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);

  const getAttributes = async () => {
    //TODO: refine and fix
    try {
      const res = await teamApi.getTeamAttributes({ defaultOnly: true });
      //check for filter elements to hide
      if (advancedConfig?.hideFilterElements) {
        const filteredAttrs = res.data.data.filter(
          (item) => advancedConfig?.hideFilterElements[item.id] !== true
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

  const onMoreFiltersClick = async () => {
    setShowMoreFilters((prevState) => !prevState);
  };

  return (
    <div className={`${styles["outer-Box"]}`}>
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

        {/* more filter button with icon (for mobile view) */}
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
                  values={values}
                  activeAttribute={activeAttribute}
                  setActiveAttribute={setActiveAttribute}
                  options={filteredOptions}
                  setOptions={setFilteredOptions}
                  loading={loading}
                />
              )}
            </div>
          );
        })}

        <div className={`${styles["main-wrapper"]}`}>
          <div
            className={`${styles["more-filter-btn"]}`}
            onClick={onMoreFiltersClick}
          >
            <Button text="More filters" className="text-primary-btn" />
          </div>
          {showMoreFilters && (
            <MoreFiltersOptionPopup
              attributes={attributes}
              setAttributes={setAttributes}
              setShowModal={setShowMoreFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
