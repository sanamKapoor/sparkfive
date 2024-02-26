import { useEffect, useState } from "react";
import styles from "./rename-modal.module.css";

// Components
import Input from "../../common/inputs/input";
import Base from "../../common/modals/base";

const RenameModal = ({
  modalIsOpen,
  closeModal,
  type,
  renameConfirm,
  initialValue = "",
}) => {
  const [renameInput, setRenameInput] = useState("");

  useEffect(() => {
    if (initialValue) {
      setRenameInput(initialValue);
    }
  }, [modalIsOpen, initialValue]);

  return (
    <Base
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      confirmText={"Rename"}
      headText={`Rename ${type}`}
      disabledConfirm={!renameInput}
      confirmAction={() => {
        renameConfirm(renameInput);
        closeModal();
      }}
    >
      <div className={styles["input-wrapper"]}>
        <Input
          placeholder={"Enter name"}
          onChange={(e) => setRenameInput(e.target.value)}
          value={renameInput}
          styleType={"regular-short"}
        />
      </div>
    </Base>
  );
};

export default RenameModal;
