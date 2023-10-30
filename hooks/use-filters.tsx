import { useEffect, useState } from "react";
import {
  FilterAttributeVariants,
  IAttribute,
  IFilterAttributeValues,
  ISelectedFilter,
} from "../interfaces/filters";

import { getFilterKeyForAttribute } from "../utils/filter";

import { filterKeyMap, initialActiveSortFilters } from "../config/data/filter";
import customFieldsApi from "../server-api/attribute";
import campaignApi from "../server-api/campaign";
import filterApi from "../server-api/filter";
import tagsApi from "../server-api/tag";

const useFilters = (attributes, activeSortFilter, setActiveSortFilter) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(
    null
  );

  const [values, setValues] = useState<IFilterAttributeValues>([]);
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);

  const getLabelForSelectedFilter = (key: string) => {
    const labelKeyMap = {
      filterProductSku: "sku",
      filterAiTags: "name",
      filterNonAiTags: "name",
      filterFileTypes: "value",
      lastUpdated: "label",
      dateUploaded: "label",
      filterOrientations: "name",
      filterResolutions: "dpi",
    };

    console.log("labelKeyMap[key]: ", labelKeyMap[key]);

    return labelKeyMap[key] ?? "name";
  };

  const getSelectedFilters = () => {
    const filters = activeSortFilter;

    const data: ISelectedFilter[] = [];

    //fetch the values against keys that include either 'custom-p' or 'filter'
    Object.keys(filters).map((key) => {
      if (key.includes("custom-p") || key.includes("filter")) {
        if (filters[key]?.length > 0) {
          console.log("filters key: ", filters[key]);
          console.log(key, "filters key");
          let filterValues = filters[key].map((item) => ({
            id: item.id ?? item.name ?? item.dpi,
            label: item[getLabelForSelectedFilter(key)],
            filterKey: key,
          }));
          data.push(filterValues);
        }
      } else if (
        key.includes("lastUpdated") ||
        key.includes("dateUploaded") ||
        key.includes("dimension")
      ) {
        const item = filters[key];
        if (item) {
          let filterValues = {
            id: item.id,
            label: item[getLabelForSelectedFilter(key)],
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

  // TODO
  const onRemoveFilter = (item: ISelectedFilter) => {
    console.log("item to be removed: ", item);
    if (item.filterKey === "lastUpdated" || item.filterKey === "dateUploaded") {
      setActiveSortFilter({
        ...activeSortFilter,
        [item.filterKey]: undefined,
      });
    } else if (
      item.filterKey === "filterFileTypes" ||
      item.filterKey === "filterOrientations"
    ) {
      const filterData = activeSortFilter[item.filterKey];
      const updatedFilterData = filterData.filter(
        (data) => data.name !== item.id
      );
      setActiveSortFilter({
        ...activeSortFilter,
        [item.filterKey]: updatedFilterData,
      });
    } else if (item.filterKey === "filterResolutions") {
      const filterData = activeSortFilter[item.filterKey];
      const updatedFilterData = filterData.filter(
        (data) => data.dpi !== item.id
      );
      setActiveSortFilter({
        ...activeSortFilter,
        [item.filterKey]: updatedFilterData,
      });
    } else {
      const filterData = activeSortFilter[item.filterKey];
      const updatedFilterData = filterData.filter(
        (data) => data.id !== item.id
      );
      setActiveSortFilter({
        ...activeSortFilter,
        [item.filterKey]: updatedFilterData,
      });
    }
  };

  /** // TODO:
   * 1. Check filters on share landing page
   **/
  const onAttributeClick = async (data: IAttribute) => {
    console.log("data: ", data);
    try {
      setLoading(true);

      setActiveAttribute(data);
      let values: IFilterAttributeValues = [];

      switch (data.id) {
        case FilterAttributeVariants.TAGS:
          values = await fetchValues(data.id, fetchTags, ["id"]);
          console.log("values: ", values);
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
          values = await fetchAssetDimensionLimits();
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
    loading,
    onAttributeClick,
    onClearAll,
    onRemoveFilter,
    selectedFilters,
    setActiveAttribute,
    setValues,
    values,
  };
};

export default useFilters;
