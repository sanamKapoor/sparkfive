// I heard this component is used for old shared-links but I have not found such shared-links yet.
// That might have in production. Not sure though, so let's keep this component.

import update from "immutability-helper";
import { useRouter } from "next/router";
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
import SearchOverlay from "../main/search-overlay-assets";
import PasswordOverlay from "./password-overlay";

import selectOptions from "../../utils/select-options";

// Utils
import { getSubdomain } from "../../utils/domain";
import Spinner from "../common/spinners/spinner";

import { loadTheme } from "../../utils/theme";

const ShareCollectionMain = () => {
  const router = useRouter();

  const {
    assets,
    setAssets,
    setPlaceHolders,
    setActivePageMode,
    needsFetch,
    setNeedsFetch,
    addedIds,
    setAddedIds,
    nextPage,
    selectAllAssets,
    setFolders,
    activeFolder,
    setActiveFolder,
    folders,
    selectAllFolders,
  } = useContext(AssetContext);

  const { user, advancedConfig, setAdvancedConfig } = useContext(UserContext);

  const { folderInfo, setFolderInfo } = useContext(ShareContext);

  const { activeSortFilter, setActiveSortFilter, setSharePath: setContextPath } = useContext(FilterContext);

  const [firstLoaded, setFirstLoaded] = useState(false);
  const [activePasswordOverlay, setActivePasswordOverlay] = useState(true);
  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false);
  const [activeView, setActiveView] = useState("grid");
  const [sharePath, setSharePath] = useState("");
  const [activeMode, setActiveMode] = useState("assets");
  const [loading, setLoading] = useState(true);

  const [top, setTop] = useState("calc(55px + 3rem)");

  const processSubdomain = () => {
    return getSubdomain() || "danner";
  };

  const submitPassword = async (password, email) => {
    try {
      const { data } = await folderApi.authenticateCollection({
        password,
        email,
        sharePath,
      });
      // Set axios headers
      requestUtils.setAuthToken(data.token, "share-authorization");

      getShareInfo(true);
    } catch (err) {
      console.log(err);
      toastUtils.error("Wrong password or invalid link, please try again");
    }
  };

  useEffect(() => {
    if (needsFetch === "assets") {
      getAssets();
    } else if (needsFetch === "folders") {
      getFolders();
    }
    setNeedsFetch("");
  }, [needsFetch]);

  // Get share info
  const getShareInfo = async (displayError = false) => {
    try {
      const { data } = await shareCollectionApi.getFolderInfo({ sharePath });

      setFolderInfo(data);
      setAdvancedConfig(data.customAdvanceOptions);
      setActivePasswordOverlay(false);

      loadTheme();
      setLoading(false);
    } catch (err) {
      // If not 500, must be auth error, request user password
      if (err.response.status !== 500) {
        setFolderInfo(err.response.data);
        setActivePasswordOverlay(true);
      }
      console.log(err);
      if (displayError) {
        toastUtils.error("Wrong email/password or invalid link, please try again");
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const { asPath } = router;
    // TODO: Optimize exact path
    const splitPath = asPath.split("/collections/");

    const idPath = splitPath[1].split("/");

    if (idPath && !idPath[0].includes("[team]") && !idPath[1].includes("[id]")) {
      const path = `${processSubdomain()}/${idPath[1]}/${idPath[0]}`;
      setSharePath(path);
      setContextPath(path);
    }
  }, [router.asPath]);

  useEffect(() => {
    if (sharePath && sharePath !== "[team]/[id]") {
      getShareInfo();
    }
  }, [sharePath]);

  const setInitialLoad = async (folderInfo) => {
    if (!firstLoaded && folderInfo) {
      setFirstLoaded(true);

      const mode = folderInfo.singleSharedCollectionId ? "all" : "folders";

      let sort = { ...activeSortFilter.sort };
      if (mode === "folders") {
        sort =
          folderInfo.customAdvanceOptions.collectionSortView === "alphabetical"
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
  }, [activeSortFilter, sharePath, folderInfo]);

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

  const selectAll = () => {
    if (activeMode === "assets") {
      // Mark select all
      selectAllAssets();

      setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: true })));
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
        ...getAssetsSort(activeSortFilter),
        sharePath,
      });
      setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace);
      setFirstLoaded(true);
    } catch (err) {
      //TODO: Handle error
      console.log(err);
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
      const { data } = await shareCollectionApi.getFolders(queryParams);

      let assetList = { ...data, results: data.results };

      setFolders(assetList, replace);
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
      let remValue = "3rem";
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

  return (
    <>
      {!loading && (
        <main className={styles.container}>
          <TopBar
            activeSortFilter={activeSortFilter}
            setActiveSortFilter={setActiveSortFilter}
            setActiveView={setActiveView}
            setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
            selectAll={selectAll}
            isShare={true}
            singleCollection={!!folderInfo.singleSharedCollectionId}
            sharedAdvanceConfig={user ? undefined : advancedConfig}
          />
          <div className={`${openFilter && styles["col-wrapper"]}`} style={{ marginTop: top }}>
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
              sharePath={sharePath}
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
      {activeSearchOverlay && !loading && (
        <SearchOverlay
          sharePath={sharePath}
          closeOverlay={closeSearchOverlay}
          activeFolder={activeFolder}
          activeMode={activeFolder}
          setActiveMode={setActiveMode}
        />
      )}
    </>
  );
};

export default ShareCollectionMain;
