import styles from "./confirm-modal.module.css";

// Components
import Button from "../buttons/button";
import Base from "./base";

interface ConfirmModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  message?: React.ReactNode;
  secondMessage?: string;
  confirmText: string;
  subText?: string;
  confirmAction: () => void;
  textContentClass?: string;
  closeButtonClass?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  modalIsOpen,
  closeModal,
  message,
  secondMessage = "",
  confirmText,
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
          className="container secondary"
        />
      </div>
      <div>
        <Button
          text={confirmText}
          onClick={confirmAction}
          type="button"
          className="container primary"
        />
      </div>
    </div>
  </Base>
);

export default ConfirmModal;
