import Button from "../buttons/button";
import Base from "./base";
import styles from "./confirm-modal.module.css";
import editRecognitionUserStyles from "./edit-recognition-user-modal.module.css";
import IconClickable from "../buttons/icon-clickable";
import { Utilities } from "../../../assets";
import React, { useEffect, useState } from "react";
import Input from "../inputs/input";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (inputName: string) => void;
  user: any;
}

const EditRecognitionUserModal: React.FC<ConfirmModalProps> = ({ open, onClose, onSave, user = {} }) => {
  const { name, faceBase64Image } = user;

  const [inputName, setInputName] = useState(name || "Unnamed");

  useEffect(() => {
    setInputName(user.name || "Unnamed");
  }, [user]);
  return (
    <Base modalIsOpen={open} closeModal={onClose} headText={"Name this Person"} subText={""}>
      <div className={`${editRecognitionUserStyles.container} ${editRecognitionUserStyles.row}`}>
        <div className={editRecognitionUserStyles.avatar}>
          <img src={faceBase64Image || ""} alt={"avatar"} />
        </div>
        <Input
          type="email"
          styleType={"regular"}
          value={inputName}
          additionalClasses={editRecognitionUserStyles.input}
          placeholder="Name"
          onChange={(e) => {
            setInputName(e.target.value);
          }}
        />
      </div>

      <div className={editRecognitionUserStyles.buttons}>
        <div className={"w-100 m-r-10"}>
          <Button
            text="Cancel"
            onClick={() => {
              setInputName(name || "");
              onClose();
            }}
            type="button"
            className="container secondary"
          />
        </div>
        <div className={"w-100"}>
          <Button
            text={"Save"}
            onClick={() => {
              onSave(inputName);
            }}
            type="button"
            className="container primary"
          />
        </div>
      </div>
    </Base>
  );
};

export default EditRecognitionUserModal;
