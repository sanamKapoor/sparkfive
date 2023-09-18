import React, { ReactNode, useContext, useState } from 'react';

import { Utilities } from '../../assets';
import { AssetContext } from '../../context';
import folderApi from '../../server-api/folder';
import FolderModal from '../common/folder/folder-modal';
import styles from './button.module.css';
import toastUtils from "../../utils/toast";

interface MyComponentProps {
  children: ReactNode;
  type: string
  parentId?: string
}

const NestedButton: React.FC<MyComponentProps> = ({ children, type, parentId }) => {
  const [activeModal, setActiveModal] = useState("");
  const [disableButtons, setDisableButtons] = useState(false)
  const {
    folders,
    setFolders,
    sidenavFolderList,
    setSidenavFolderList
  } = useContext(AssetContext);

  const onSubmit = async (folderData: { name: string, parent_id?: string }) => {
    setDisableButtons(true)
    try {
      if (type === "subCollection") {
        folderData.parent_id = parentId
      }
      const { data } = await folderApi.createFolder(folderData);
      setActiveModal("");
      // setFolders([data, ...folders]); //Todo handle the additiob of folders in subcollection here
      // setSidenavFolderList({ results: [data, ...sidenavFolderList] })
      setDisableButtons(false)
      toastUtils.success("Collection created successfully");
    } catch (err: any) {
      setDisableButtons(false);
      toastUtils.error(err?.response?.data?.message ||
        "Something went wrong, please try again later");
    }
  }

  return (
    <>
      <div>
        <button className={styles.nestedButton}>
          <img src={Utilities.add} alt="Add Icon" onClick={() => setActiveModal("folder")} />
          <span>{children}</span>
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
