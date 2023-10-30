import { useState } from "react";
import {
  FilterAttributeVariants,
  IAttribute,
  IFilterAttributeValues,
} from "../interfaces/filters";

import { getFilterKeyForAttribute } from "../utils/filter";

import { filterKeyMap } from "../config/data/filter";
import customFieldsApi from "../server-api/attribute";
import campaignApi from "../server-api/campaign";
import filterApi from "../server-api/filter";
import tagsApi from "../server-api/tag";

const useFilters = (activeSortFilter) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(
    null
  );

  const [values, setValues] = useState<IFilterAttributeValues>([]);

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
    setActiveAttribute,
    setValues,
    values,
  };
};

export default useFilters;
