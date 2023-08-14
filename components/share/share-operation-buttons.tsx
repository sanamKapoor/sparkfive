import styles from "./share-operation-buttons.module.css";

import Button from "../common/buttons/button";

const ShareOperationButtons = ({
  selectAll,
  selectedAsset,
  downloadSelectedAssets,
}: Props) => {
  return (
    <div className={styles.container}>
      <span className={styles["files-shared"]}>
        2 Files Shared - Bossco Supply Inc
      </span>
      <div>
        {selectedAsset > 0 && (
          <Button
            className={`${styles.download} container outlined`}
            text={"Download"}
            type="button"
            onClick={downloadSelectedAssets}
          />
        )}
        <Button
          className={`${styles.deselectAll} container primary`}
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
}

export default ShareOperationButtons;
