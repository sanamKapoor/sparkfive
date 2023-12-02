import { format } from "date-fns";
import fileSize from "filesize";
import { useState } from "react";
import { Assets, Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import ConfirmModal from "../modals/confirm-modal";
import AssetIcon from "./asset-icon";
import styles from "./version-list.module.css";

const VersionListItem = ({ current, asset, currentAction, downloadAction, deleteAction }) => {
  const [currentModaOpen, setCurrentModalOpen] = useState(false);
  const [deleteModaOpen, setDeleteModalOpen] = useState(false);

  const { name, realUrl, thumbailUrl, user, createdAt, size, displayVersion } = asset;

  const options = [
    { label: "Make Current", onClick: () => setCurrentModalOpen(true) },
    { label: "Download", onClick: downloadAction },
    { label: "Delete", onClick: () => setDeleteModalOpen(true) },
  ];

  return (
    <li className={styles.item}>
      <h6>{current ? "Current Version" : "V" + (displayVersion - 1)}</h6>
      <div className={styles["item-wrapper"]}>
        <div className={styles.thumbnail}>
          {thumbailUrl && <img src={thumbailUrl || Assets.unknown} alt={name} />}
          {!thumbailUrl && <AssetIcon extension={asset.extension} onList={true} />}
        </div>
        <div className={styles["info-wrapper"]}>
          <div>
            <div className={styles.name}>{name}</div>
            <div className={styles.author}>By: {user?.name}</div>
            <div className={styles.info}>
              {createdAt && format(new Date(createdAt), "MM/dd/yyyy")}
              <span></span>
              {fileSize((size || 0).toString())}
            </div>
          </div>
          {!current && (
            <>
              <ToggleableAbsoluteWrapper
                contentClass={styles["item-actions"]}
                wrapperClass={styles["item-actions-wrapper"]}
                Wrapper={({ children }) => (
                  <>
                    <IconClickable SVGElement={Utilities.moreLight} />
                    {children}
                  </>
                )}
                Content={() => (
                  <div className={styles.more}>
                    <Dropdown options={options} />
                  </div>
                )}
              />

              <ConfirmModal
                closeModal={() => setCurrentModalOpen(false)}
                confirmAction={currentAction}
                confirmText={"Yes"}
                message={
                  <span>
                    Are you sure you want to make this version &nbsp;
                    <b>Current</b>?
                  </span>
                }
                modalIsOpen={currentModaOpen}
              />

              <ConfirmModal
                closeModal={() => setDeleteModalOpen(false)}
                confirmAction={deleteAction}
                confirmText={"Yes"}
                message={<span>Are you sure you want to Delete?</span>}
                modalIsOpen={deleteModaOpen}
              />
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default VersionListItem;
