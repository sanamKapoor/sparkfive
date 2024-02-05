import Button from "../buttons/button";
import Base from "./base";
import styles from "./recognition-collection-modal.module.css";
import editRecognitionUserStyles from "./edit-recognition-user-modal.module.css";
import IconClickable from "../buttons/icon-clickable";
import { Utilities } from "../../../assets";
import React, { useContext, useEffect, useState } from "react";
import Search from "../../main/user-settings/SuperAdmin/Search/Search";
import folderApi from "../../../server-api/folder";
import recognitionApi from "../../../server-api/face-recognition";
import { AssetContext } from "../../../context";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onFinish: (data: any) => void;
}

const RecognitionCollectionModal: React.FC<ConfirmModalProps> = ({ open, onClose, onFinish }) => {
  const { setFaceRecognitionScanning } = useContext(AssetContext);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const [folders, setFolders] = useState([]);
  const [originalFolders, setOriginalFolders] = useState([]);

  const fetchCollection = async () => {
    try {
      const { data } = await folderApi.getFoldersSimple();
      setFolders(data);
      setOriginalFolders(data);
    } catch (err) {}
  };

  const onSelectCollection = (id: string) => {
    if (selectedCollection.includes(id)) {
      setSelectedCollection(selectedCollection.filter((item) => item !== id));
    } else {
      setSelectedCollection([...selectedCollection, id]);
    }
  };

  const onRunRecognition = async () => {
    setFaceRecognitionScanning(true);
    const { data } = await recognitionApi.bulkRecognitionInCollection({ ids: selectedCollection });
    onFinish(data?.unnameFace || []);
    setFaceRecognitionScanning(false);
  };

  const onSearchCollection = (searchKey: string) => {
    // Still on search
    if (searchKey) {
      setFolders(
        folders.filter(
          (folder) =>
            folder.name.toLowerCase().includes(searchKey.toLowerCase()) ||
            searchKey.toLowerCase().includes(folder.name.toLowerCase()),
        ),
      );
    } else {
      // Reset , get all
      setFolders(originalFolders);
    }
  };

  const handleClose = () => {
    setSelectedCollection([]);
    onClose();
  };

  useEffect(() => {
    fetchCollection();
  }, []);
  return (
    <Base
      modalIsOpen={open}
      closeModal={handleClose}
      headText={"Facial recognition"}
      subText={"Select the desired collection(s) and run face recognition"}
      additionalClasses={[styles["modal-root"]]}
    >
      <div className={styles.container}>
        <div className={"m-b-16"}>
          <Search onSubmit={onSearchCollection} placeholder={"Search collection"} />
        </div>

        <div className={"font-weight-600 m-b-16"}>Collection ({folders.length})</div>

        {folders.map(({ id, name, childFolders, childOpen = false }, index) => {
          return (
            <div key={index}>
              <div className={`${styles["option-item"]} m-b-16`}>
                {childFolders.length > 0 && (
                  <img
                    className={childOpen ? styles["folder-right-icon"] : styles["folder-normal-icon"]}
                    src={Utilities.caretRightSolid}
                    alt={"icon"}
                    onClick={() => {
                      const currentFolders = [...folders];
                      currentFolders[index].childOpen = !(currentFolders[index].childOpen || false);

                      setFolders(currentFolders);
                    }}
                  />
                )}
                <IconClickable
                  src={selectedCollection.includes(id) ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                  additionalClass={childFolders.length === 0 ? styles["folder-without-sub"] : ""}
                  onClick={() => {
                    onSelectCollection(id);
                  }}
                />
                <div className={"m-l-5"}>{name}</div>
              </div>
              {childOpen &&
                childFolders.map((child: any, index: number) => {
                  return (
                    <div className={`${styles["option-item"]} m-l-30 m-b-16`} key={index}>
                      <IconClickable
                        src={
                          selectedCollection.includes(id) ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal
                        }
                        additionalClass={styles["select-icon"]}
                        onClick={() => {
                          onSelectCollection(id);
                        }}
                      />
                      <div className={"m-l-5"}>{child.name}</div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      <div className={editRecognitionUserStyles.buttons}>
        <div className={"w-100  m-r-10"}>
          <Button
            text={"Run Face Recognition"}
            onClick={onRunRecognition}
            type="button"
            className="container primary"
          />
        </div>
        <div className={"w-100"}>
          <Button
            text="Cancel"
            onClick={() => {
              handleClose();
            }}
            type="button"
            className="container secondary"
          />
        </div>
      </div>
    </Base>
  );
};

export default RecognitionCollectionModal;
