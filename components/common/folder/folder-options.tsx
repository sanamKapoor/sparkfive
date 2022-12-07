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
  assetsData = [],
  thumbnails = null,
  activeView,
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
    let opts = adminOption;
    if (
      userDetails &&
      (userDetails.roleId == "admin" || userDetails.roleId == "super_admin")
    ) {
      if (
        opts.filter((ele) => ele.label == "Change Thumbnail").length == 0
      ) {
        setAdminOption([
          ...opts,
          {
            label: "Change Thumbnail",
            onClick: changeThumbnail,
          },
        ]);
        opts = [
          ...opts,
          {
            label: "Change Thumbnail",
            onClick: changeThumbnail,
          },
        ];
      }
      setTimeout(() => {
        if (thumbnailPath) {
          if (
            opts.filter((ele) => ele.label == "Delete Thumbnail")
              .length == 0
          ) {
            setAdminOption([
              ...opts,
              {
                label: "Delete Thumbnail",
                onClick: deleteThumbnail,
              },
            ]);
            opts = [
              ...opts,
              {
                label: "Delete Thumbnail",
                onClick: deleteThumbnail,
              },
            ];
          }
        } else {
          if (
            opts.filter((ele) => ele.label == "Delete Thumbnail")
              .length > 0
          ) {
            setAdminOption([
              ...opts.filter((ele) => ele.label !== "Delete Thumbnail"),
            ]);
            opts = [
              ...opts.filter((ele) => ele.label !== "Delete Thumbnail")
            ];
          }
        }
      });
    }

    // if (thumbnailPath == null) {
    //   if (
    //     adminOption.filter(
    //       (ele) =>
    //         ele.label == "Change Thumbnail" || ele.label == "Add Thumbnail"
    //     ).length == 0
    //   ) {
    //     setAdminOption([
    //       ...adminOption,
    //       {
    //         label: "Add Thumbnail",
    //         onClick: changeThumbnail,
    //       },
    //     ]);
    //   } else {
    //     setAdminOption([
    //       ...adminOption.map((ele) => {
    //         if (ele.label == "Add Thumbnail") {
    //           return {
    //             label: "Add Thumbnail",
    //             onClick: changeThumbnail,
    //           };
    //         } else {
    //           return ele;
    //         }
    //       }),
    //     ]);
    //   }
    // }
    if (copyEnabled && !isShare) {
      if (
          adminOption.filter(
              (ele) =>
                  ele.label == "Copy Link"
          ).length == 0
      ) {
        setAdminOption([
          ...adminOption,
          { label: "Copy Link", onClick: copyShareLink },
        ]);
      }
    }
  }, [user, thumbnailPath, downloadFoldercontents, copyShareLink]);

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
