import Button from "../buttons/button";
import Base from "./base";
import styles from "./recognition-user-list-modal.module.css";
import editRecognitionUserStyles from "./edit-recognition-user-modal.module.css";
import IconClickable from "../buttons/icon-clickable";
import { Utilities } from "../../../assets";
import React, { useContext, useEffect, useState } from "react";
import UserPhoto from "../user/user-photo";

import recognitionApi from "../../../server-api/face-recognition";
import Spinner from "../spinners/spinner";
import Input from "../inputs/input";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  faceList: any[];
}

const RecognitionBulkEditUserListModal: React.FC<ConfirmModalProps> = ({ open, onClose, faceList }) => {
  // const { setIsLoading } = useContext(LoadingContext);

  const [currentEditUser, setCurrentEditUser] = useState<any>();
  const [loading, setIsLoading] = useState(false);

  const onEdit = async (name: string) => {
    setIsLoading(true);

    await recognitionApi.updateName(currentEditUser.id, { name });
  };

  return (
    <Base
      modalIsOpen={open}
      closeModal={onClose}
      headText={"Name these people"}
      subText={""}
      additionalClasses={[styles["modal-root"]]}
    >
      <div className={editRecognitionUserStyles.container}>
        {loading && (
          <div className={"text-center"}>
            <Spinner />
          </div>
        )}
        {!loading && (
          <ul className={`${styles["user-dropdown"]}`}>
            {faceList.map((face, index) => {
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
                      additionalClasses={`m-l-8 m-r-8 ${editRecognitionUserStyles.input}`}
                      placeholder="Name"
                      onChange={(e) => {
                        // setInputName(e.target.value);
                      }}
                    />

                    {/*<div className={"m-l-8 m-r-8"}>{name}</div>*/}
                    {/*<div className={styles["img-text"]}>{count} Image(s)</div>*/}
                  </div>

                  <IconClickable
                    SVGElement={Utilities.editBorder}
                    additionalClass={styles["select-icon"]}
                    onClick={() => {
                      setCurrentEditUser(face);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Base>
  );
};

export default RecognitionBulkEditUserListModal;
