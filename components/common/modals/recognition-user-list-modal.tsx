import Button from "../buttons/button";
import Base from "./base";
import styles from "./recognition-user-list-modal.module.css";
import editRecognitionUserStyles from "./edit-recognition-user-modal.module.css";
import IconClickable from "../buttons/icon-clickable";
import { Utilities } from "../../../assets";
import React, { useContext, useEffect, useState } from "react";
import UserPhoto from "../user/user-photo";
import EditRecognitionUserModal from "./edit-recognition-user-modal";

import recognitionApi from "../../../server-api/face-recognition";
import { LoadingContext } from "../../../context";
import faceRecognitionApi from "../../../server-api/face-recognition";
import superAdminApi from "../../../server-api/super-admin";
import Spinner from "../spinners/spinner";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
}

const RecognitionUserListModal: React.FC<ConfirmModalProps> = ({ open, onClose, teamId }) => {
  // const { setIsLoading } = useContext(LoadingContext);

  const [currentEditUser, setCurrentEditUser] = useState<any>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [faceList, setFaceList] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const fetchFaceList = async () => {
    const { data } = await superAdminApi.getFaceList(teamId);
    return data.data;
  };

  const refreshFaceList = async () => {
    // Show loading
    setIsLoading(true);

    // Get then set face list data
    const faceData = await fetchFaceList();
    setFaceList(faceData);

    // Hide loading
    setIsLoading(false);
    return true;
  };

  const onEdit = async (name: string) => {
    setShowEditModal(false);

    setIsLoading(true);

    await recognitionApi.updateName(currentEditUser.id, { name });
    await refreshFaceList();
  };

  useEffect(() => {
    if (open) {
      refreshFaceList();
    }
  }, [open]);

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
                    <UserPhoto photoUrl={faceBase64Image || ""} sizePx={28} />

                    <div className={"m-l-8 m-r-8"}>{name}</div>
                    <div className={styles["img-text"]}>{count} Image(s)</div>
                  </div>

                  <IconClickable
                    SVGElement={Utilities.editBorder}
                    additionalClass={styles["select-icon"]}
                    onClick={() => {
                      setCurrentEditUser(face);
                      setShowEditModal(true);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <EditRecognitionUserModal
        open={showEditModal}
        onSave={(data) => {
          onEdit(data);
        }}
        onClose={() => {
          setShowEditModal(false);
        }}
        user={currentEditUser}
      />
    </Base>
  );
};

export default RecognitionUserListModal;
