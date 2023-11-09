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

import toastUtils from "../../../../utils/toast";

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

  useEffect(() => {
    getMoreFilters();
  }, []);

  const getMoreFilters = async () => {
    try {
      const fetchApi = isPublic ? shareCollectionApi : teamApi;

      const res = await fetchApi.getTeamAttributes({
        ...(sharePath && { sharePath }),
      });
      //check for filter elements to hide
      if (advancedConfig?.hideFilterElements) {
        const filteredAttrs = res.data.data.filter(
          (item) => advancedConfig?.hideFilterElements[item.id] !== false
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
      setAttributes([...selectedAttributes]);
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
    <div className={`${indexStyles["main-container"]}`}>
      <div className={`${indexStyles["outer-wrapper"]}`}>
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
