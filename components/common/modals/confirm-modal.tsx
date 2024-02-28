import Button from "../buttons/button";
import Base from "./base";
import styles from "./confirm-modal.module.css";

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
}) => (
  <Base
    modalIsOpen={modalIsOpen}
    closeModal={closeModal}
    headText={message}
    subText={subText}
    additionalClasses={["confirm"]}
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
          className="container secondary confirm"
        />
      </div>
      <div>
        <Button
          text={confirmText}
          onClick={confirmAction}
          type="button"
          className="container primary confirm"
        />
      </div>
    </div>
  </Base>
);

export default ConfirmModal;
