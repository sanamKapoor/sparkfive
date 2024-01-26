import Button from "../buttons/button";
import Base from "./base";
import styles from "./recognition-user-list-modal.module.css";
import editRecognitionUserStyles from "./edit-recognition-user-modal.module.css";
import React, { useContext, useEffect, useState } from "react";
import UserPhoto from "../user/user-photo";

import recognitionApi from "../../../server-api/face-recognition";
import Input from "../inputs/input";

import { LoadingContext } from "../../../context";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  faceList: any[];
}

const RecognitionBulkEditUserListModal: React.FC<ConfirmModalProps> = ({ open, onClose, faceList }) => {
  const { setIsLoading } = useContext(LoadingContext);

  const [updatedFaceList, setUpdatedFaceList] = useState(faceList);

  const onEdit = async () => {
    setIsLoading(true);

    await recognitionApi.updateBulkName(updatedFaceList);

    setIsLoading(false);

    onClose();
  };

  useEffect(() => {
    setUpdatedFaceList(faceList);
  }, [faceList]);

  return (
    <Base
      modalIsOpen={open}
      closeModal={onClose}
      headText={"Name these people"}
      subText={""}
      additionalClasses={[styles["modal-root"]]}
    >
      <div className={editRecognitionUserStyles.container}>
        <ul className={`${styles["user-dropdown"]}`}>
          {updatedFaceList.length === 0 && <div className={"m-t-16"}>No new face found</div>}
          {updatedFaceList.map((face, index) => {
            const { name, count, faceBase64Image } = face;
            return (
              <li className={`${styles["user-item"]}`} onClick={() => {}}>
                <div className={styles["user-row"]}>
                  {/*<img src={""} alt={"avatar"} />*/}
                  <UserPhoto photoUrl={faceBase64Image || ""} sizePx={40} />

                  <Input
                    type="email"
                    styleType={"regular"}
                    value={name}
                    additionalClasses={`m-l-8 ${styles.input}`}
                    placeholder="Name"
                    onChange={(e) => {
                      const currentList = [...updatedFaceList];
                      currentList[index].name = e.target.value;
                      setUpdatedFaceList(currentList);
                    }}
                  />

                  {/*<div className={"m-l-8 m-r-8"}>{name}</div>*/}
                  <div className={styles["img-input-text"]}>{count || 0} Image(s)</div>
                </div>

                {/*<IconClickable*/}
                {/*  SVGElement={Utilities.editBorder}*/}
                {/*  additionalClass={styles["select-icon"]}*/}
                {/*  onClick={() => {*/}
                {/*    setCurrentEditUser(face);*/}
                {/*  }}*/}
                {/*/>*/}
              </li>
            );
          })}
        </ul>
      </div>

      {updatedFaceList.length > 0 && (
        <div className={editRecognitionUserStyles.buttons}>
          <div className={"w-100 m-r-10"}>
            <Button
              text="Cancel"
              onClick={() => {
                onClose();
              }}
              type="button"
              className="container secondary"
            />
          </div>
          <div className={"w-100"}>
            <Button text={"Save"} onClick={onEdit} type="button" className="container primary" />
          </div>
        </div>
      )}
    </Base>
  );
};

export default RecognitionBulkEditUserListModal;
