import React, { ReactNode, useContext, useState } from 'react';

import { Utilities } from '../../assets';
import { AssetContext } from '../../context';
import folderApi from '../../server-api/folder';
import FolderModal from '../common/folder/folder-modal';
import styles from './button.module.css';
import toastUtils from "../../utils/toast";
import IconClickable from '../common/buttons/icon-clickable';

interface MyComponentProps {
  type: string
  parentId?: string
}

const NestedButton: React.FC<MyComponentProps> = ({ type, parentId }) => {
  const [activeModal, setActiveModal] = useState("");
  const [disableButtons, setDisableButtons] = useState(false)
  const {
    folders,
    setFolders,
    sidenavFolderList,
    setSidenavFolderList,
    setSidenavFolderChildList,
    sidenavFolderChildList,
    activeSubFolders,
    appendNewSubSidenavFolders,
    setSubFoldersViewList,
    subFoldersViewList,
    setListUpdateFlag
  } = useContext(AssetContext);

  const onSubmit = async (folderData: { name: string, parent_id?: string }) => {
    setDisableButtons(true)
    try {
      if (type === "subCollection") {
        folderData.parent_id = parentId
      }
      const { data } = await folderApi.createFolder(folderData);
      setActiveModal("");
      (type !== "subCollection") && setFolders([data, ...folders]); //Todo handle the addition of folders in subcollection here
      (type !== "subCollection") && setSidenavFolderList({ results: [data, ...sidenavFolderList] });
      (type === "subCollection") && appendNewSubSidenavFolders([data], parentId, false, "");
      (type === "subCollection" && parentId === activeSubFolders) &&
        setSubFoldersViewList({
          ...subFoldersViewList,
          total: subFoldersViewList.total + 1,
          results: [data, ...subFoldersViewList.results],
        });
      setListUpdateFlag(true);
      setDisableButtons(false)
      if (parentId) {
        toastUtils.success("Subcollection created successfully");
      } else {
        toastUtils.success("Collection created successfully");
      }
    } catch (err: any) {
      setDisableButtons(false);
      setActiveModal("");
      toastUtils.error(err?.response?.data ||
        "Something went wrong, please try again later");
    }
  }

  return (
    <>
      <div className={styles.addBlock} onClick={() => setActiveModal("folder")}>
        <button className={styles.nestedButton}>
          {/* <img src={Utilities.add} alt="Add Icon" onClick={() => setActiveModal("folder")} /> */}
          {/* <span>{children}</span> */}
          <IconClickable onClick={() => setActiveModal("folder")} additionalClass={styles.addIcon} src={Utilities.addCollection} />
        </button>
      </div>
      <FolderModal
        modalIsOpen={activeModal === "folder"}
        closeModal={() => setActiveModal("")}
        onSubmit={onSubmit}
        disableButtons={disableButtons}
        addSubCollection={type === "subCollection" ? true : false}
      />
    </>

  );
};

export default NestedButton;
