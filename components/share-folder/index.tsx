import update from "immutability-helper";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { AssetContext, FilterContext, ShareContext, UserContext } from "../../context";
import folderApi from "../../server-api/folder";
import shareCollectionApi from "../../server-api/share-collection";
import { getAssetsFilters, getAssetsSort } from "../../utils/asset";
import requestUtils from "../../utils/requests";
import selectOptions from "../../utils/select-options";
import toastUtils from "../../utils/toast";
import AssetGrid from "../common/asset/asset-grid";
import AssetOps from "../common/asset/asset-ops";
import TopBar from "../common/asset/top-bar";
import Spinner from "../common/spinners/spinner";
import styles from "./index.module.css";
import PasswordOverlay from "./password-overlay";
import NestedFirstlist from "./shared-nested-sidenav/shared-sidebar-firstlist";
import SharedPageSidenav from "./shared-nested-sidenav/shared-sidebar-sidenav";

import { loadTheme } from "../../utils/theme";

import { defaultLogo } from "../../constants/theme";
import cookiesApi from "../../utils/cookies";
import { shareLinkEvents } from "../../constants/analytics";
import useAnalytics from "../../hooks/useAnalytics";

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
  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);
  const [activeView, setActiveView] = useState("grid");
  const [sharePath, setSharePath] = useState("");
  const [activeMode, setActiveMode] = useState("assets");
  const [widthCard, setWidthCard] = useState(0);

  const [top, setTop] = useState("calc(55px + 5rem)");
  const { trackLinkEvent } = useAnalytics();

  useEffect(() => {
    const { asPath } = router;
    if (asPath) {
      // Get shareUrl from path
      const splitPath = asPath.split("collections/");

      const splitPathWithoutQuery = splitPath[1].split("?");
      setSharePath(splitPathWithoutQuery[0]);
      setContextPath(splitPathWithoutQuery[0]);
    }
    onChangeWidth();
    window.addEventListener("resize", onChangeWidth);
    return () => {
      window.removeEventListener("resize", onChangeWidth);
    };

  }, [router.asPath]);

  useEffect(() => {
    if (sharePath && sharePath !== "[team]/[id]/[name]") {
      getFolderInfo();
    }
  }, [sharePath]);

  useEffect(() => {
    if (selectedAllAssets) {
      selectAllAssets(false);
    }
    if (selectedAllFolders) {
      selectAllFolders(false);
    }
    if (selectedAllSubAssets) {
      setSelectedAllSubAssets(false);
    }
    if (selectedAllSubFoldersAndAssets) setSelectedAllSubFoldersAndAssets(false);
  }, [activeMode]);

  useEffect(() => {
    if (needsFetch === "assets") {
      getAssets();
    } else if (needsFetch === "folders") {
      getFolders();
    }
    setNeedsFetch("");
  }, [needsFetch]);

  useEffect(() => {
    setInitialLoad(folderInfo, activeSortFilter.mainFilter);
    if (firstLoaded && sharePath) {
      setActivePageMode("library");
      if (activeSortFilter.mainFilter === "folders") {
        setActiveMode("folders");
        getFolders();
      } else if (activeSortFilter.mainFilter === "SubCollectionView" && activeSubFolders !== "") {
        setActiveMode("SubCollectionView");
        getSubCollectionsFolderData(true, 10);
        getSubCollectionsAssetData();
      } else {
        setActiveMode("assets");
        setAssets([]);
        getAssets();
      }
    }
  }, [activeSortFilter, folderInfo, term]);

  useEffect(() => {
    if (firstLoaded && activeSubFolders) {
      let sort =
        folderInfo?.customAdvanceOptions?.assetSortView === "alphabetical"
          ? selectOptions.sort[3]
          : selectOptions.sort[1];
      if (firstLoaded && activeSubFolders) {
        setActiveSortFilter({
          ...activeSortFilter,
          mainFilter: activeSubFolders ? "SubCollectionView" : activeSortFilter.mainFilter,
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

  const submitPassword = async (password, email) => {
    try {
      const { data } = await folderApi.authenticateCollection({
        password,
        email,
        sharePath,
      });
      // Set axios headers
      requestUtils.setAuthToken(data.token, "share-authorization");
      cookiesApi.set('shared_email', email);
      getFolderInfo(true);
    } catch (err) {
      toastUtils.error("Wrong password or invalid link, please try again");
    }
  };

  const getFolders = async (replace = true) => {
    try {
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
      let foldersList = { ...data, results: data.results };
      setFolders(foldersList, replace);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      //TODO: Handle error
      console.log(err);
    }
  };

  const setInitialLoad = async (folderInfo) => {

    if (!firstLoaded && folderInfo && folderInfo.customAdvanceOptions) {
      setFirstLoaded(true);
      let mode, sort;
      if (folderInfo?.singleSharedCollectionId && folderInfo?.sharedFolder?.parentId) {
        sort =
          folderInfo?.customAdvanceOptions.assetSortView === "alphabetical"
            ? selectOptions.sort[3]
            : selectOptions.sort[1];
        mode = "all";
      } else if (folderInfo?.singleSharedCollectionId && !folderInfo?.sharedFolder?.parentId) {
        setActiveSubFolders(folderInfo?.singleSharedCollectionId);
        return;
      } else if (!folderInfo?.singleSharedCollectionId) {
        sort =
          folderInfo?.customAdvanceOptions.collectionSortView === "alphabetical"
            ? selectOptions.sort[3]
            : selectOptions.sort[1];
        mode = "folders";
      }
      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: mode, // Set to all if only folder is shared
        sort: sort,
      });
      setHeaderName(folderInfo.folderName);
    }
  };

  const getFolderInfo = async (displayError = false, ignoreFolder = false) => {
    try {
      const { data } = await shareCollectionApi.getFolderInfo({ sharePath });
      let sort, mode;

      if (firstLoaded) {
        if (data?.singleSharedCollectionId && data?.sharedFolder?.parentId) {
          sort =
            data?.customAdvanceOptions.assetSortView === "alphabetical" ? selectOptions.sort[3] : selectOptions.sort[1];
          mode = "all";
          setActiveSortFilter({
            ...activeSortFilter,
            mainFilter: mode, // Set to all if only folder is shared
            sort: sort,
          });
        } else if (data?.singleSharedCollectionId && !data?.sharedFolder?.parentId) {
          setActiveSubFolders(data?.singleSharedCollectionId);
        } else if (!data?.singleSharedCollectionId) {
          sort =
            data?.customAdvanceOptions.collectionSortView === "alphabetical"
              ? selectOptions.sort[3]
              : selectOptions.sort[1];
          mode = "folders";
          setActiveSortFilter({
            ...activeSortFilter,
            mainFilter: mode, // Set to all if only folder is shared
            sort: sort,
          });
        }
      }

      setHeaderName(data.folderName);
      setFolderInfo(data);
      setAdvancedConfig(data.customAdvanceOptions);
      setActivePasswordOverlay(false);

      setLoading(false);
      // There is team theme set
      if (data.theme) {
        if (data?.theme?.teamId) cookiesApi.set('teamId', data?.theme?.teamId)
        // Load theme from team settings
        const currentTheme = loadTheme(data.theme);
        // @ts-ignore
        setLogo(currentTheme.logoImage?.realUrl || defaultLogo);
      }
      // Track event
      trackLinkEvent(shareLinkEvents.ACCESS_SHARED_LINK, {
        link: window.location.href,
        type: "Collection",
        teamId: cookiesApi.get('teamId') || null,
        email: cookiesApi.get('shared_email') || null,
      });

    } catch (err) {
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

  const getSubCollectionsFolderData = async (replace = true, pageSize: number = 10, nestedSubFolderId: string = "") => {
    try {
      if (activeSortFilter.mainFilter !== "SubCollectionView") {
        return;
      }
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
        queryParams.folders = activeSortFilter.filterFolders.map((item) => item.value).join(",");
      }
      const { data: subFolders } = await shareCollectionApi.getSubFolders(
        {
          ...queryParams,
          ...(term && { term }),
        },
        nestedSubFolderId ? nestedSubFolderId : activeSubFolders,
      );

      setSubFoldersViewList(subFolders, replace);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const getSubCollectionsAssetData = async (replace = true, showAllAssets: boolean = false) => {
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
        setSelectedAllSubAssets(true);
        setSelectedAllSubFoldersAndAssets(false);

        setSubFoldersAssetsViewList({
          ...subFoldersAssetsViewList,
          results: subFoldersAssetsViewList.results.map((asset: any) => ({ ...asset, isSelected: true })),
        });
        setSubFoldersViewList({
          ...subFoldersViewList,
          results: subFoldersViewList.results.map((folder: any) => ({
            ...folder,
            isSelected: false,
          })),
        });
      } else {
        setSelectedAllSubFoldersAndAssets(true);
        setSelectedAllSubAssets(false);
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
      const assetIndex = subFoldersAssetsViewList.results.findIndex((assetItem) => assetItem.asset.id === id);
      const folderIndex = subFoldersViewList.results.findIndex((folder) => folder.id === id);

      if (folderIndex !== -1) {
        if (subFoldersViewList.results[folderIndex]?.isSelected) {
          setSelectedAllSubFoldersAndAssets(false);
        }
        setSelectedAllSubAssets(false);
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
        setSelectedAllSubFoldersAndAssets(false);
        if (subFoldersAssetsViewList.results[assetIndex]?.isSelected) {
          setSelectedAllSubAssets(false);
        }
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
      setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace);
      setLoading(false);
    } catch (err) {
      setLoading(false);

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

  const viewFolder = async (id: string, subCollection: boolean, nestedSubFolderId = "", folderName = "") => {
    if (!subCollection) {
      if (nestedSubFolderId) {
        await getSubCollectionsFolderData(true, 50, nestedSubFolderId);
      }
      setActiveFolder(id);
      setActiveSubFolders("");
      setHeaderName(
        folderName ? folderName : subFoldersViewList.results.find((folder: any) => folder.id === id)?.name || "",
      );
    } else {
      setActiveFolder("");
      setActiveSubFolders(id);
      setHeaderName(folderName ? folderName : folders.find((folder: any) => folder.id === id)?.name || "");
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

  const assetGridWrapperStyle =
    !!folderInfo.singleSharedCollectionId || activeSortFilter.mainFilter === "folders"
      ? styles["col-wrapperview"]
      : styles["col-wrapper"];

  const headingClick = () => {
    setActiveFolder("");
    setActiveSubFolders("");
    getFolderInfo();
  };

  const closeSearchOverlay = () => {
    getAssets();
    setActiveSearchOverlay(false);
  };

  const getSidebarRender = () => {
    if (
      !(
        folderInfo?.singleSharedCollectionId &&
        (folderInfo?.sharedFolder?.parentId || subFoldersViewList.results.length === 0)
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {!loading && (
        <main
          className={`${sidebarOpen ? (getSidebarRender() ? styles["container"] : styles["containerPortal"]) : styles["rightToggle"]
            } sharefolderOuter`}
        >
          {getSidebarRender() && sidebarOpen && (
            <div className={`${styles["sidenav-main-wrapper"]}`}>
              <NestedFirstlist sharePath={sharePath} />
              <SharedPageSidenav viewFolder={viewFolder} headingClick={headingClick} sharePath={sharePath} />
            </div>
          )}
          <TopBar
            activeSearchOverlay={activeSearchOverlay}
            activeSortFilter={activeSortFilter}
            setActiveSortFilter={setActiveSortFilter}
            activeView={activeView}
            setActiveView={setActiveView}
            setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
            selectAll={selectAll}
            sharedAdvanceConfig={user ? undefined : advancedConfig}
            isFolder={activeSortFilter.mainFilter === "folders"}
            sharePath={sharePath}
            activeFolder={activeFolder}
            closeSearchOverlay={closeSearchOverlay}
            mode={activeMode}
            renderSidebar={getSidebarRender()}
            isShare={true}
          />
          <div
            className={`${assetGridWrapperStyle} ${sidebarOpen && getSidebarRender() ? styles["mainContainer"] : styles["toggleContainer"]
              } `}
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
