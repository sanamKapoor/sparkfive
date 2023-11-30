// External
import fileDownload from "js-file-download";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

import { AssetOps, Utilities } from "../../../assets";
import { maximumAssociateFiles } from "../../../constants/asset-associate";
import { ASSET_DOWNLOAD } from "../../../constants/permissions";
import {
  AssetContext,
  FilterContext,
  LoadingContext,
  UserContext,
} from "../../../context";
import assetApi from "../../../server-api/asset";
import folderApi from "../../../server-api/folder";
import shareApi from "../../../server-api/share-collection";
import { getAssetsFilters } from "../../../utils/asset";
import { getSubdomain } from "../../../utils/domain";
import toastUtils from "../../../utils/toast";
import IconClickable from "../../common/buttons/icon-clickable";
import Dropdown from "../inputs/dropdown";
import ConfirmModal from "../modals/confirm-modal";
import styles from "./asset-header-ops.module.css";

const AssetHeaderOps = ({
  isUnarchive = false,
  isShare = false,
  isFolder = false,
  deselectHidden = false,
  deletedAssets = false,
  advancedLink = false,
  activeMode,
  selectedFolders,
  selectedSubFoldersAndAssets,
}: {
  activeMode: string;
  [key: string]: any;
}) => {

  const router = useRouter();

  const [sharePath, setSharePath] = useState("");
  const [showShareAction, setShowShareAction] = useState(false);
  const contentRef = useRef(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showAssociateModalOpen, setShowAssociateModalOpen] = useState(false);

  const {
    assets,
    setAssets,
    folders,
    setFolders,
    setActiveOperation,
    selectedAllAssets,
    selectAllAssets,
    selectAllFolders,
    totalAssets,
    activeSubFolders,
    activeFolder,
    updateDownloadingStatus,
    setNeedsFetch,
    subFoldersAssetsViewList,
    subFoldersViewList,
    setSelectedAllSubFoldersAndAssets,
    setSubFoldersViewList,
    selectedAllSubAssets,
    setSubFoldersAssetsViewList,
  } = useContext(AssetContext);

  const { setIsLoading } = useContext(LoadingContext);
  const { hasPermission } = useContext(UserContext);

  const {
    activeSortFilter,
    term,
    setSharePath: setContextPath,
  } = useContext(FilterContext);

  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const selectedSubFolderAssetId =
    subFoldersAssetsViewList?.results?.filter((asset) => asset.isSelected) ||
    [];
  let totalSelectAssets = selectedAssets.length;

  useEffect(() => {
    const { asPath } = router;
    if (asPath) {
      if (advancedLink) {
        // TODO: Optimize exact path
        const splitPath = asPath.split("/collections/");

        const idPath = splitPath[1].split("/");

        if (
          idPath &&
          !idPath[0].includes("[team]") &&
          !idPath[1].includes("[id]")
        ) {
          const path = `${processSubdomain()}/${idPath[1]}/${idPath[0]}`;
          setSharePath(path);
          setContextPath(path);
        }
      } else {
        // Get shareUrl from path
        const splitPath = asPath.split("collections/");
        setSharePath(splitPath[1]);
      }
    }
  }, [router.asPath]);

  const isSubCollection = activeMode === "SubCollectionView";

  // Hidden pagination assets are selected
  if (selectedAllAssets) {
    // Get assets is not selected on screen
    const currentUnSelectedAssets = assets.filter((asset) => !asset.isSelected);
    totalSelectAssets = totalAssets - currentUnSelectedAssets.length;
  }

  if (selectedFolders?.length > 0) {
    totalSelectAssets = selectedFolders.length;
  }
  let totalSubFoldersAndAssets = { assets: 0, folders: 0 };

  if (
    selectedSubFoldersAndAssets?.folders?.length > 0 ||
    selectedSubFoldersAndAssets?.assets?.length > 0
  ) {
    totalSubFoldersAndAssets = {
      assets:
        subFoldersAssetsViewList.results.filter((asset) => asset.isSelected)
          ?.length || 0,
      folders:
        subFoldersViewList.results.filter((folder) => folder.isSelected)
          ?.length || 0,
    };
  }
  if (selectedAllSubAssets) {
    const currentUnSelectedAssets = subFoldersAssetsViewList.results.filter((asset) => !asset.isSelected);
    totalSelectAssets = subFoldersAssetsViewList.total - currentUnSelectedAssets.length;
    totalSubFoldersAndAssets = {
      assets: totalSelectAssets,
      folders: 0
    }
  }

  const downloadSelectedAssets = async () => {
    try {
      let payload = {
        assetIds: [],
        folderIds: [],
        subFolders: [],
      };

      let totalDownloadingAssets = 0;

      let filters = {
        estimateTime: 1,
      };
      // Have implemented the functionality for the Download Sub Collection assets
      if (selectedAllAssets || selectedAllSubAssets) {
        totalDownloadingAssets = totalAssets;
        // Download all assets without pagination
        filters = {
          ...getAssetsFilters({
            replace: false,
            activeFolder: selectedAllAssets ? activeFolder : activeSubFolders,
            addedIds: [],
            nextPage: 1,
            userFilterObject: activeSortFilter,
          }),
          selectedAll: 1,
          estimateTime: 1,
        };

        if (term) {
          // @ts-ignore
          filters.term = term;
        }
        // @ts-ignore
        delete filters.page;
      } else if (selectedFolders.length > 0) {
        totalDownloadingAssets = selectedFolders.length;
        payload.folderIds = selectedFolders.map((folder) => folder.id);
      } else if (selectedSubFoldersAndAssets.folders.length > 0) {
        totalDownloadingAssets = selectedSubFoldersAndAssets.folders.length;
        payload.folderIds = selectedSubFoldersAndAssets.folders.map(
          (folder) => folder.id
        );
      } else if (selectedSubFoldersAndAssets.assets.length > 0) {
        totalDownloadingAssets = selectedSubFoldersAndAssets.assets.length;
        payload.assetIds = selectedSubFoldersAndAssets.assets.map(
          (assetItem) => assetItem.asset.id
        );
      } else {
        totalDownloadingAssets = selectedAssets.length;
        payload.assetIds = selectedAssets.map(
          (assetItem) => assetItem.asset.id
        );
      }
      // Add sharePath property if user is at share collection page
      if (sharePath) {
        filters["sharePath"] = sharePath;
      }
      // Show processing bar
      updateDownloadingStatus("zipping", 0, totalDownloadingAssets);
      let api = assetApi;

      if (payload.assetIds.length > 0 || selectedAllAssets) {
        if (isShare) {
          api = shareApi;
        }
        const { data } = await api.downloadAll(payload, filters);
        // Download file to storage
        fileDownload(data, "assets.zip");

        updateDownloadingStatus("done", 0, 0);
      } else if (payload.folderIds.length > 0) {
        api = folderApi;
        if (isShare) {
          api = shareApi;
        }
        const { data } = await api.downloadFoldersAsZip(payload, filters);
        // Download file to storage
        fileDownload(data, "assets.zip");
        updateDownloadingStatus("done", 0, 0);
      }
    } catch (e) {
      console.error(e);
      const errMsg =
        e?.response?.status === 400
          ? "Warning: The max download size is 10GB or 500 files. Please try downloading a smaller batch."
          : "Internal Server Error. Please try again.";
      updateDownloadingStatus("error", 0, 0, errMsg);
    }
  };

  const associateAssets = async () => {
    if (!isFolder) {
      setIsLoading(true);
      let associateAssets;
      if (activeSortFilter?.mainFilter === "SubCollectionView") {
        associateAssets = selectedSubFolderAssetId;
      } else {
        associateAssets = selectedAssets;
      }

      const assetIds = associateAssets.map((assetItem) => assetItem.asset.id);

      if (assetIds?.length > 1) {
        const assetsToAssociate = associateAssets.filter(
          (assetItem) =>
            assetItem.asset.fileAssociations.length +
            associateAssets.length -
            1 <=
            maximumAssociateFiles
        );
        if (assetsToAssociate?.length !== associateAssets?.length) {
          setIsLoading(false);
          toastUtils.error(
            `Some of your selected assets have already maximum ${maximumAssociateFiles} associated files`
          );
        } else {
          await assetApi.associate(assetIds);
          if (activeSortFilter?.mainFilter === "SubCollectionView") {
            setNeedsFetch("SubCollectionView");
          } else {
            setNeedsFetch("asset");
          }
          toastUtils.success("Association successful");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        toastUtils.error("Please select at least 2 assets to associate");
      }
    }
  };

  const deselectAll = () => {
    if (activeMode === "assets" || !activeMode) {
      // Mark deselect all
      selectAllAssets(false);

      setAssets(assets.map((asset) => ({ ...asset, isSelected: false })));
    } else if (activeMode === "folders") {
      selectAllFolders(false);
      setFolders(folders.map((folder) => ({ ...folder, isSelected: false })));
    } else if (activeMode === "SubCollectionView") {
      // Mark deselect all
      setSubFoldersAssetsViewList(false)
      setSelectedAllSubFoldersAndAssets(false);
      setSubFoldersViewList({
        ...subFoldersViewList,
        results: subFoldersViewList.results.map((folder) => ({
          ...folder,
          isSelected: false,
        })),
      });
      setSubFoldersAssetsViewList({
        ...subFoldersAssetsViewList,
        results: subFoldersAssetsViewList.results.map((asset) => ({
          ...asset,
          isSelected: false,
        })),
      });
    }
  };

  const processSubdomain = () => {
    return getSubdomain() || "danner";
  };

  const handleClickOutside = (event) => {
    if (contentRef.current && !contentRef.current.contains(event.target)) {
      showShareActionList(null, false);
    }
  };

  const showShareActionList = (e, visible) => {
    if (e) {
      e.stopPropagation();
    }

    const getCustomFields = (filters) => {
      let fields = "";
      Object.keys(filters).map((key) => {
        if (key.includes("custom-p")) {
          if (fields) {
            fields = `${fields},${filters[key]}`;
          } else {
            fields = `${filters[key]}`;
          }
        }
      });

      return fields;
    };

    const filters = {
      ...getAssetsFilters({
        replace: false,
        activeFolder:
          activeSortFilter?.mainFilter === "SubCollectionView"
            ? activeSubFolders
            : activeFolder,
        addedIds: [],
        nextPage: 1,
        userFilterObject: activeSortFilter,
      }),
      selectedAll: "1",
    };

    const customFields = getCustomFields(filters);

    // Select all assets in folder
    if (
      filters["folderId"] &&
      (customFields || filters["tags"]) &&
      selectedAllAssets
    ) {
      setShowShareAction(visible);
      if (visible) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    } else {
      setActiveOperation("share");
    }
  };

  const conditionalIcons = [
    {
      condition:
        ((!isFolder && !deletedAssets && !isSubCollection) ||
          totalSubFoldersAndAssets.assets > 0) &&
        !isShare,
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`edit`],
        tooltipText: "Edit",
        tooltipId: "Edit",
        onClick: () => setActiveOperation("edit"),
        child: null,
      },
    },
    {
      condition:
        ((!isFolder && !deletedAssets && !isSubCollection) ||
          totalSubFoldersAndAssets.assets > 0) &&
        !isShare,
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`delete`],
        tooltipText: "Delete",
        tooltipId: "Delete",
        onClick: () => setActiveOperation("update"),
        child: null,
      },
    },
    {
      condition: isShare || (hasPermission([ASSET_DOWNLOAD]) && !deletedAssets),
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`download`],
        tooltipId: "Download",
        tooltipText: "Download",
        onClick: downloadSelectedAssets,
        child: null,
      },
    },
    {
      condition:
        ((!isFolder && !deletedAssets && !isSubCollection) ||
          totalSubFoldersAndAssets.assets > 0) &&
        !isShare,
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`move`],
        tooltipText: "Add to Collection",
        tooltipId: "Move",
        onClick: () => setActiveOperation("move"),
        child: null,
      },
    },
    {
      condition:
        ((!isFolder && !deletedAssets && !isSubCollection) ||
          totalSubFoldersAndAssets.assets > 0) &&
        !isShare,
      props: {
        child: (
          <div className={styles["share-wrapper"]} ref={contentRef}>
            <IconClickable
              place={"top"}
              additionalClass={`${styles["action-button"]}`}
              src={AssetOps[`share`]}
              tooltipText={"Share"}
              tooltipId={"Share"}
              onClick={(e) => {
                showShareActionList(e, true);
              }}
            />
            {showShareAction && (
              <div className={styles["share-popover"]}>
                <div className={styles["share-title"]}>
                  Share
                  <img
                    src={Utilities.blueClose}
                    alt={"close"}
                    onClick={(e) => {
                      showShareActionList(e, false);
                    }}
                  />
                </div>
                <ul>
                  <li
                    className={styles["share-item"]}
                    onClick={() => {
                      setShowShareAction(false);
                      setActiveOperation("share-as-subcollection");
                    }}
                  >
                    <img src={Utilities.gridView} alt={"share-collection"} />
                    <span className={"font-weight-500"}>
                      Share as Collection
                    </span>
                    <p className={styles["share-description"]}>
                      Create a branded collection
                    </p>
                  </li>
                  <li
                    className={styles["share-item"]}
                    onClick={() => {
                      setShowShareAction(false);
                      setActiveOperation("share");
                    }}
                  >
                    <img src={Utilities.share} alt={"share-file"} />
                    <span className={"font-weight-500"}>Share Files</span>
                    <p className={styles["share-description"]}>
                      Create a link to shared file(s)
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ),
      },
    },
    {
      condition:
        (isFolder && !deletedAssets && selectedFolders?.length < 2) ||
        (totalSubFoldersAndAssets.folders > 0 && isSubCollection && !isShare),
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`share`],
        tooltipText: "Share",
        tooltipId: "Share",
        onClick: () => setActiveOperation("shareCollections"),
        child: null,
      },
    },
    {
      condition: deletedAssets,
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`move`],
        tooltipText: "Recover Asset",
        tooltipId: "Recover",
        onClick: () => setActiveOperation("recover"),
        child: null,
      },
    },
    {
      condition: deletedAssets,
      props: {
        place: "top",
        additionalClass: styles["action-button"],
        src: AssetOps[`delete`],
        tooltipText: "Delete",
        tooltipId: "Delete",
        onClick: () => setActiveOperation("delete"),
        child: null,
      },
    },
    {
      condition: ((!isFolder && !isSubCollection || totalSubFoldersAndAssets.assets > 0) && !isShare && activeMode),
      props: {
        child: (
          <div className={styles["more-wrapper"]}>
            <IconClickable
              place={"top"}
              additionalClass={`${styles["action-button"]}`}
              src={Utilities.more}
              tooltipText={"More"}
              tooltipId={"More"}
              onClick={() => setShowMoreActions(true)}
            />
            {showMoreActions && !deletedAssets && (
              <>
                {" "}
                <Dropdown
                  onClickOutside={() => setShowMoreActions(false)}
                  additionalClass={styles["more-dropdown"]}
                  options={[
                    {
                      id: "associate",
                      label: "Associate",
                      icon: AssetOps.associateBlue,
                      onClick: () => setShowAssociateModalOpen(true),
                    },
                    {
                      id: "move",
                      label: "Move",
                      icon: AssetOps.moveReplace,
                      onClick: () => setActiveOperation("moveReplace"),
                    },
                    {
                      id: "archive",
                      label: "Archive",
                      icon: AssetOps.archive,
                      onClick: () =>
                        setActiveOperation(
                          isUnarchive ? "unarchive" : "archive"
                        ),
                    },
                    {
                      id: "copy",
                      label: "Copy",
                      icon: AssetOps.copy,
                      onClick: () => setActiveOperation("copy"),
                    },
                    {
                      id: "thumbnail",
                      label: "Recreate Thumbnail",
                      icon: AssetOps.recreateThumbnail,
                      onClick: () => setActiveOperation("generate_thumbnails"),
                    },
                  ]}
                />
              </>
            )}
          </div>
        ),
      },
    },
  ];


  return (
    <div className={styles.bar}>
      <div className={styles.wrapper}>
        {!deselectHidden && (
          <img
            className={styles.close}
            src={Utilities.blueClose}
            onClick={deselectAll}
          />
        )}
        <div className={styles.text}>
          {(activeMode === "assets" || !activeMode)
            ? `${totalSelectAssets} Assets`
            : activeMode === "folders"
              ? `${totalSelectAssets} Collections`
              : totalSubFoldersAndAssets.folders > 0 ? `${totalSubFoldersAndAssets?.folders} Sub Collections` :
                `${totalSubFoldersAndAssets.assets} Assets`

          }{" "}
          Selected
        </div>
      </div>

      {/** add below line in case of selection of assets in subcollection right */}
      {/* and ${totalSubFoldersAndAssets.assets} Assets */}
      {/* Icons over the select all modal  */}

      <div className={styles.icons}>
        {conditionalIcons.map(
          ({ condition, props }, index) =>
            condition &&
            (props.child ? (
              props.child
            ) : (
              <IconClickable key={index} {...props} />
            ))
        )}
      </div>

      {((!isFolder && !isSubCollection && !deletedAssets) ||
        totalSubFoldersAndAssets.assets > 0) &&
        !isShare && (
          <>
            <ConfirmModal
              closeModal={() => setShowAssociateModalOpen(false)}
              confirmAction={() => {
                setActiveOperation("associate");
                setShowAssociateModalOpen(false);
                associateAssets();
              }}
              confirmText={"Associate"}
              message={
                <span className="">
                  Associate (
                  {isSubCollection
                    ? totalSubFoldersAndAssets.assets
                    : totalSelectAssets}
                  ) asset(s)?
                </span>
              }
              subText="Associating allows you see all related assets together on the asset detail pages"
              modalIsOpen={showAssociateModalOpen}
            />
          </>
        )}
    </div>
  );
};

export default AssetHeaderOps;
