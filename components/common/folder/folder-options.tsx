//TODO: refactor this file

import { Utilities } from "../../../assets";
import styles from "./folder-options.module.css";

// Components
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context";
import folderApi from "../../../server-api/folder";
import IconClickable from "../buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

import { ASSET_EDIT } from "../../../constants/permissions";

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
  activeFolderId,
  onClickFilterSettings,
  renameCollection,
  childFolders,
  moveCollection
}) => {
  const { user, hasPermission } = useContext(UserContext);

  const options = isShare
    ? [{ label: "Download", onClick: downloadFoldercontents }]
    : [
      { label: "Download", onClick: downloadFoldercontents },
      // { label: "Delete", onClick: () => setDeleteOpen(true) },
      { label: "Share", onClick: shareAssets },
      {
        label: "Rename Folder",
        onClick: () => {
          renameCollection();
        },
      },
      {
        label: "Add to Collection",
        onClick: () => {
          moveCollection();
        },
      },
    ];

  if (childFolders?.length > 0) {

    const indexToRemove = options.findIndex((ele) => ele.label === 'Add to Collection');

    // Remove the object at the found index using splice
    if (indexToRemove !== -1) {
      options.splice(indexToRemove, 1);
    }
  }

  if (hasPermission([ASSET_EDIT])) {
    options.push({ label: "Delete", onClick: () => setDeleteOpen(true) });
  }

  const [adminOption, setAdminOption] = useState(options);

  const handleChangeThumbnail = async () => {
    try {
      const { data } = await folderApi.getFolderById(activeFolderId);
      changeThumbnail(data);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    let userDetails: any = user;
    let opts = adminOption;
    if (userDetails && (userDetails.roleId == "admin" || userDetails.roleId == "super_admin")) {
      if (opts.filter((ele) => ele.label == "Change Thumbnail").length == 0) {
        setAdminOption([
          ...opts,
          {
            label: "Change Thumbnail",
            onClick: handleChangeThumbnail,
          },
        ]);
        opts = [
          ...opts,
          {
            label: "Change Thumbnail",
            onClick: handleChangeThumbnail,
          },
        ];
      }
      setTimeout(() => {
        if (thumbnailPath) {
          if (opts.filter((ele) => ele.label == "Delete Thumbnail").length == 0) {
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
          if (opts.filter((ele) => ele.label == "Delete Thumbnail").length > 0) {
            setAdminOption([...opts.filter((ele) => ele.label !== "Delete Thumbnail")]);
            opts = [...opts.filter((ele) => ele.label !== "Delete Thumbnail")];
          }
        }
      }, 100);
    }

    if (copyEnabled && !isShare) {
      if (adminOption.filter((ele) => ele.label == "Copy Link").length == 0) {
        setAdminOption([...adminOption, { label: "Copy Link", onClick: copyShareLink }]);
      }
    }
  }, [user, thumbnailPath, downloadFoldercontents, copyShareLink]);

  return (
    <ToggleableAbsoluteWrapper
      contentClass={styles["asset-actions"]}
      wrapperClass={`${styles["asset-actions-wrapper"]} ${activeView === "list" && styles["list-actions-wrapper"]
        }`}
      Wrapper={({ children }) => (
        <>
          <IconClickable SVGElement={Utilities.more} additionalClass={styles.folderDots} />
          {children}
        </>
      )}
      Content={() => (
        <div className={styles.more}>
          {adminOption.length > 0 && (
            //TODO: handle Filter Settings click
            <Dropdown
              options={[
                ...adminOption,
                // {
                //   label: "Filter Settings",
                //   onClick: () => {
                //     console.log("Filter Settings");
                //   },
                // },
              ]}
            />
          )}
        </div>
      )}
    />
  );
};

export default FolderOptions;
