import styles from "./folder-options.module.css";
import { Utilities } from "../../../assets";

// Components
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import { UserContext } from "../../../context";
import { useContext, useEffect, useState } from "react";

const FolderOptions = ({
  downloadFoldercontents,
  setDeleteOpen,
  shareAssets,
  copyShareLink,
  copyEnabled,
  changeThumbnail,
  deleteThumbnail,
  isShare = false,
  thumbnailPath,
}) => {
  const { user } = useContext(UserContext);
  const options = isShare
    ? [{ label: "Download", onClick: downloadFoldercontents }]
    : [
        { label: "Download", onClick: downloadFoldercontents },
        { label: "Delete", onClick: () => setDeleteOpen(true) },
        { label: "Share", onClick: shareAssets },
      ];
  const [adminOption, setAdminOption] = useState(options);

  useEffect(() => {
    let userDetails: any = user;
    if (thumbnailPath) {
      if (
        adminOption.filter((ele) => ele.label == "Delete Thumbnail").length == 0
      ) {
        setAdminOption([
          ...adminOption,
          {
            label: "Delete Thumbnail",
            onClick: deleteThumbnail,
          },
        ]);
      }
    }
    if (userDetails && userDetails.roleId == "admin") {
      if (
        adminOption.filter((ele) => ele.label == "Change Thumbnail").length == 0
      ) {
        setAdminOption([
          ...adminOption,
          {
            label: "Change Thumbnail",
            onClick: changeThumbnail,
          },
        ]);
      }
    }
  }, [user, thumbnailPath]);

  if (copyEnabled && !isShare) {
    setAdminOption([
      ...adminOption,
      { label: "Copy Link", onClick: copyShareLink },
    ]);
  }

  return (
    <ToggleableAbsoluteWrapper
      contentClass={styles["asset-actions"]}
      wrapperClass={styles["asset-actions-wrapper"]}
      Wrapper={({ children }) => (
        <>
          <IconClickable src={Utilities.moreLight} />
          {children}
        </>
      )}
      Content={() => (
        <div className={styles.more}>
          {adminOption.length > 0 && <Dropdown options={adminOption} />}
        </div>
      )}
    />
  );
};

export default FolderOptions;
