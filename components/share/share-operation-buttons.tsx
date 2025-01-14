import styles from "./share-operation-buttons.module.css";

import Button from "../common/buttons/button";

const ShareOperationButtons = ({
  sharedBy,
  selectAll,
  selectedAsset,
  downloadSelectedAssets,
  totalSharedFiles,
}: Props) => {
  return (
    <div className={styles.container}>
      <span className={styles["files-shared"]}>
        {totalSharedFiles} Files Shared - {sharedBy}
      </span>
      <div className={styles["share-buttons"]}>
        {selectedAsset > 0 && (
          <Button
            className={`container outlined ${styles.download}`}
            text={"Download"}
            type="button"
            onClick={downloadSelectedAssets}
          />
        )}
        <Button
          className={`container primary ${styles.deselectAll}`}
          text={
            selectedAsset ? `Deselect All (${selectedAsset})` : `Select All`
          }
          type="button"
          onClick={selectAll}
        />
      </div>
    </div>
  );
};

interface Props {
  downloadSelectedAssets: () => void;
  selectAll: () => void;
  selectedAsset: number;
  totalSharedFiles: number;
  sharedBy: string;
}

export default ShareOperationButtons;
