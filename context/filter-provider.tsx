import { useContext, useState, useEffect, useRef } from "react";

import { AssetContext, FilterContext, UserContext } from "../context";

// APIs
import customFieldsApi from "../server-api/attribute";
import campaignApi from "../server-api/campaign";
import filterApi from "../server-api/filter";
import fodlerApi from "../server-api/folder";
import projectApi from "../server-api/project";
import shareCollectionApi from "../server-api/share-collection";
import tagApi from "../server-api/tag";

// Utils
import { useRouter } from "next/router";
import { DEFAULT_FILTERS, getAssetsFilters } from "../utils/asset";
import selectOptions from "../utils/select-options";

export default ({ children, isPublic = false }) => {
  const router = useRouter();
  const { activeFolder, setPlaceHolders } = useContext(AssetContext);
  const { advancedConfig } = useContext(UserContext);

  const [searchFilterParams, setSearchFilterParams] = useState({});

  const assetSort = advancedConfig.assetSortView === "newest" ? selectOptions.sort[1] : selectOptions.sort[3];

  const collectionSort =
    advancedConfig.collectionSortView === "alphabetical" ? selectOptions.sort[3] : selectOptions.sort[1];

  const [activeSortFilter, setActiveSortFilter] = useState<any>({
    sort: advancedConfig.defaultLandingPage === "allTab" ? assetSort : collectionSort,
    mainFilter: advancedConfig.defaultLandingPage === "allTab" ? "all" : "folders",
    ...DEFAULT_FILTERS,
    dimensionsActive: false,
    lastUpdated: undefined,
    dateUploaded: undefined,
  } as any);

  const preparingAssets = useRef(true);

  const [sharePath, setSharePath] = useState("");
  const [tags, setTags] = useState([]);
  const [customFields, setCustomFields] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [folders, setFolders] = useState([]);
  const [channels, setChannels] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [assetDimensionLimits, setAssetDimensionLimits] = useState({});
  const [assetOrientations, setAssetOrientations] = useState([]);
  const [assetResolutions, setAssetResolutions] = useState([]);
  const [productFields, setProductFields] = useState({
    categories: [],
    vendors: [],
    retailers: [],
    sku: [],
  });
  const [renderFlag, setRenderFlag] = useState(false);
  const [term, setTerm] = useState("");
  const [faceRecognitions, setFaceRecognitions] = useState([]);

  const loadAll = () => {
    loadTags();
    loadCampaigns();
    loadChannels();
    loadProjects();
    loadFileTypes();
    loadAssetDimensionLimits();
    loadAssetOrientations();
  };

  const loadFromEndpoint = async (fetchPromise, setMethod) => {
    try {
      const { data } = await fetchPromise;
      setMethod(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTags = (params?) => {
    const fetchMethod = isPublic ? shareCollectionApi.getTags : tagApi.getTags;
    let basicFilter = { assetsCount: "yes", sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }
    if (params && Object.keys(params).length) {
      Object.assign(basicFilter, params);
    }
    loadFromEndpoint(
      fetchMethod({
        ...basicFilter,
        ...getCommonParams(activeSortFilter.allNonAiTags !== "any"),
      }),
      setTags,
    );
  };

  const loadCustomFields = (id) => {
    return new Promise((resolve) => {
      const fetchMethod = isPublic ? shareCollectionApi.getCustomField : customFieldsApi.getCustomFieldWithCount;

      const setCustomFieldsValue = (values) => {
        if (typeof values === "object") {
          resolve(values);
        } else {
          resolve([]);
        }
      };

      let basicFilter = { assetsCount: "yes", sharePath };
      if (activeFolder) {
        // @ts-ignore
        basicFilter = { ...basicFilter, folderId: activeFolder };
      }

      loadFromEndpoint(
        fetchMethod(id, {
          ...basicFilter,
          ...getCommonParams(activeSortFilter[`all-p${id}`] !== "any"),
        }),
        setCustomFieldsValue,
      );
    });
  };

  const loadFolders = (ignoreCurrentSelectedFolder = false) => {
    const fetchMethod = fodlerApi.getFoldersSimple;
    let basicFilter = { assetsCount: "yes" };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }
    loadFromEndpoint(
      fetchMethod({
        ...basicFilter,
        ...getCommonParams(false, ignoreCurrentSelectedFolder),
      }),
      setFolders,
    );
  };

  const loadSharedFolders = (ignoreCurrentSelectedFolder = false, sharePath = "") => {
    const fetchMethod = shareCollectionApi.getFoldersSimple;
    let basicFilter = { assetsCount: "yes" };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }
    loadFromEndpoint(
      fetchMethod({
        ...basicFilter,
        ...getCommonParams(false, ignoreCurrentSelectedFolder),
        sharePath,
      }),
      setFolders,
    );
  };

  const loadAllFolders = () => {
    const fetchMethod = fodlerApi.getFoldersSimple;
    loadFromEndpoint(fetchMethod({ assetsCount: "yes", ...getCommonParams(), selectAll: 1 }), setFolders);
  };

  const loadCampaigns = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getCampaigns : campaignApi.getCampaigns;

    let basicFilter = { assetsCount: "yes", sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(
      fetchMethod({
        ...basicFilter,
        ...getCommonParams(activeSortFilter.allCampaigns !== "any"),
      }),
      setCampaigns,
    );
  };

  const loadChannels = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetChannels : filterApi.getAssetChannels;

    let basicFilter = { sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(fetchMethod({ ...basicFilter, ...getCommonParams() }), setChannels);
  };

  const loadProjects = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getProjects : projectApi.getProjects;

    let basicFilter = { assetsCount: "yes", sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(
      fetchMethod({
        ...basicFilter,
        ...getCommonParams(activeSortFilter.allProjects !== "any"),
      }),
      setProjects,
    );
  };

  const loadFileTypes = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetFileExtensions : filterApi.getAssetFileExtensions;

    let basicFilter = { sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(fetchMethod({ ...basicFilter, ...getCommonParams() }), setFileTypes);
  };

  const loadAssetDimensionLimits = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetDimensionLimits : filterApi.getAssetDimensionLimits;

    let basicFilter = { sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(fetchMethod({ ...basicFilter, ...getCommonParams() }), setAssetDimensionLimits);
  };

  const loadAssetOrientations = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetOrientations : filterApi.getAssetOrientations;

    let basicFilter = { sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(fetchMethod({ ...basicFilter, ...getCommonParams() }), setAssetOrientations);
  };

  const loadAssetResolutions = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetResolutions : filterApi.getAssetResolutions;

    let basicFilter = { sharePath };
    if (activeFolder) {
      // @ts-ignore
      basicFilter = { ...basicFilter, folderId: activeFolder };
    }

    loadFromEndpoint(fetchMethod({ ...basicFilter, ...getCommonParams() }), setAssetResolutions);
  };
  const loadProductFields = async () => {
    try {
      const fetchMethod = isPublic ? shareCollectionApi.getTags : tagApi.getTags;
      const { data: categories } = await fetchMethod({
        type: "product_category",
        sharePath,
        ...getCommonParams(),
      });
      const { data: vendors } = await fetchMethod({
        type: "product_vendor",
        sharePath,
        ...getCommonParams(),
      });
      const { data: retailers } = await fetchMethod({
        type: "product_retailer",
        sharePath,
        ...getCommonParams(),
      });
      const { data: sku } = await fetchMethod({
        type: "sku",
        sharePath,
        ...getCommonParams(),
      });
      setProductFields({
        categories,
        vendors,
        retailers,
        sku,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const isAnyAll = () => {
    const {
      allNonAiTags,
      allAiTags,
      allCampaigns,
      allProjects,
      filterCampaigns,
      filterNonAiTags,
      filterAiTags,
      filterProjects,
    } = activeSortFilter;

    const isAnyAllForCustomFields = () => {
      let check = false;

      // For custom fields
      Object.keys(activeSortFilter).map((key) => {
        // Custom fields key
        if (key.includes("custom-p")) {
          // Get all keys
          const index = key.split("custom-p")[1];

          if (activeSortFilter[`all-p${index}`] !== "any" && activeSortFilter[`custom-p${index}`].length > 0) {
            check = true;
          }
        }
      });

      return check;
    };

    return (
      (allNonAiTags !== "any" && filterNonAiTags.length > 0) ||
      (allAiTags !== "any" && allAiTags !== "any" && filterAiTags.length > 0) ||
      (allCampaigns !== "any" && filterCampaigns.length > 0) ||
      (allProjects !== "any" && filterProjects.length > 0) ||
      isAnyAllForCustomFields()
    );
  };

  const getCommonParams = (assetLim = false, ignoreCurrentSelectedFolder = false) => {
    const filterData = { ...activeSortFilter };

    // This ignore apply current folder filter to filter APIs. because in Collection views, just have folders, we want to select multiple without apply new filters
    if (ignoreCurrentSelectedFolder) {
      filterData.filterFolders = [];
    }
    const params = getAssetsFilters({
      replace: false,
      addedIds: [],
      nextPage: 0,
      userFilterObject: filterData,
    });
    if (assetLim || (isAnyAll() && anyFilters())) params.assetLim = "yes";
    return params;
  };

  const setRenderedFlag = (value: boolean) => {
    setRenderFlag(value);
  };

  const anyFilters = () => {
    const {
      filterCampaigns,
      filterChannels,
      filterNonAiTags,
      filterAiTags,
      filterFolders,
      filterProjects,
      filterFileTypes,
      filterOrientations,
      filterProductFields,
      filterProductType,
    } = activeSortFilter;

    // If if there is any custom fields filter has value
    const checkAnyCustomFieldsFilter = () => {
      let check = false;

      // For custom fields
      Object.keys(activeSortFilter).map((key) => {
        // Custom fields key
        if (key.includes("custom-p")) {
          // Get all keys
          const index = key.split("custom-p")[1];

          if (activeSortFilter[`custom-p${index}`].length > 0) {
            check = true;
          }
        }
      });

      return check;
    };

    if (filterCampaigns?.length > 0) return true;
    if (filterChannels?.length > 0) return true;
    if (filterNonAiTags?.length > 0) return true;
    if (filterAiTags?.length > 0) return true;
    if (filterFolders?.length > 0) return true;
    if (filterProjects?.length > 0) return true;
    if (filterFileTypes?.length > 0) return true;
    if (filterOrientations?.length > 0) return true;
    if (filterProductFields?.length > 0) return true;
    if (filterProductType?.length > 0) return true;
    if (checkAnyCustomFieldsFilter()) return true;
    return false;
  };

  const setSearchTerm = (value) => {
    setTerm(value);
  };

  // When tag, campaigns, collection changes, used for click on tag/campaigns/collection in admin attribute management
  useEffect(() => {
    if (!preparingAssets.current) return;
    if (!router.query.tag && !router.query.product && !router.query.collection && !router.query.campaign) {
      preparingAssets.current = false;
      return;
    }
    if (router.query.tag && !tags.length) {
      setPlaceHolders("asset", true);
      loadTags();
      return;
    }
    if (router.query.product && !productFields.sku.length) {
      setPlaceHolders("asset", true);
      loadProductFields();
      return;
    }

    if (router.query.collection && !folders.length) {
      setPlaceHolders("asset", true);
      loadFolders();
      return;
    }

    if (router.query.campaign && !campaigns.length) {
      setPlaceHolders("asset", true);
      loadCampaigns();
      return;
    }

    const newSortFilter: any = { ...activeSortFilter };

    if (router.query.campaign) {
      const foundCampaign = campaigns.find(({ name }) => name === router.query.campaign);
      if (foundCampaign) {
        newSortFilter.mainFilter = "all";

        newSortFilter.filterCampaigns = [
          {
            ...foundCampaign,
            value: foundCampaign.id,
          },
        ];
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }

    // Query folder
    if (router.query.collection) {
      const foundCollection = folders.find(({ name }) => name === router.query.collection);
      if (foundCollection) {
        newSortFilter.filterFolders = [
          {
            ...foundCollection,
            value: foundCollection.id,
          },
        ];
        newSortFilter.mainFilter = "folders";
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }

    if (router.query.product) {
      const foundProduct = productFields.sku.find(({ sku }) => sku === router.query.product);
      if (foundProduct) {
        newSortFilter.mainFilter = "all";

        newSortFilter.filterProductSku = [
          {
            ...foundProduct,
            value: foundProduct.sku,
          },
        ];
      }
      preparingAssets.current = false;
      setActiveSortFilter(newSortFilter);
      return;
    }

    if (router.query.tag) {
      setRenderedFlag(true);
      const foundTag = tags.find(({ name }) => name === router.query.tag);
      if (foundTag) {
        newSortFilter.mainFilter = "all";

        newSortFilter.filterNonAiTags = [
          {
            ...foundTag,
            value: foundTag.id,
          },
        ];
      }
      preparingAssets.current = false;

      setActiveSortFilter(newSortFilter);
      return;
    }
  }, [tags, productFields.sku, folders, campaigns]);

  const filterValue = {
    loadAll,
    tags,
    loadTags,
    customFields,
    loadCustomFields,
    setCustomFields,
    campaigns,
    loadCampaigns,
    channels,
    loadChannels,
    projects,
    loadProjects,
    fileTypes,
    loadFileTypes,
    assetDimensionLimits,
    loadAssetDimensionLimits,
    assetOrientations,
    loadAssetOrientations,
    productFields,
    loadProductFields,
    folders,
    loadFolders,
    loadAllFolders,
    activeSortFilter,
    setActiveSortFilter,
    setSharePath,
    term,
    setSearchTerm,
    isPublic,
    sharePath,
    loadAssetResolutions,
    assetResolutions,
    loadSharedFolders,
    searchFilterParams,
    setSearchFilterParams,
    setRenderedFlag,
    renderFlag,
    preparingAssets,
  };

  return <FilterContext.Provider value={filterValue}>{children}</FilterContext.Provider>;
};
