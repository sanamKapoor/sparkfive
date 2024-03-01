import { useContext, useEffect, useState } from "react";
import { FilterAttributeVariants, IAttribute, IFilterAttributeValues, ISelectedFilter } from "../interfaces/filters";

import { getFilterKeyForAttribute } from "../utils/filter";

import { filterKeyMap, initialActiveSortFilters, labelKeyMap } from "../config/data/filter";
import { AssetContext, FilterContext } from "../context";
import customFieldsApi from "../server-api/attribute";
import campaignApi from "../server-api/campaign";
import filterApi from "../server-api/filter";
import shareCollectionApi from "../server-api/share-collection";
import tagsApi from "../server-api/tag";

import { getAssetsFilters } from "../utils/asset";

const useFilters = (attributes: any, setRender: any = null) => {
  const { activeSortFilter, setActiveSortFilter, sharePath, isPublic } = useContext(FilterContext);
  const { activeFolder, activeSubFolders } = useContext(AssetContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(null);

  const [values, setValues] = useState<IFilterAttributeValues[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<unknown>([]);
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);

  const getSelectedFilters = () => {
    const filters: any = activeSortFilter;

    const data: ISelectedFilter[] = [];

    Object.keys(filters).map((key) => {
      if (key.includes("custom-p") || key.includes("filter")) {
        if (filters[key]?.length > 0) {
          let filterValues = filters[key].map((item) => ({
            id: item.id ?? item.name ?? item.dpi,
            label: item[labelKeyMap[key]] ?? item["name"],
            filterKey: key,
          }));
          data.push(filterValues);
        }
      } else if (key.includes("lastUpdated") || key.includes("dateUploaded")) {
        const item = filters[key];
        if (item) {
          let filterValues = {
            id: item.id,
            label: item[labelKeyMap[key]] ?? item["name"],
            filterKey: key,
          };
          data.push(filterValues);
        }
      } else if (key.includes("dimensionWidth") || key.includes("dimensionHeight")) {
        const item = filters[key];
        if (item) {
          let filterValues = {
            id: key,
            label: `${key.split("dimension")[1]}: ${item.min} - ${item.max}`,
            filterKey: key,
          };
          data.push(filterValues);
        }
      }
    });

    setSelectedFilters(data.flat(1));
    if (setRender) {
      setTimeout(() => {
        setRender((prev: any) => !prev);
      }, 100);
    }
  };

  useEffect(() => {
    getSelectedFilters();
  }, [activeSortFilter]);

  const fetchValues = async (
    id: keyof typeof filterKeyMap,
    fetchFunction: (params?: Record<string, unknown>) => Promise<any>,
    keysToFilter: string[],
  ) => {
    let type, hasProducts;

    if (activeSortFilter.mainFilter === "images") {
      type = "image";
    } else if (activeSortFilter.mainFilter === "videos") {
      type = "video";
    } else if (activeSortFilter.mainFilter === "product") {
      hasProducts = "product";
    }

    const params = {
      assetsCount: "yes",
      sharePath,
      ...((activeSubFolders || activeFolder) && {
        folderId: activeSubFolders || activeFolder,
      }),
      ...(type && { type }),
      assetLim: "yes",
      ...(hasProducts && { hasProducts }),
      ...getAssetsFilters({
        replace: false,
        addedIds: [],
        nextPage: 0,
        userFilterObject: { ...activeSortFilter },
      }),
    };

    let fetchedValues = await fetchFunction({ ...params });

    if (id === "dimensions") {
      fetchedValues = {
        dimensionWidth: {
          min: fetchedValues.minWidth,
          max: fetchedValues.maxWidth,
        },
        dimensionHeight: {
          min: fetchedValues.minHeight,
          max: fetchedValues.maxHeight,
        },
      };
      if (activeSortFilter["dimensionWidth"]) {
        fetchedValues = {
          ...fetchedValues["dimensionHeight"],
          dimensionWidth: activeSortFilter["dimensionWidth"],
        };
      }
      if (activeSortFilter["dimensionHeight"]) {
        fetchedValues = {
          ...fetchedValues["dimensionWidth"],
          dimensionHeight: activeSortFilter["dimensionHeight"],
        };
      }
    } else {
      const filterKey = getFilterKeyForAttribute(id);
      // fetchedValues = fetchedValues.filter((item) => Number(item.count) !== 0);

      if (activeSortFilter[filterKey]?.length > 0) {
        fetchedValues = fetchedValues.map((item) => ({
          ...item,
          isSelected: keysToFilter?.some((key) => {
            if (key === "id") {
              return activeSortFilter[filterKey]?.some((filter) => filter.id === item.id);
            }
            return activeSortFilter[filterKey]?.some((filter) => filter[key] === item[key]);
          }),
        }));
      }
    }

    return fetchedValues;
  };

  const getCustomInitialFilters = () => {
    const customAttributes = attributes.filter((attr) => attr.type === "custom");

    const fields = {};

    customAttributes.forEach((attr) => {
      if (!fields[`custom-p${attr.id}`]) {
        fields[`custom-p${attr.id}`] = [];
      }

      if (!fields[`all-p${attr.id}`]) {
        fields[`all-p${attr.id}`] = "all";
      }
    });

    return fields;
  };

  const onClearAll = () => {
    setActiveSortFilter({
      ...activeSortFilter,
      ...initialActiveSortFilters,
      ...getCustomInitialFilters(),
    });
  };

  const onRemoveFilter = (item: ISelectedFilter) => {
    const filterKey = item.filterKey;
    const filterData = activeSortFilter[filterKey];

    const updateFilter = (data, filterKey: string, item) => {
      switch (filterKey) {
        case "lastUpdated":
        case "dateUploaded":
        case "dimensionWidth":
        case "dimensionHeight":
          return undefined;
        case "filterFileTypes":
        case "filterOrientations":
          return data.filter((entry) => entry.name !== item.id);
        case "filterResolutions":
          return data.filter((entry) => entry.dpi !== item.id);
        default:
          return data.filter((entry) => entry.id !== item.id);
      }
    };

    const updatedData = updateFilter(filterData, filterKey, item);

    setActiveSortFilter({ ...activeSortFilter, [filterKey]: updatedData });
  };

  const fetchValuesById = async (id: string) => {
    let values: IFilterAttributeValues = [];
    setLoading(true);

    try {
      switch (id) {
        case FilterAttributeVariants.TAGS:
          values = await fetchValues(id, fetchTags, ["id"]);
          break;

        case FilterAttributeVariants.AI_TAGS:
          values = await fetchValues(id, fetchAITags, ["id"]);
          break;

        case FilterAttributeVariants.CAMPAIGNS:
          values = await fetchValues(id, fetchCampaigns, ["id"]);
          break;

        case FilterAttributeVariants.FILE_TYPES:
          values = await fetchValues(id, fetchAssetFileExtensions, ["name"]);
          break;

        case FilterAttributeVariants.ORIENTATION:
          values = await fetchValues(id, fetchAssetOrientations, ["name"]);
          break;

        case FilterAttributeVariants.RESOLUTION:
          values = await fetchValues(id, fetchAssetResolutions, ["dpi"]);
          values = values.map((item) => {
            if (item.dpi === "highres") {
              return {
                ...item,
                label: "All High-Res (above 250 DPI)",
              };
            } else {
              return {
                ...item,
                label: item.dpi,
              };
            }
          });
          break;

        case FilterAttributeVariants.DIMENSIONS:
          values = (await fetchValues(id, fetchAssetDimensionLimits, [])) || {
            dimensionWidth: activeSortFilter?.dimensionWidth,
            dimensionHeight: activeSortFilter?.dimensionHeight,
          };
          break;

        case FilterAttributeVariants.LAST_UPDATED:
          values = activeSortFilter?.lastUpdated || [];
          break;

        case FilterAttributeVariants.DATE_UPLOADED:
          values = activeSortFilter?.dateUploaded || [];
          break;

        case FilterAttributeVariants.PRODUCTS:
          values = await fetchValues(id, fetchProductSku, ["id"]);
          break;

        default:
          values = await fetchValues(id, (params) => fetchCustomField(id, params), ["id"]);
      }
      return values;
    } catch (err) {
      console.log("FETCHED_VALUES_BY_ID_ERR: ", err);
    } finally {
      setLoading(false);
    }
  };

  const onAttributeClick = async (data: IAttribute) => {
    setActiveAttribute(data);
    const values: any = await fetchValuesById(data.id);
    setValues(values);
    setFilteredOptions(values);
  };

  const fetchTags = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : tagsApi;

    const res = await fetchApi.getTags({ ...params, includeAi: true });
    return res.data?.filter((item) => item.type !== "AI");
  };

  const fetchAITags = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : tagsApi;

    const allTags = await fetchApi.getTags({ includeAi: true, ...params });
    return allTags?.data?.filter((item) => item.type === "AI");
  };

  const fetchProductSku = async (params?: Record<string, unknown>) => {
    return fetchTags({ type: "sku", ...params });
  };

  const fetchCampaigns = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : campaignApi;
    const res = await fetchApi.getCampaigns(params);
    return res.data;
  };

  const fetchAssetFileExtensions = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : filterApi;
    const res = await fetchApi.getAssetFileExtensions(params);
    return res.data;
  };

  const fetchAssetOrientations = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : filterApi;
    const res = await fetchApi.getAssetOrientations(params);
    return res.data;
  };

  const fetchAssetResolutions = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : filterApi;
    const res = await fetchApi.getAssetResolutions(params);
    return res.data;
  };

  const fetchAssetDimensionLimits = async (params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : filterApi;
    const res = await fetchApi.getAssetDimensionLimits(params);
    return res.data;
  };

  const fetchCustomField = async (customFieldId: string, params?: Record<string, unknown>) => {
    const fetchApi = isPublic ? shareCollectionApi : customFieldsApi;
    const res = await fetchApi.getCustomFieldWithCount(customFieldId, params);
    return res.data;
  };

  return {
    activeAttribute,
    filteredOptions,
    fetchValuesById,
    loading,
    onAttributeClick,
    onClearAll,
    onRemoveFilter,
    selectedFilters,
    setActiveAttribute,
    setFilteredOptions,
    setLoading,
    setValues,
    values,
  };
};

export default useFilters;
