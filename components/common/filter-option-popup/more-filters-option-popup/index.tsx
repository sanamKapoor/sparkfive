import React, { useContext, useEffect, useState } from "react";
import { Utilities } from "../../../../assets";
import { IAttribute } from "../../../../interfaces/filters";
import Button from "../../buttons/button";
import indexStyles from "../index.module.css";
import OptionDataItem from "../option-data-item";
import styles from "../options-data.module.css";

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

  useEffect(() => {
    getMoreFilters();
  }, [/* Dependencies */]);

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
        filterModalPosition();
        return true;
      } else {
        // Update this part based on your component's structure and data
        if (options) {
          filterModalPosition();
          return options instanceof Array
            ? options.length > 0
            : Object.keys(options).length > 0;
        }
      }
    }
    return false;
  };

  const filterModalPosition = () => {
    const mianFilterModal = document.getElementById('mianFilterModal');
    const modal = document.getElementById('modal');

    if (mianFilterModal && modal) {
      const viewportWidth = window.innerWidth;
      const modalWidth = modal.offsetWidth;
      const leftelemnt = mianFilterModal.offsetLeft;
      const additionlalength = sidebarOpen ? 378 : 0;

      console.log("viewportWidth:", viewportWidth);
      console.log("modalWidth:", modalWidth);
      console.log("leftelemnt:", leftelemnt);

      // Calculate the available space on the right
      const availableSpaceRight = viewportWidth - leftelemnt - mianFilterModal.offsetWidth;

      if (modalWidth + additionlalength > availableSpaceRight) {
        // If there is not enough space on the right, position the modal on the left
        modal.style.right = 'unset';
        modal.style.left = '0';
      } else {
        // Otherwise, position the modal on the right
        modal.style.left = 'unset';
        modal.style.right = '0';
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

  return (
    <div
      id="mianFilterModal"
      className={`${styles["main-container"]}`
      }>
      <div id="modal" className={`${styles["more-filter-wrapper"]}`}>
        <div className={`${indexStyles["popup-header"]}`}>
          <span className={`${indexStyles["main-heading"]}`}>More Filters</span>
          <div className={indexStyles.buttons}>
            <img
              className={indexStyles.closeIcon}
              src={Utilities.closeIcon}
              onClick={onClose}
            />
          </div>
        </div>

        <div className={`${styles["outer-Box"]}`}>
          <div className={styles["outer-wrapper"]}>
            {options.length === 0 ? (
              <p>No Results Found.</p>
            ) : (
              options.map((item, index) => (
                <div className={styles["grid-item"]} key={item.id}>
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

        <div className={`${indexStyles["Modal-btn"]}`}>
          <Button className={"apply"} text={"Apply"} onClick={onApply} />
          <Button className={"cancel"} text={"Cancel"} onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default MoreFiltersOptionPopup;