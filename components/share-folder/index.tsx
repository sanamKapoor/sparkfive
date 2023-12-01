import update from "immutability-helper";
import { useRouter } from "next/router";

import { isMobile } from "react-device-detect";
import { useContext, useEffect, useState } from "react";
import { AssetContext, FilterContext, ShareContext, UserContext } from "../../context";
import folderApi from "../../server-api/folder";
import shareCollectionApi from "../../server-api/share-collection";
import { DEFAULT_CUSTOM_FIELD_FILTERS, DEFAULT_FILTERS, getAssetsFilters, getAssetsSort } from "../../utils/asset";
import requestUtils from "../../utils/requests";
import toastUtils from "../../utils/toast";
import styles from "./index.module.css";

// Components
import AssetGrid from "../common/asset/asset-grid";
import AssetOps from "../common/asset/asset-ops";
import TopBar from "../common/asset/top-bar";
import PasswordOverlay from "./password-overlay";

import selectOptions from "../../utils/select-options";
import Spinner from "../common/spinners/spinner";
import SharedPageSidenav from "./shared-nested-sidenav/shared-nested-sidenav";

import { loadTheme } from "../../utils/theme";

import { defaultLogo } from "../../constants/theme";

const ShareFolderMain = () => {
  const router = useRouter();

  const {
    assets,
    setAssets,
    folders,
    setPlaceHolders,
    setActivePageMode,
    needsFetch,
    setNeedsFetch,
    addedIds,
    setAddedIds,
    nextPage,
    selectAllAssets,
    selectAllFolders,
    setFolders,
    activeFolder,
    setActiveFolder,
    selectedAllAssets,
    selectedAllFolders,
    setHeaderName,
    activeSubFolders,
    setActiveSubFolders,
    subFoldersViewList,
    setSubFoldersViewList,
    subFoldersAssetsViewList,
    setSubFoldersAssetsViewList,
    setSelectedAllSubFoldersAndAssets,
    selectedAllSubAssets,
    setSelectedAllSubAssets,
    selectedAllSubFoldersAndAssets,
    setSidebarOpen,
    sidebarOpen
  } = useContext(AssetContext);

  const { user, advancedConfig, setAdvancedConfig, setLogo } = useContext(UserContext);

  const { folderInfo, setFolderInfo, activePasswordOverlay, setActivePasswordOverlay } = useContext(ShareContext);

  const {
    activeSortFilter,
    setActiveSortFilter,
    setSharePath: setContextPath,
    term,
    searchFilterParams,
  } = useContext(FilterContext);

  const [firstLoaded, setFirstLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSearchOverlay, setActiveSearchOverlay] = useState(true);
  const [activeView, setActiveView] = useState("grid");
  const [sharePath, setSharePath] = useState("");
  const [activeMode, setActiveMode] = useState("assets");
  const [openFilter, setOpenFilter] = useState(activeMode === "assets" && !isMobile ? true : false);
  const [parentFolders, setParentFolders] = useState([]);

  const [sidenavFolderList, setSidenavFolderList] = useState([]);
  const [widthCard, setWidthCard] = useState(0);

  const [top, setTop] = useState("calc(55px + 5rem)");

  const submitPassword = async (password, email) => {
    try {
      const { data } = await folderApi.authenticateCollection({
        password,
        email,
        sharePath,
      });
      // Set axios headers
      requestUtils.setAuthToken(data.token, "share-authorization");

      getFolderInfo(true);
    } catch (err) {
      console.log(err);
      toastUtils.error("Wrong password or invalid link, please try again");
    }
  };

  const getFolders = async (replace = true) => {
    try {
      setActiveFolder("");

      if (replace) {
        setAddedIds([]);
      }
      setPlaceHolders("folder", replace);
      const { field, order } = activeSortFilter.sort;
      const queryParams = {
        page: replace ? 1 : nextPage,
        sortField: field,
        sortOrder: order,
        sharePath,
      };

      if (!replace && addedIds.length > 0) {
        // @ts-ignore
        queryParams.excludeIds = addedIds.join(",");
      }
      if (activeSortFilter.filterFolders?.length > 0) {
        // @ts-ignore
        queryParams.folders = activeSortFilter.filterFolders.map((item) => item.value).join(",");
      }
      const { data } = await shareCollectionApi.getFolders({
        ...queryParams,
        ...(term && { term }),
      });
      let assetList = { ...data, results: data.results };

      setFolders(assetList, replace);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    }
  };

  const setInitialLoad = async (folderInfo) => {
    if (!firstLoaded && folderInfo && folderInfo.customAdvanceOptions) {
      setFirstLoaded(true);

      const mode = folderInfo.singleSharedCollectionId ? "all" : "folders";

      let sort = { ...activeSortFilter.sort };
      if (mode === "folders") {
        sort =
          folderInfo.customAdvanceOptions.collectionSortView === "alphabetical"
            ? selectOptions.sort[3]
            : selectOptions.sort[1];
      } else {
        sort =
          folderInfo.customAdvanceOptions.assetSortView === "alphabetical"
            ? selectOptions.sort[3]
            : selectOptions.sort[1];
      }

      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: folderInfo.singleSharedCollectionId ? "all" : "folders", // Set to all if only folder is shared
        sort: sort,
      });
    }
  };

  useEffect(() => {
    const { asPath } = router;
    if (asPath) {
      // Get shareUrl from path
      const splitPath = asPath.split("collections/");
      const splitPathWithoutQuery = splitPath[1].split("?");
      setSharePath(splitPathWithoutQuery[0]);
      setContextPath(splitPathWithoutQuery[0]);
    }
  }, [router.asPath]);

  useEffect(() => {
    if (selectedAllAssets) {
      selectAllAssets(false);
    }

    if (selectedAllFolders) {
      selectAllFolders(false);
    }
    if (selectedAllSubAssets) {
      setSelectedAllSubAssets(false)
    }
    if (selectedAllSubFoldersAndAssets)
      setSelectedAllSubFoldersAndAssets(false);
  }, [activeMode]);

  useEffect(() => {
    if (sharePath && sharePath !== "[team]/[id]/[name]") {
      getFolderInfo();
    }
  }, [sharePath]);

  useEffect(() => {
    const { asPath } = router;

    if (asPath) {
      const splitPath = asPath.split("collections/");
      const newPath = splitPath[1];
      if (newPath && newPath !== "[team]/[id]/[name]") {
        setSharePath((prevSharePath) => {
          return newPath;
        });
        setContextPath((prevContextPath) => newPath);

        getFolderInfo();
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    if (needsFetch === "assets") {
      getAssets();
    } else if (needsFetch === "folders") {
      getFolders();
    }
    setNeedsFetch("");
  }, [needsFetch]);

  useEffect(() => {
    setInitialLoad(folderInfo);
    if (firstLoaded && sharePath) {
      setActivePageMode("library");
      if (activeSortFilter.mainFilter === "folders") {
        setActiveMode("folders");
        getFolders();
      } else if (
        activeSortFilter.mainFilter === "SubCollectionView" &&
        activeSubFolders !== ""
      ) {
        setActiveMode("SubCollectionView");
        getSubCollectionsFolderData(true, 50);
        getSubCollectionsAssetData();
      } else {
        setActiveMode("assets");
        setAssets([]);
        getAssets();
      }
    }
  }, [activeSortFilter, sharePath, folderInfo, term]);

  useEffect(() => {
    if (firstLoaded && activeSubFolders) {
      let sort =
        folderInfo?.customAdvanceOptions?.assetSortView === "alphabetical"
          ? selectOptions.sort[3]
          : selectOptions.sort[1];
      if (firstLoaded && activeSubFolders) {
        setActiveSortFilter({
          ...activeSortFilter,
          mainFilter: activeSubFolders
            ? "SubCollectionView"
            : activeSortFilter.mainFilter,
          sort,
        });
      }
    }
  }, [activeSubFolders]);

  useEffect(() => {
    if (firstLoaded && activeFolder) {
      let sort =
        folderInfo?.customAdvanceOptions?.assetSortView === "alphabetical"
          ? selectOptions.sort[3]
          : selectOptions.sort[1];
      if (firstLoaded && activeFolder) {
        setActiveSortFilter({
          ...activeSortFilter,
          mainFilter: activeFolder ? "all" : activeSortFilter.mainFilter,
          sort,
        });
      }
    }
  }, [activeFolder]);

  const getSubCollectionsFolderData = async (
    replace = true,
    pageSize?: number = 50
  ) => {
    try {
      if (activeSortFilter.mainFilter !== "SubCollectionView") {
        return;
      }
      setParentFolders(folderInfo.singleSharedCollectionId ? [folderInfo?.sharedFolder] : [])
      const { field, order } = activeSortFilter.sort;
      const { next } = subFoldersViewList;

      const queryParams = {
        page: replace ? 1 : next,
        pageSize: pageSize,
        sortField: field,
        sortOrder: order,
        sharePath,
      };
      if (activeSortFilter.filterFolders?.length > 0) {
        // @ts-ignore
        queryParams.folders = activeSortFilter.filterFolders
          .map((item) => item.value)
          .join(",");
      }
      const { data: subFolders } = await shareCollectionApi.getSubFolders(
        {
          ...queryParams,
          ...(term && { term }),
        },
        activeSubFolders
      );
      setSubFoldersViewList(subFolders, replace);
      setSidenavFolderList(subFolders?.results || []);
    } catch (err) {
      // TODO: Handle Error
      console.log(err);
    }
  };

  const getSubCollectionsAssetData = async (
    replace = true,
    showAllAssets: boolean = false
  ) => {
    try {
      if (activeSortFilter.mainFilter !== "SubCollectionView") {
        return;
      }

      if (replace) {
        setAddedIds([]);
      }

      const { next } = subFoldersAssetsViewList;
      const { data: subFolderAssets } = await shareCollectionApi.getAssets({
        ...getAssetsFilters({
          replace,
          activeFolder: activeSubFolders,
          addedIds,
          nextPage: next,
          userFilterObject: activeSortFilter,
        }),
        ...getAssetsSort(activeSortFilter),
        // term: "", // Empty because we don't search in case of sub-collection
        // ...searchFilterParams, commented because we don't search in case of sub-collection
        showAllAssets: showAllAssets,
        sharePath,
      });
      setSubFoldersAssetsViewList(subFolderAssets, replace);
    } catch (err) {
      // TODO: Handle Error
      console.log(err);
    }
  };

  const getFolderInfo = async (displayError = false) => {
    try {
      const { data } = await shareCollectionApi.getFolderInfo({ sharePath });
      setActivePasswordOverlay(false);
      setFolderInfo(data);
      setAdvancedConfig(data.customAdvanceOptions);
      if (folderInfo.singleSharedCollectionId && !folderInfo?.sharedFolder.parentId) {
        setHeaderName(folderInfo?.sharedFolder?.name || "")
      } else {
        setHeaderName(data.folderName);
      }

      const sharedFolder = data.sharedFolder;

      // Needed for navigation(arrows) information in detail-overlay
      if (sharedFolder) {
        const folders = [{ ...sharedFolder, assets: [...assets] }];
        if (!sharedFolder?.parentId) {
          console.log("helo", sharedFolder.id, activeSubFolders)
          setActiveSubFolders(sharedFolder.id);
        } else {
          setActiveFolder(sharedFolder.id);
          setFolders(folders);
        }
      }

      // There is team theme set
      if (data.theme) {
        // Load theme from team settings
        const currentTheme = loadTheme(data.theme);

        // @ts-ignore
        setLogo(currentTheme.logoImage?.realUrl || defaultLogo);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      // If not 500, must be auth error, request user password
      if (err.response?.status !== 500) {
        setFolderInfo(err.response.data);
        setActivePasswordOverlay(true);
      }
      if (displayError) {
        toastUtils.error("Wrong password or invalid link, please try again");
      }
      setLoading(false);
    }
  };

  const selectAll = () => {
    if (activeMode === "assets") {
      // Mark select all
      selectAllAssets();

      setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: true })));
    } else if (activeMode === "folders") {
      selectAllFolders();
      setFolders(folders.map((folder) => ({ ...folder, isSelected: true })));
    } else if (activeMode === "SubCollectionView") {

      if (subFoldersAssetsViewList.results.length > 0) {
        setSelectedAllSubAssets(true)
        setSelectedAllSubFoldersAndAssets(false);

        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset: any) => ({ ...asset, isSelected: true }))
        })
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: false,
          })),
        });
      } else {
        setSelectedAllSubFoldersAndAssets(true);
        setSelectedAllSubAssets(false)
        // For selecting the folders only subcollection view
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: true,
          })),
        });
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset: any) => ({
            ...asset,
            isSelected: false,
          })),
        });
      }


      // For selecting the assets only subcollection view
      // setSubFoldersAssetsViewList({
      //   ...subFoldersAssetsViewList, results: subFoldersAssetsViewList.results.map((asset) => ({ ...asset, isSelected: true }))
      // })
    }
  };

  const toggleSelected = (id: string) => {
    if (activeMode === "assets") {
      const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
      setAssets(
        update(assets, {
          [assetIndex]: {
            isSelected: { $set: !assets[assetIndex].isSelected },
          },
        }),
      );
    } else if (activeMode === "folders") {
      const folderIndex = folders.findIndex((folder) => folder.id === id);
      setFolders(
        update(folders, {
          [folderIndex]: {
            isSelected: { $set: !folders[folderIndex].isSelected },
          },
        }),
      );
    } else if (activeMode === "SubCollectionView") {
      const assetIndex = subFoldersAssetsViewList.results.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      const folderIndex = subFoldersViewList.results.findIndex(
        (folder) => folder.id === id
      );

      if (folderIndex !== -1) {
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: update(subFoldersViewList.results, {
            [folderIndex]: {
              isSelected: {
                $set: !subFoldersViewList.results[folderIndex]?.isSelected,
              },
            },
          }),
        });
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset) => ({
            ...asset,
            isSelected: false,
          })),
        });
      }
      if (assetIndex !== -1) {
        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: update(subFoldersAssetsViewList.results, {
            [assetIndex]: {
              isSelected: {
                $set: !subFoldersAssetsViewList.results[assetIndex]?.isSelected,
              },
            },
          }),
        });
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: false,
          })),
        });
      }
    }
  };

  const mapWithToggleSelection = (asset) => ({ ...asset, toggleSelected });

  const getAssets = async (replace = true) => {
    try {
      if (replace) {
        setAddedIds([]);
      }
      setPlaceHolders("asset", replace);
      const { data } = await shareCollectionApi.getAssets({
        ...getAssetsFilters({
          replace,
          nextPage,
          addedIds,
          activeFolder,
          userFilterObject: activeSortFilter,
        }),
        ...(term && { term }),
        ...searchFilterParams,
        ...getAssetsSort(activeSortFilter),
        sharePath,
      });
      setAssets(
        { ...data, results: data.results.map(mapWithToggleSelection) },
        replace
      );
      // setFirstLoaded(true);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
    }
  };

  const loadMore = () => {
    if (activeMode === "assets") {
      getAssets(false);
    } else {
      getFolders(false);
    }
  };

  const viewFolder = async (
    id: string,
    subCollection: boolean,
    nestedSubFolderId = "",
    folderName = ""
  ) => {
    if (
      (activeSortFilter.mainFilter === "SubCollectionView" &&
        activeSubFolders !== "") ||
      (subCollection && Boolean(folderInfo?.singleSharedCollectionId))
    ) {
      if (id) {
        setActiveFolder(id);
        setHeaderName(
          folderName
            ? folderName
            : sidenavFolderList.find((folder: any) => folder.id === id)?.name ||
            ""
        );
      } else {
        getFolderInfo();
      }
    } else if (!Boolean(folderInfo?.singleSharedCollectionId)) {
      if (id) {

        setActiveFolder(id);
        setHeaderName(
          folders.find((folder: any) => folder.id === id)?.name || ""
        );
      } else {
        setActiveFolder("");
        let sort =
          folderInfo?.customAdvanceOptions?.collectionSortView ===
            "alphabetical"
            ? selectOptions.sort[3]
            : selectOptions.sort[1];
        setActiveSortFilter({
          ...activeSortFilter,
          mainFilter: "folders", // Set to all if only folder is shared
          sort: sort,
        });
        getFolderInfo();
      }
    } else if (Boolean(folderInfo?.singleSharedCollectionId)) {
      setActiveFolder("");
      getFolderInfo();
    }
  };

  // TODO uncomment all
  const onChangeWidth = () => {
    if (!loading) {
      let remValue = "5rem";
      if (window.innerWidth <= 900) {
        remValue = "1rem + 1px";
      }

      let el = document.getElementById("top-bar");
      let style = getComputedStyle(el);

      const headerTop = document.getElementById("top-bar")?.offsetHeight || 55;
      setTop(`calc(${headerTop}px + ${remValue} - ${style.paddingBottom} - ${style.paddingTop})`);
    }
  };

  useEffect(() => {
    onChangeWidth();
    window.addEventListener("resize", onChangeWidth);
    return () => window.removeEventListener("resize", onChangeWidth);
  }, []);

  useEffect(() => {
    onChangeWidth();
  }, [loading]);

  const assetGridWrapperStyle =
    !!folderInfo.singleSharedCollectionId ||
      activeSortFilter.mainFilter === "folders"
      ? styles["col-wrapperview"]
      : styles["col-wrapper"];

  const showFilterView =
    (folderInfo.singleSharedCollectionId || activeMode === "assets") &&
    !activePasswordOverlay;

  const headingClick = (value: string, description: string) => {
    if (!value) {
      return false;
    };
    viewFolder()
  }

  return (
    <>
      {!loading && (
        <main className={`${styles.container} sharefolderOuter`}>
          {sidebarOpen ? <SharedPageSidenav
            viewFolder={viewFolder}
            headingClick={headingClick}
            sidenavFolderList={sidenavFolderList}
            parentFolders={parentFolders}
          /> : null}
          <TopBar
            activeSearchOverlay={activeSearchOverlay}
            activeSortFilter={activeSortFilter}
            setActiveSortFilter={setActiveSortFilter}
            activeView={activeView}
            setActiveView={setActiveView}
            setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
            selectAll={selectAll}
            isShare={true}
            singleCollection={!!folderInfo.singleSharedCollectionId}
            sharedAdvanceConfig={user ? undefined : advancedConfig}
            isFolder={activeSortFilter.mainFilter === "folders"}
            sharePath={sharePath}
            activeFolder={activeFolder}
            mode={activeMode}
          />
          <div
            className={`${assetGridWrapperStyle} ${styles["mainContainer"]}`}
            style={{ marginTop: top }}
          >
            <AssetGrid
              activeFolder={activeFolder}
              getFolders={getFolders}
              getSubFolders={getSubCollectionsFolderData}
              getSubCollectionsAssetData={getSubCollectionsAssetData}
              activeView={activeView}
              activeSortFilter={activeSortFilter}
              toggleSelected={toggleSelected}
              isShare={true}
              mode={activeMode}
              viewFolder={viewFolder}
              loadMore={loadMore}
              sharePath={sharePath}
              setWidthCard={setWidthCard}
              widthCard={widthCard}
            />
          </div>
        </main>
      )}
      {!loading && <AssetOps />}
      {loading && (
        <div className={"row justify-center"}>
          <Spinner />
        </div>
      )}
      {activePasswordOverlay && !loading && (
        <PasswordOverlay
          fields={folderInfo?.requiredFields?.length > 0 ? folderInfo?.requiredFields : ["password"]}
          onPasswordSubmit={submitPassword}
          logo={folderInfo?.teamIcon}
        />
      )}
    </>
  );
};

export default ShareFolderMain;
