import Router from "next/router";
import { useContext, useState } from "react";
import { ASSET_ACCESS } from "../../../constants/permissions";
import { AssetContext, UserContext } from "../../../context";
import styles from "./item-subheader.module.css";

// Components
import AssetAddition from "../asset/asset-addition";
import AssetHeaderOps from "../asset/asset-header-ops";
import Button from "../buttons/button";
import SubHeader from "../layouts/sub-header";
import StatusBadge from "../misc/status-badge";
import RenameModal from "../modals/rename-modal";

const ItemSubHeader = ({
  title,
  status = "draft",
  saveDraft = () => {},
  changeName,
  changeStatus,
  hasAssets = false,
  type = "",
  itemId = "",
  resetPageTittle,
}) => {
  const { assets } = useContext(AssetContext);
  const { hasPermission } = useContext(UserContext);
  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);
  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  return (
    <SubHeader
      editable={true}
      pageTitle={title}
      onAltEditionClick={() => setRenameModalOpen(true)}
    >
      <div className={styles["header-additional-wrapper"]}>
        <div className={styles["header-additional"]}>
          {status && <StatusBadge status={status} />}
          {type === "task" && status !== "completed" && (
            <Button
              className={styles["draft-action"]}
              onClick={() => changeStatus("completed")}
              text="Mark as Complete"
            />
          )}
        </div>

        {!activeSearchOverlay && selectedAssets.length > 0 ? (
          <>
            <div className={styles.break}></div>
            <AssetHeaderOps itemType={type} iconColor="White" />
          </>
        ) : (
          <>
            {hasAssets && hasPermission([ASSET_ACCESS]) && (
              <AssetAddition
                folderAdd={false}
                type={type}
                itemId={itemId}
                activeSearchOverlay={activeSearchOverlay}
                setActiveSearchOverlay={setActiveSearchOverlay}
              />
            )}
            <div className={styles.break}></div>
            <Button
              className={styles["draft-action"]}
              onClick={() => Router.replace("/main/overview")}
              text="Cancel"
            />
            {status === "draft" && (
              <Button
                className={styles["draft-action"]}
                onClick={saveDraft}
                text="Save Draft"
              />
            )}
            {status !== "draft" && (
              <Button
                className={styles["draft-action"]}
                onClick={() => changeStatus("draft")}
                text="Change to Draft"
              />
            )}
            {status === "draft" && (
              <Button
                text="Schedule"
                onClick={() => changeStatus("scheduled")}
                type="button"
                className="nav-container"
              />
            )}
            {status !== "draft" && (
              <Button
                text="Save"
                onClick={saveDraft}
                type="button"
                className="nav-container"
              />
            )}
          </>
        )}
      </div>
      <RenameModal
        closeModal={() => setRenameModalOpen(false)}
        modalIsOpen={renameModalOpen}
        renameConfirm={changeName}
        type={type}
        initialValue={title}
      />
    </SubHeader>
  );
};

export default ItemSubHeader;
