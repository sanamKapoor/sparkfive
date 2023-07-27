import styles from "./edit-grid.module.css";
// Components
import EditItem from "./edit-item";

const EditGrid = ({ assets, toggleSelectedEdit }) => {
  return (
    <>
      <div className={styles["list-wrapper"]}>
        <ul className={`${styles["grid-list"]}`}>
          {assets.map(
            ({ asset, thumbailUrl, realUrl, isEditSelected }, index) => (
              <EditItem
                assets={assets}
                index={index}
                asset={asset}
                thumbailUrl={thumbailUrl}
                realUrl={realUrl}
                isEditSelected={isEditSelected}
                toggleSelectedEdit={toggleSelectedEdit}
                totalLength={assets?.length}
              />
            )
          )}
        </ul>
      </div>
    </>
  );
};

export default EditGrid;
