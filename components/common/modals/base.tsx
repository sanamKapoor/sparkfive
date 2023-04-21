import ReactModal from 'react-modal'
import styles from './base.module.css'

import { useEffect } from 'react'

// Components
import Button from '../buttons/button'
import { Utilities } from '../../../assets'

ReactModal.defaultStyles = {}

// Used for the future
const Base = ({
  modalIsOpen,
  children,
  closeModal,
  confirmAction = () => { },
  confirmText = '',
  headText = '',
  subText,
  textWidth = false,
  disabledConfirm = false,
  noHeightMax = false,
  additionalClasses = [''],
  showCancel = true,
  closeButtonOnly = false
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
      className={`${styles.modal} ${noHeightMax && styles['no-height-max']} ${additionalClasses.join(' ')}`}
      overlayClassName={styles.overlay}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      shouldFocusAfterRender={false}
      ariaHideApp={false}
    >
      <div className={styles.header}>
        {(headText || closeButtonOnly) &&
          <div className={`${styles.text} ${closeButtonOnly ? styles['no-border'] : ""} ${textWidth && styles['full-width']}`}>
            {<p className={styles['overflow-text']}>{!closeButtonOnly ? headText : ""}</p>}
            <img src={Utilities.blueClose} alt="close" className={styles.close} onClick={closeModal} />
          </div>
        }
        {subText &&
          <p className={styles.subtext}>{subText}</p>
        }
      </div>
      {children}
      {confirmText &&
        <div className={`${styles.buttons} ${!showCancel ? styles['button-center'] : ''}`}>
          {showCancel && <div>
            <Button
              text='Cancel'
              onClick={closeModal}
              type='button'
              styleType='secondary'
            />
          </div>}
          <div>
            <Button
              text={confirmText}
              onClick={confirmAction}
              type='button'
              styleType='primary'
              disabled={disabledConfirm}
            />
          </div>
        </div>
      }
    </ReactModal>
  )
}

export default Base
