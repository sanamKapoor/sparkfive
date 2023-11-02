import React from "react";

import { Utilities } from "../../../../assets";
import { IAttribute } from "../../../../interfaces/filters";
import Button from "../../buttons/button";
import indexStyles from "../index.module.css";
import OptionDataItem from "../option-data-item";
import styles from "../options-data.module.css";

interface MoreFiltersOptionPopupProps {
  options: IAttribute[]; //TODO;
  setOptions: (data: unknown) => void;
  setAttributes: (data: unknown) => void;
  setShowModal: (val: boolean) => void;
  loading: boolean;
}

const MoreFiltersOptionPopup: React.FC<MoreFiltersOptionPopupProps> = ({
  options,
  setOptions,
  setAttributes,
  setShowModal,
  loading,
}) => {
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
    setAttributes([...options]);
    setShowModal(false);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <>
      <div className={`${indexStyles["main-container"]}`}>
        <div className={`${indexStyles["outer-wrapper"]}`}>
          <div className={`${indexStyles["popup-header"]}`}>
            <span className={`${indexStyles["main-heading"]}`}>
              More Filters
            </span>
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
            <Button
              className={"apply"}
              text={"Apply"}
              // disabled={loading}
              onClick={onApply}
            />
            <Button
              className={"cancel"}
              text={"Cancel"}
              // disabled={loading}
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreFiltersOptionPopup;
