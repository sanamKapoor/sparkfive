import { useEffect, useState } from "react";
import {
  FilterAttributeVariants,
  IAttribute,
  IFilterAttributeValues,
  ISelectedFilter,
} from "../interfaces/filters";

import { getFilterKeyForAttribute } from "../utils/filter";

import {
  filterKeyMap,
  initialActiveSortFilters,
  labelKeyMap,
} from "../config/data/filter";
import customFieldsApi from "../server-api/attribute";
import campaignApi from "../server-api/campaign";
import filterApi from "../server-api/filter";
import tagsApi from "../server-api/tag";

const useFilters = (attributes, activeSortFilter, setActiveSortFilter) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(
    null
  );

  const [values, setValues] = useState<IFilterAttributeValues[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<unknown>([...values]);
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);

  const getSelectedFilters = () => {
    const filters = activeSortFilter;

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
      } else if (
        key.includes("dimensionWidth") ||
        key.includes("dimensionHeight")
      ) {
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
  };

  useEffect(() => {
    getSelectedFilters();
  }, [activeSortFilter]);

  const fetchValues = async (
    id: keyof typeof filterKeyMap,
    fetchFunction: () => Promise<any>,
    keysToFilter: string[]
  ) => {
    let fetchedValues = await fetchFunction();

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

      if (activeSortFilter[filterKey]?.length > 0) {
        fetchedValues = fetchedValues.map((item) => ({
          ...item,
          isSelected: keysToFilter?.some((key) => {
            if (key === "id") {
              return activeSortFilter[filterKey]?.some(
                (filter) => filter.id === item.id
              );
            }
            return activeSortFilter[filterKey]?.some(
              (filter) => filter[key] === item[key]
            );
          }),
        }));
      }
    }

    return fetchedValues;
  };

  const getCustomInitialFilters = () => {
    const customAttributes = attributes.filter(
      (attr) => attr.type === "custom"
    );

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

  /** // TODO:
   * 1. Check filters on share landing page
   **/
  const onAttributeClick = async (data: IAttribute) => {
    try {
      setLoading(true);

      setActiveAttribute(data);
      let values: IFilterAttributeValues = [];

      switch (data.id) {
        case FilterAttributeVariants.TAGS:
          values = await fetchValues(data.id, fetchTags, ["id"]);
          break;

        case FilterAttributeVariants.AI_TAGS:
          values = await fetchValues(data.id, fetchAITags, ["id"]);
          break;

        case FilterAttributeVariants.CAMPAIGNS:
          values = await fetchValues(data.id, fetchCampaigns, ["id"]);
          break;

        case FilterAttributeVariants.FILE_TYPES:
          values = await fetchValues(data.id, fetchAssetFileExtensions, [
            "value",
          ]);
          break;

        case FilterAttributeVariants.ORIENTATION:
          values = await fetchValues(data.id, fetchAssetOrientations, [
            "value",
          ]);
          break;

        case FilterAttributeVariants.RESOLUTION:
          values = await fetchAssetResolutions();
          break;

        case FilterAttributeVariants.DIMENSIONS:
          values = await fetchValues(data.id, fetchAssetDimensionLimits, []);
          break;

        case FilterAttributeVariants.LAST_UPDATED:
          values = activeSortFilter?.lastUpdated || [];
          break;

        case FilterAttributeVariants.DATE_UPLOADED:
          values = activeSortFilter?.dateUploaded || [];
          break;

        case FilterAttributeVariants.PRODUCTS:
          values = await fetchValues(data.id, fetchProductSku, ["id"]);
          break;

        default:
          values = await fetchValues(data.id, () => fetchCustomField(data.id), [
            "id",
          ]);
      }

      setValues(values);
      setFilteredOptions(values);
    } catch (err) {
      console.log("[FILTER_DROPDOWN]: ", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async (params?: { includeAi?: boolean; type?: string }) => {
    const res = await tagsApi.getTags({ ...params });
    return res.data;
  };

  const fetchAITags = async () => {
    return fetchTags({ includeAi: true });
  };

  const fetchProductSku = async () => {
    return fetchTags({ type: "sku" });
  };

  const fetchCampaigns = async () => {
    const res = await campaignApi.getCampaigns();
    return res.data;
  };

  const fetchAssetFileExtensions = async () => {
    const res = await filterApi.getAssetFileExtensions();
    return res.data;
  };

  const fetchAssetOrientations = async () => {
    const res = await filterApi.getAssetOrientations();
    return res.data;
  };

  const fetchAssetResolutions = async () => {
    const res = await filterApi.getAssetResolutions();
    return res.data;
  };

  const fetchAssetDimensionLimits = async () => {
    const res = await filterApi.getAssetDimensionLimits();
    return res.data;
  };

  const fetchCustomField = async (customFieldId: string) => {
    const res = await customFieldsApi.getCustomFieldWithCount(customFieldId, {
      assetsCount: "yes",
    });
    return res.data;
  };
  return {
    activeAttribute,
    filteredOptions,
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
