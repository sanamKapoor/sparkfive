import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { Utilities } from "../../../../assets";
import { IAttribute } from "../../../../interfaces/filters";
import Button from "../../buttons/button";
import indexStyles from "../index.module.css";
import OptionDataItem from "../option-data-item";
import styles from "../options-data.module.css";
import Loader from "../../UI/Loader/loader";

import { FilterContext, UserContext } from "../../../../context";
import shareCollectionApi from "../../../../server-api/share-collection";
import teamApi from "../../../../server-api/team";
import { getSortedAttributes } from "../../../../utils/filter";
import toastUtils from "../../../../utils/toast";

import { FilterAttributeVariants } from "../../../../interfaces/filters"; // Import FilterAttributeVariants

interface MoreFiltersOptionPopupProps {
  attributes: IAttribute[];
  setAttributes: (data: unknown) => void;
  setShowModal: (val: boolean) => void;
}

const MoreFiltersOptionPopup: React.FC<MoreFiltersOptionPopupProps> = ({
  attributes,
  setAttributes,
  setShowModal,
}) => {
  const { isPublic, sharePath } = useContext(FilterContext);

  const { advancedConfig } = useContext(UserContext);

  const [options, setOptions] = useState([]);
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    getMoreFilters();
  }, []);

  useEffect(() => {
    checkIfValuesExist(); // Call checkIfValuesExist on mount or when dependencies change
  }, [activeAttribute, options, sidebarOpen]);

  const getMoreFilters = async () => {
    try {
      const fetchApi = isPublic ? shareCollectionApi : teamApi;

      const res = await fetchApi.getTeamAttributes({
        ...(sharePath && { sharePath }),
      });

      // Check for filter elements to hide
      if (advancedConfig?.hideFilterElements) {
        const filteredAttrs = res.data.data.filter(
          (item) => advancedConfig?.hideFilterElements[item.id] !== true
        );

        const mapFilteredAttrs = filteredAttrs.map((item) => {
          const attrExists = attributes?.find((attr) => attr.id === item.id);

          if (attrExists) {
            return {
              ...item,
              isSelected: true,
            };
          }
          return { ...item, isSelected: false };
        });

        setLoader(false)
        setOptions(mapFilteredAttrs);
      }
    } catch (err) {
      console.log("[GET_MORE_ATTRIBUTES]: ", err);
    }
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
        // Update this part based on your component's structure and data
        if (options) {
          return options instanceof Array
            ? options.length > 0
            : Object.keys(options).length > 0;
        }
      }
    }
    return false;
  };

  const filterModalPosition = () => {
    const mainFilterModal = document.getElementById('more-filter');
    const modal = document.getElementById('modal');

    if (mainFilterModal && modal) {
      const viewportWidth = window.innerWidth;
      const modalWidth = modal.offsetWidth;
      // const leftElement = modal.offsetLeft;
      const additionalLength = sidebarOpen ? 378 : 0;
      var leftElement = mainFilterModal.offsetLeft // left width from filter to the clicked element
      if (viewportWidth < (leftElement + modalWidth + additionalLength)) {
        // There is enough space on the right
        modal.style.right = '0px';
        modal.style.left = 'unset';
      }
    }
  };
  const onSelectOption = (data: IAttribute) => {
    const index = options.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      options[index].isSelected = true;
    }

    setOptions([...options]);
  };

  const onDeselectOption = (data: IAttribute) => {
    const index = options.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      options[index].isSelected = false;
    }

    setOptions([...options]);
  };

  const onApply = () => {
    if (options.every((option) => !option.isSelected)) {
      toastUtils.error("Please select at least one filter type!");
    } else {
      const selectedAttributes = options.filter((option) => option.isSelected);
      setAttributes([...getSortedAttributes(selectedAttributes)]);
      setShowModal(false);
    }
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onCancel = () => {
    onClose();
  };
  useEffect(() => {
    if (options.length > 0) {
      filterModalPosition()
    }
  }, [options])

  useLayoutEffect(() => {
    const mainFilterModal = document.getElementById('more-filter');
    const modal = document.getElementById('modal');
    if (mainFilterModal && modal) {
      var viewportWidth = window.innerWidth;
      var leftElement = mainFilterModal.offsetLeft // left width from filter to the clicked element
      const additionalLength = sidebarOpen ? 378 : 0 // addition length of sidebar and space between modal
      let thresholdValue = 567
      if (window.innerWidth > 820) {
        thresholdValue = 865
      }
      const enoughSpace = viewportWidth < (leftElement + thresholdValue + additionalLength);
      modal.style.right = enoughSpace ? '0px' : 'unset';
      modal.style.left = enoughSpace ? 'unset' : '0px';
    }
  }, []);
  return (
    <div
    data-drag="false"
      id="mianFilterModal"
      className={`${styles["main-container"]}`
      }>
      <div  data-drag="false" id="modal" className={`${styles["more-filter-wrapper"]}`}>
        {loader ? (
          <div className={styles["loader-wrapper"]}>
            <Loader className={styles["customLoader-center"]} />
          </div>
        ) : <>
          <div data-drag="false" className={`${indexStyles["popup-header"]}`}>
            <span className={`${indexStyles["main-heading"]}`}>More Filters</span>
            <div  data-drag="false" className={indexStyles.buttons}>
              <img
                className={indexStyles.closeIcon}
                src={Utilities.closeIcon}
                onClick={onClose}
              />
            </div>
          </div>

          <div  data-drag="false" className={`${styles["outer-Box"]}`}>
            <div   data-drag="false" className={styles["outer-wrapper"]}>
              {options.length === 0 ? (
                <p>No Results Found.</p>
              ) : (
                options.map((item, index) => (
                  <div  data-drag="false" className={styles["grid-item"]} key={item.id}>
                    <OptionDataItem
                      name={item.name}
                      count={item.count}
                      isSelected={item.isSelected}
                      onSelect={() => onSelectOption(item)}
                      onDeselect={() => onDeselectOption(item)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div  data-drag="false" className={`${indexStyles["Modal-btn"]}`}>
            <Button className={"apply"} text={"Apply"} onClick={onApply} />
            <Button className={"cancel"} text={"Cancel"} onClick={onCancel} />
          </div>
        </>
        }
      </div>
    </div>
  );
};

export default MoreFiltersOptionPopup;