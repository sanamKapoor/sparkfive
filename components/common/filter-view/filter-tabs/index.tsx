import React, { useContext, useEffect, useRef, useState } from "react";

import { FilterContext, UserContext, AssetContext } from "../../../../context";
import useFilters from "../../../../hooks/use-filters";
import teamApi from "../../../../server-api/team";
import { checkIfBadgeVisible, getFilterKeyForAttribute, getSortedAttributes } from "../../../../utils/filter";

import { Utilities } from "../../../../assets";
import { FilterAttributeVariants, IAttribute } from "../../../../interfaces/filters";
import shareCollectionApi from "../../../../server-api/share-collection";
import Badge from "../../UI/Badge/badge";
import ClickOutside from "../../UI/ClickOutside";
import Button from "../../buttons/button";
import IconClickable from "../../buttons/icon-clickable";
import FilterOptionPopup from "../../filter-option-popup";
import MoreFiltersOptionPopup from "../../filter-option-popup/more-filters-option-popup";
import styles from "../index.module.css";

interface IFilterTabsProps {
  attributes: IAttribute[];
  setAttributes: (data: IAttribute[]) => void;
}

const FilterTabs: React.FC<IFilterTabsProps> = ({ attributes, setAttributes }) => {
  const { activeSortFilter, isPublic, sharePath } = useContext(FilterContext);
  const { sidebarOpen } = useContext(AssetContext);
  const {
    activeAttribute,
    loading,
    onAttributeClick,
    setActiveAttribute,
    values,
    filteredOptions,
    setFilteredOptions,
  } = useFilters(attributes);

  // console.log(`>>> Attribute`, attributes);

  const { advancedConfig } = useContext(UserContext);

  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);

  const exceptionRef = useRef(null);

  const getAttributes = async () => {
    //TODO: refine and fix
    try {
      const fetchApi = isPublic ? shareCollectionApi : teamApi;
      const res = await fetchApi.getTeamAttributes({
        defaultOnly: true,
        ...(sharePath && { sharePath }),
      });
      // TODO: need to check for advancedConfig.aiTagging setting as well

      // console.log(`>>> Attribute from server`, res.data.data);

      //check for filter elements to hide
      if (advancedConfig?.hideFilterElements) {
        const filteredAttrs = res.data.data.filter((item: any) => advancedConfig?.hideFilterElements[item.id] !== true);

        setAttributes(getSortedAttributes(filteredAttrs));
      }
    } catch (err) {
      console.log("[GET_ATTRIBUTES]: ", err);
    }
  };

  useEffect(() => {
    getAttributes();
  }, []);

  const onMoreFiltersClick = async () => {
    setShowMoreFilters((prevState) => !prevState);
  };

  const onClickOutsideAttribute = (e) => {
    e.stopPropagation();
    setActiveAttribute((prev) => null);
    setFilteredOptions([]);
  };

  const onClickOutsideMoreFilters = () => {
    setShowMoreFilters(false);
  };

  return (
    <div className={`${styles["outer-Box"]} ${styles["asset-filter"]}`}>
      <div className={`${styles["outer-wrapper"]}`}>
        <div className={`${styles["filter-header-mobile"]}`}>
          <div className={`${styles["filter-heading-mobile"]}`}>
            <div>
              <span>Filter</span>
            </div>
            <div className={`${styles["close-buttons"]}`}>
              <Button text={"Clear"} className="text-secondary-btn" />
              <IconClickable additionalClass={styles["close-button"]} src={Utilities.bigblueClose} />
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
            <ClickOutside
              onClick={onClickOutsideAttribute}
              className={`${styles["main-wrapper"]}`}
              key={attr.id}
              exceptionRef={exceptionRef}
            >
              <div
                className={
                  checkIfBadgeVisible(activeSortFilter, attr.id)
                    ? `${styles["inner-wrapper"]} ${styles["attribute-active"]}`
                    : `${styles["inner-wrapper"]}`
                }
                onClick={(e) => {
                  onAttributeClick(attr);
                }}
                onKeyDown={(e) => {
                  onAttributeClick(attr);
                }}
              >
                {attr.name}
                {checkIfBadgeVisible(activeSortFilter, attr.id) &&
                  ![
                    FilterAttributeVariants.LAST_UPDATED,
                    FilterAttributeVariants.DATE_UPLOADED,
                    FilterAttributeVariants.DIMENSIONS,
                  ].includes(attr.id) && <Badge count={activeSortFilter[getFilterKeyForAttribute(attr.id)]?.length} />}
                <img className={`${styles["arrow-down"]}`} src={Utilities.downIconLight} alt="" />
              </div>
              {activeAttribute !== null && activeAttribute?.id === attr.id && (
                <div ref={exceptionRef}>
                  <FilterOptionPopup
                    sidebarOpen={sidebarOpen}
                    values={values}
                    options={filteredOptions}
                    setOptions={setFilteredOptions}
                    activeAttribute={activeAttribute}
                    setActiveAttribute={setActiveAttribute}
                    loading={loading}
                  />
                </div>
              )}
            </ClickOutside>
          );
        })}

        {attributes.length > 0 && (
          <>
            <div className={`${styles["more-filter-btn"]}`} id="more-filter">
              <div className={`${styles["filter-button"]}`} onClick={onMoreFiltersClick} onKeyDown={onMoreFiltersClick}>
                <Button text="More Filters" className="text-primary-btn" />
                <img className={`${styles["more-filter-arrow"]}`} src={Utilities.downIconLight} alt="" />
              </div>
              <ClickOutside className={`${styles["main-wrapper"]}`} onClick={onClickOutsideMoreFilters}>
                {showMoreFilters && (
                  <MoreFiltersOptionPopup
                    attributes={attributes}
                    setAttributes={setAttributes}
                    setShowModal={setShowMoreFilters}
                  />
                )}
              </ClickOutside>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterTabs;
