import styles from "./confirm-modal.module.css";

// Components
import Button from "../buttons/button";
import Base from "./base";

// Used for the future
const ConfirmModal = ({
  modalIsOpen,
  closeModal,
  message,
  secondMessage = "",
  confirmText,
  headText,
  subText,
  confirmAction,
  textContentClass = "",
  closeButtonClass = "",
}) => (
  <Base
    modalIsOpen={modalIsOpen}
    closeModal={closeModal}
    headText={message}
    subText={subText}
  >
    {secondMessage && (
      <div className={`${styles.text} ${textContentClass}`}>
        <p>{secondMessage}</p>
      </div>
    )}
    <div className={styles.buttons}>
      <div>
        <Button
          text="Cancel"
          onClick={closeModal}
          type="button"
          styleType="secondary"
        />
      </div>
      <div>
        <Button
          text={confirmText}
          onClick={confirmAction}
          type="button"
          styleType="primary"
        />
      </div>
    </div>
  </Base>
);

export default ConfirmModal;
