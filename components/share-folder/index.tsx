import update from "immutability-helper";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  AssetContext,
  FilterContext,
  ShareContext,
  UserContext,
} from "../../context";
import folderApi from "../../server-api/folder";
import shareCollectionApi from "../../server-api/share-collection";
import {
  DEFAULT_CUSTOM_FIELD_FILTERS,
  DEFAULT_FILTERS,
  getAssetsFilters,
  getAssetsSort,
} from "../../utils/asset";
import requestUtils from "../../utils/requests";
import toastUtils from "../../utils/toast";
import styles from "./index.module.css";

// Components
import AssetGrid from "../common/asset/asset-grid";
import AssetOps from "../common/asset/asset-ops";
import TopBar from "../common/asset/top-bar";
import PasswordOverlay from "./password-overlay";

import { isMobile } from "react-device-detect";
import selectOptions from "../../utils/select-options";
import Spinner from "../common/spinners/spinner";

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
  } = useContext(AssetContext);

  const { user, advancedConfig, setAdvancedConfig } = useContext(UserContext);

  const {
    folderInfo,
    setFolderInfo,
    activePasswordOverlay,
    setActivePasswordOverlay,
  } = useContext(ShareContext);

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
  const [openFilter, setOpenFilter] = useState(
    activeMode === "assets" && !isMobile ? true : false
  );

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
        queryParams.folders = activeSortFilter.filterFolders
          .map((item) => item.value)
          .join(",");
      }
      const { data } = await shareCollectionApi.getFolders({
        ...queryParams,
        ...(term && { term }),
      });

      let assetList = { ...data, results: data.results };
      // if (lastUploadedFolder && activeSortFilter.mainFilter === "folders" && activeSortFilter.sort.value === "alphabetical") {
      //     const lastFolder = {...lastUploadedFolder}
      //     assetList.results.unshift(lastFolder)
      // }

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
      setSharePath(splitPath[1]);
      setContextPath(splitPath[1]);
    }
  }, [router.asPath]);

  // useEffect(() => {
  //     console.log('selectedAllAssets: ', selectedAllAssets)
  //     console.log('selectedAllFolders: ', selectedAllFolders)
  //     if (selectedAllAssets) {
  //       selectAllAssets(false);
  //     }

  //     if (selectedAllFolders) {
  //       selectAllFolders(false);
  //     }
  //   }, [activeMode]);

  useEffect(() => {
    if (sharePath && sharePath !== "[team]/[id]/[name]") {
      getFolderInfo();
    }
  }, [sharePath]);

  // useEffect(() => {
  //     if (folderInfo && !folderInfo.error) {
  //         setActivePageMode('library')
  //         setAssets([])
  //         getAssets()
  //     }
  // }, [activeSortFilter, folderInfo])

  useEffect(() => {
    if (needsFetch === "assets") {
      getAssets();
    } else if (needsFetch === "folders") {
      getFolders();
    }
    setNeedsFetch("");
  }, [needsFetch]);

  useEffect(() => {
    if (activeMode === "assets") {
      if (isMobile) {
        setOpenFilter(false);
      } else {
        setOpenFilter(true);
      }
    } else if (activeMode === "folders") {
      setOpenFilter(false);
    }
  }, [activeMode]);

  useEffect(() => {
    setInitialLoad(folderInfo);

    if (firstLoaded && sharePath) {
      setActivePageMode("library");
      if (activeSortFilter.mainFilter === "folders") {
        setActiveMode("folders");
        getFolders();
      } else {
        setActiveMode("assets");
        setAssets([]);
        getAssets();
      }
    }
  }, [activeSortFilter, sharePath, folderInfo, term]);

  useEffect(() => {
    if (firstLoaded && activeFolder !== "") {
      let sort =
        folderInfo.customAdvanceOptions.assetSortView === "alphabetical"
          ? selectOptions.sort[3]
          : selectOptions.sort[1];

      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: "all",
        sort: sort,
      });
    }
  }, [activeFolder]);

  const getFolderInfo = async (displayError = false) => {
    try {
      const { data } = await shareCollectionApi.getFolderInfo({ sharePath });
      setFolderInfo(data);
      setAdvancedConfig(data.customAdvanceOptions);
      setActivePasswordOverlay(false);
      const sharedFolder = data.sharedFolder;

      // Needed for navigation(arrows) information in detail-overlay
      if (sharedFolder) {
        const folders = [{ ...sharedFolder, assets: [...assets] }];
        setFolders(folders);
        setActiveFolder(sharedFolder.id);
      }

      setLoading(false);
    } catch (err) {
      // If not 500, must be auth error, request user password
      if (err.response.status !== 500) {
        setFolderInfo(err.response.data);
        setActivePasswordOverlay(true);
      }
      console.log(err);
      if (displayError) {
        toastUtils.error("Wrong password or invalid link, please try again");
      }

      setLoading(false);
    }
  };

  const clearFilters = () => {
    setActiveSortFilter({
      ...activeSortFilter,
      ...DEFAULT_FILTERS,
      ...DEFAULT_CUSTOM_FIELD_FILTERS(activeSortFilter),
    });
  };

  const selectAll = () => {
    if (activeMode === "assets") {
      // Mark select all
      selectAllAssets();

      setAssets(
        assets.map((assetItem) => ({ ...assetItem, isSelected: true }))
      );
    } else if (activeMode === "folders") {
      selectAllFolders();

      setFolders(folders.map((folder) => ({ ...folder, isSelected: true })));
    }
  };

  const closeSearchOverlay = () => {
    getAssets();
    setActiveSearchOverlay(false);
  };

  const toggleSelected = (id) => {
    if (activeMode === "assets") {
      const assetIndex = assets.findIndex(
        (assetItem) => assetItem.asset.id === id
      );
      setAssets(
        update(assets, {
          [assetIndex]: {
            isSelected: { $set: !assets[assetIndex].isSelected },
          },
        })
      );
    } else if (activeMode === "folders") {
      const folderIndex = folders.findIndex((folder) => folder.id === id);
      setFolders(
        update(folders, {
          [folderIndex]: {
            isSelected: { $set: !folders[folderIndex].isSelected },
          },
        })
      );
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

      setFirstLoaded(true);
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

  const viewFolder = async (id) => {
    setActiveFolder(id);
  };

  const onChangeWidth = () => {
    if (!loading) {
      let remValue = "5rem";
      if (window.innerWidth <= 900) {
        remValue = "1rem + 1px";
      }

      let el = document.getElementById("top-bar");
      let style = getComputedStyle(el);

      const headerTop = document.getElementById("top-bar")?.offsetHeight || 55;
      setTop(
        `calc(${headerTop}px + ${remValue} - ${style.paddingBottom} - ${style.paddingTop})`
      );
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

  const selectedAssets = assets.filter((asset) => asset.isSelected);
  const selectedFolders = folders.filter((folder) => folder.isSelected);

  const assetGridWrapperStyle =
    !!folderInfo.singleSharedCollectionId ||
    activeSortFilter.mainFilter === "folders"
      ? styles["col-wrapperview"]
      : styles["col-wrapper"];

  return (
    <>
      {!loading && (
        <main className={`${styles.container} sharefolderOuter`}>
          <TopBar
            activeSearchOverlay={activeSearchOverlay}
            activeSortFilter={activeSortFilter}
            setActiveSortFilter={setActiveSortFilter}
            activeView={activeView}
            setActiveView={setActiveView}
            setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
            selectAll={selectAll}
            setOpenFilter={setOpenFilter}
            openFilter={openFilter}
            isShare={true}
            singleCollection={!!folderInfo.singleSharedCollectionId}
            sharedAdvanceConfig={user ? undefined : advancedConfig}
            isFolder={activeSortFilter.mainFilter === "folders"}
            sharePath={sharePath}
            activeFolder={activeFolder}
            mode={activeMode}
          />
          <div className={assetGridWrapperStyle} style={{ marginTop: top }}>
            <AssetGrid
              activeFolder={activeFolder}
              getFolders={getFolders}
              activeView={activeView}
              activeSortFilter={activeSortFilter}
              toggleSelected={toggleSelected}
              isShare={true}
              mode={activeMode}
              viewFolder={viewFolder}
              loadMore={loadMore}
              openFilter={openFilter}
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
          fields={
            folderInfo?.requiredFields?.length > 0
              ? folderInfo?.requiredFields
              : ["password"]
          }
          onPasswordSubmit={submitPassword}
          logo={folderInfo?.teamIcon}
        />
      )}
      {/* {!loading &&
                <SearchOverlay
                    sharePath={sharePath}
                    closeOverlay={closeSearchOverlay}
                    activeFolder={activeFolder}
                    isFolder={activeSortFilter.mainFilter === 'folders'}
                />
            } */}
    </>
  );
};

export default ShareFolderMain;
