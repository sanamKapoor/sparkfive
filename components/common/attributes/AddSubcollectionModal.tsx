import React, { useState } from 'react';

import { Utilities } from '../../../assets';
import folderApi from '../../../server-api/folder';
import FolderModal from '../../common/folder/folder-modal';
import styles from '../../nested-subcollection-sidenav/button.module.css';
import toastUtils from "../../../utils/toast";
import IconClickable from '../../common/buttons/icon-clickable';

interface MyComponentProps {
    type: string
    parentId?: string
    updateFolders?: (id?: string, page?: number, replace?: boolean) => Promise<void>
    iconSrc?: string;
    textColor?: string;
    text?: string;
}

const NestedButton: React.FC<MyComponentProps> = ({ type, parentId, updateFolders, iconSrc = Utilities.addCollection, textColor, text }) => {
    const [activeModal, setActiveModal] = useState("");
    const [disableButtons, setDisableButtons] = useState(false)


    const onSubmit = async (folderData: { name: string, parent_id?: string }) => {
        setDisableButtons(true)
        try {
            if (type === "subCollection") {
                folderData.parent_id = parentId
            }
            await folderApi.createFolder(folderData);
            if (type === "subCollection") {
                updateFolders(parentId, 1, true)
            } else {
                updateFolders()
            }
            setActiveModal("");
            setDisableButtons(false)
            toastUtils.success("Collection created successfully");
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
                <button className={styles.nestedButton} style={{ color: textColor }}>
                    <IconClickable onClick={() => setActiveModal("folder")} additionalClass={styles.addIcon} src={iconSrc} />
                    {text && <span>{text}</span>}
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
