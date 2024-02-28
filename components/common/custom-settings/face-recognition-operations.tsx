import styles from "./face-recognition-operations.module.css";
import { Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import RecognitionCollectionModal from "../modals/recognition-collection-modal";
import RecognitionUserListModal from "../modals/recognition-user-list-modal";
import RecognitionBulkEditUserListModal from "../modals/recognition-bulk-edit-user-list-modal";
import React, { useContext, useState } from "react";
import recognitionApi from "../../../server-api/face-recognition";
import superAdminApi from "../../../server-api/super-admin";
import { AssetContext } from "../../../context";

export default function FaceRecognitionOperations({ teamId, fullPermission = true, customLabel }: Props) {
  const { setFaceRecognitionScanning } = useContext(AssetContext);

  const [showRecognitionCollection, setShowRecognitionCollection] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showBulkEditListModal, setShowBulkEditListModal] = useState(false);
  const [faceBulkEditList, setFaceBulkEditList] = useState([]);

  const onRunEntireAccount = async () => {
    setFaceRecognitionScanning(true);
    const { data } = await superAdminApi.bulkFaceRecognitionAll(teamId);

    // Set response data
    setFaceBulkEditList(data?.unnameFace || []);

    // Show bulk edit list
    setShowBulkEditListModal(true);

    setFaceRecognitionScanning(false);
  };

  const onRunSpecificCollection = () => {
    setShowRecognitionCollection(true);
  };

  return (
    <div className={styles.container}>
      {customLabel ? customLabel : <span className={`${styles.label} m-r-8 font-weight-600`}>Facial recognition</span>}
      {fullPermission && (
        <ToggleableAbsoluteWrapper
          wrapperClass={styles["dropdown-wrapper"]}
          Wrapper={({ children }) => (
            <div className={"m-r-8 cursor-pointer d-flex align-items-center"}>
              <IconClickable SVGElement={Utilities.run} additionalClass={styles["select-icon"]} onClick={() => {}} />
              {children}
            </div>
          )}
          contentClass={styles["dropdown"]}
          Content={() => (
            <ul className={styles["dropdown-list"]}>
              <li className={`${styles["operation-row"]} ${styles["first-item"]}`} onClick={onRunEntireAccount}>
                <IconClickable SVGElement={Utilities.run} additionalClass={styles["select-icon"]} />{" "}
                <div className={"m-l-8"}>Run recognition on the entire account.</div>
              </li>
              <li className={styles["operation-row"]} onClick={onRunSpecificCollection}>
                <IconClickable SVGElement={Utilities.run} additionalClass={styles["select-icon"]} />
                <div className={"m-l-8"}>Run recognition in a specific collection(s)</div>
              </li>
            </ul>
          )}
        />
      )}

      {!fullPermission && (
        <div
          className={"m-r-8 cursor-pointer d-flex align-items-center"}
          onClick={() => {
            setShowUserList(true);
          }}
        >
          <IconClickable SVGElement={Utilities.eye} additionalClass={styles["select-icon"]} />
        </div>
      )}

      {fullPermission && (
        <RecognitionCollectionModal
          open={showRecognitionCollection}
          onClose={() => {
            setShowRecognitionCollection(false);
          }}
          onFinish={(data) => {
            // Set response data
            setFaceBulkEditList(data);

            // Show bulk edit list
            setShowBulkEditListModal(true);
          }}
          teamId={teamId}
        />
      )}

      <RecognitionUserListModal
        open={showUserList}
        onClose={() => {
          setShowUserList(false);
        }}
        teamId={null}
      />

      <RecognitionBulkEditUserListModal
        faceList={faceBulkEditList}
        open={showBulkEditListModal}
        onClose={() => {
          setShowBulkEditListModal(false);
        }}
      />
    </div>
  );
}

interface Props {
  teamId: string;
  fullPermission?: boolean;
  customLabel?: any;
}
