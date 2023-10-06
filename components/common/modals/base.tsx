import { MouseEventHandler, useEffect } from 'react';
import ReactModal from 'react-modal';

import { Utilities } from '../../../assets';
import Button from '../buttons/button';
import styles from './base.module.css';

// Components
ReactModal.defaultStyles = {};

interface BaseModalProps {
  modalIsOpen: boolean;
  children?: any;
  closeModal?: (
    event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => void;
  confirmAction?: MouseEventHandler<HTMLButtonElement>;
  confirmText?: string;
  headText?: string;
  subText?: string;
  textWidth?: boolean;
  disabledConfirm?: boolean;
  noHeightMax?: boolean;
  additionalClasses?: string[];
  showCancel?: boolean;
  closeButtonOnly?: boolean;
  overlayAdditionalClass?: string;
}

// Used for the future
const Base: React.FC<BaseModalProps> = ({
  modalIsOpen,
  children,
  closeModal,
  confirmAction = () => { },
  confirmText = "",
  headText = "",
  subText,
  textWidth = false,
  disabledConfirm = false,
  noHeightMax = false,
  additionalClasses = [""],
  showCancel = true,
  closeButtonOnly = false,
  overlayAdditionalClass,
}) => {
  useEffect(() => {
    const cols: any = document.getElementsByTagName("html");
    if (modalIsOpen) {
      for (let i = 0; i < cols.length; i++) {
        cols[i].style.overflow = "hidden";
      }
    } else {
      for (let i = 0; i < cols.length; i++) {
        cols[i].style.overflow = "auto";
      }
    }
  }, [modalIsOpen]);

  return (
    <ReactModal
      isOpen={modalIsOpen}
      className={`${styles.modal} ${noHeightMax && styles["no-height-max"]
        } ${additionalClasses.join(" ")}`}
      overlayClassName={`${styles.overlay} ${overlayAdditionalClass}`}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      shouldFocusAfterRender={false}
      ariaHideApp={false}
    >
      {headText && (
        <div
          className={
            closeButtonOnly
              ? `${styles.header} ${styles["no-border"]}`
              : styles.header
          }
        >
          <div className={styles.baseHeading}>
            <div
              className={`${styles.text} ${closeButtonOnly ? styles["no-border"] : ""
                } ${textWidth && styles["full-width"]}`}
            >

              <p className={styles["overflow-text"]}>
                {!closeButtonOnly ? headText : ""}
              </p>

              <img
                src={Utilities.bigblueClose}
                alt="close"
                className={styles.close}
                onClick={closeModal}
              />
            </div>
            {subText && <p className={styles.subtext}>{subText}</p>}
          </div>

        </div>
      )}
      {children}
      {confirmText && (
        <div
          className={`${styles.buttons} ${!showCancel ? styles["button-center"] : ""
            }`}
        >
          {showCancel && (
            <div>
              <Button
                text="Cancel"
                onClick={closeModal}
                type="button"
                className="container secondary"
              />
            </div>
          )}
          <div>
            <Button
              text={confirmText}
              onClick={confirmAction}
              type="button"
              className="container primary"
              disabled={disabledConfirm}
            />
          </div>
        </div>
      )}
    </ReactModal>
  );
};

export default Base;
