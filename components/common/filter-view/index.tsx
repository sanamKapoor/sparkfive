//🚧 work in progress 🚧
import React, { useContext, useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import {
  FilterAttributeVariants,
  IAttribute,
  IAttributeValue,
  IFilterAttributeValues,
  IFilterPopupContentType,
} from "../../../interfaces/filters";
import customFieldsApi from "../../../server-api/attribute";
import campaignApi from "../../../server-api/campaign";
import filterApi from "../../../server-api/filter";
import tagsApi from "../../../server-api/tag";
import teamApi from "../../../server-api/team";

import { FilterContext } from "../../../context";
import FilterOptionPopup from "../filter-option-popup";
import styles from "./index.module.css";

const FilterView = () => {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const [attrs, setAttrs] = useState<IAttribute[]>([]);
  const [values, setValues] = useState<IFilterAttributeValues>([]);

  const [contentType, setContentType] =
    useState<IFilterPopupContentType>("list");
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);

  console.log("activeSortFilter: ", activeSortFilter);
  //TODO: move it to parent level
  const getAttributes = async () => {
    try {
      const res = await teamApi.getTeamAttributes();
      setAttrs(res.data.data);
    } catch (err) {
      console.log("[GET_ATTRIBUTES]: ", err);
    }
  };

  //TODO: move it to parent level
  useEffect(() => {
    getAttributes();
  }, []);

  /** // TODO:
   * 1. Handle setting of activeSortFilter on selection/ deselection of values
   * 2. check for permission and custom restrictions for individual filter attributes
   * 3. Check for share pages
   * 4. check advancedConfiguration -> hideFilterElements
   **/
  const onAttributeClick = async (data: IAttribute) => {
    try {
      setLoading(true);
      let values: IFilterAttributeValues = [];
      let contentType: IFilterPopupContentType = "list";

      setActiveAttribute(data);

      switch (data.id) {
        case FilterAttributeVariants.TAGS:
          values = await fetchTags();
          break;

        case FilterAttributeVariants.AI_TAGS:
          values = await fetchAITags();
          values = (values as IAttributeValue[])?.filter(
            (tag) => tag.type === "AI"
          );
          break;

        case FilterAttributeVariants.CAMPAIGNS:
          values = await fetchCampaigns();
          break;

        case FilterAttributeVariants.FILE_TYPES:
          values = await fetchAssetFileExtensions();
          break;

        case FilterAttributeVariants.ORIENTATION:
          values = await fetchAssetOrientations();
          break;

        case FilterAttributeVariants.RESOLUTION:
          contentType = "resolutions";
          values = await fetchAssetResolutions();
          break;

        case FilterAttributeVariants.DIMENSIONS:
          contentType = "dimensions";
          values = await fetchAssetDimensionLimits();
          break;

        case FilterAttributeVariants.LAST_UPDATED:
          contentType = "lastUpdated";
          values = [];
          break;

        case FilterAttributeVariants.DATE_UPLOADED:
          contentType = "dateUploaded";
          values = [];
          break;

        case FilterAttributeVariants.PRODUCTS:
          contentType = "products";
          const sku = await fetchProductSku();
          values = {
            sku,
          };
          break;

        default:
          values = await fetchCustomField(data.id);
      }

      setValues((prev) => {
        setContentType(contentType);
        return values;
      });
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

  return (
    <div>
      <div className={`${styles["outer-wrapper"]}`}>
        {attrs.map((attr) => {
          return (
            <div key={attr.id}>
              <div
                className={`${styles["inner-wrapper"]}`}
                onClick={(e) => {
                  onAttributeClick(attr);
                }}
              >
                {attr.name}
                <img
                  className={`${styles["arrow-down"]}`}
                  src={Utilities.downIcon}
                  alt=""
                />
              </div>
              {activeAttribute !== null && activeAttribute?.id === attr.id && (
                <FilterOptionPopup
                  activeAttribute={activeAttribute}
                  setActiveAttribute={setActiveAttribute}
                  options={values}
                  contentType={contentType}
                  loading={loading}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterView;
