// External
import React, { useContext, useState } from "react";
import styles from "./detail-side-panel.module.css";
import { Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import recognitionStyles from "./recognition-user.module.css";

import EditRecognitionUserModal from "../modals/edit-recognition-user-modal";

import recognitionApi from "../../../server-api/face-recognition";

import { LoadingContext, FilterContext } from "../../../context";

const RecognitionUser = ({ user = {}, onApplyFilter }: Props) => {
  const { setIsLoading } = useContext(LoadingContext);
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const [userData, setUser] = useState(user || {});
  const { faceBase64Image, name, id } = userData;
  const [showEditModal, setShowEditModal] = useState(false);

  const onEdit = async (name: string) => {
    setIsLoading(true);

    const { data } = await recognitionApi.updateName(user.id, { name });
    setUser({ ...user, name });

    setIsLoading(false);
    setShowEditModal(false);
  };

  const onApplyAssetFilter = () => {
    // Asset already available to tag
    if (name !== "Unnamed") {
      setActiveSortFilter({ ...activeSortFilter, filterFaceRecognitions: [userData] });

      onApplyFilter();
    }
  };

  return (
    <>
      <div className={styles["field-wrapper"]}>
        <div className={`secondary-text ${styles.field}`}>Person</div>
        <div className={`normal-text ${styles["meta-text"]}`}>
          <div className={recognitionStyles.container}>
            <img
              className={recognitionStyles.avatar}
              src={faceBase64Image || ""}
              alt={"avatar"}
              onClick={onApplyAssetFilter}
            />
            <div className={name !== "Unnamed" ? "underline-text cursor-pointer" : ""} onClick={onApplyAssetFilter}>
              {name}
            </div>
            <IconClickable
              SVGElement={Utilities.editBorder}
              onClick={() => {
                setShowEditModal(true);
              }}
              additionalClass={recognitionStyles.icon}
            />
          </div>
        </div>
      </div>

      <EditRecognitionUserModal
        open={showEditModal}
        onSave={(data) => {
          onEdit(data);
        }}
        onClose={() => {
          setShowEditModal(false);
        }}
        user={userData}
      />
    </>
  );
};

interface Props {
  user: any;
  onApplyFilter: () => void;
}

export default RecognitionUser;
