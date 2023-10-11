//🚧 work in progress 🚧
import React, { useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import {
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

import FilterOptionPopup from "../filter-option-popup";
import styles from "./index.module.css";

const FilterView = () => {
  const [attrs, setAttrs] = useState<IAttribute[]>([]);
  const [values, setValues] = useState<IFilterAttributeValues>([]);

  const [showAttrValues, setShowAttrValues] = useState<boolean>(false);
  const [contentType, setContentType] =
    useState<IFilterPopupContentType>("list");
  const [activeAttribute, setActiveAttribute] = useState<string>("Tags");

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

  /** // TODO: 1. check for permission and custom restrictions for individual filter attributes
   * 2. Check for share pages
   * 3. add a loader for content
   * 4. Error Handling for all the api requests
   **/
  const onAttributeClick = async (data: IAttribute) => {
    let values: IFilterAttributeValues = [];
    let contentType: IFilterPopupContentType = "list";

    setActiveAttribute(data.name);

    switch (data.id) {
      case "tags":
        values = await fetchTags();
        break;
      case "aiTags":
        values = await fetchAITags();
        values = (values as IAttributeValue[])?.filter(
          (tag) => tag.type === "AI"
        );
        break;
      case "campaigns":
        values = await fetchCampaigns();
        break;
      case "fileTypes":
        values = await fetchAssetFileExtensions();
        console.log("val in fileTypes: ", values);
        break;
      case "orientation":
        values = await fetchAssetOrientations();
        break;
      case "resolution":
        contentType = "resolutions";
        values = await fetchAssetResolutions();
        break;
      case "dimensions":
        contentType = "dimensions";
        values = await fetchAssetDimensionLimits();
        break;

      case "lastUpdated":
        contentType = "lastUpdated";
        values = [];
        break;

      case "dateUploaded":
        contentType = "dateUploaded";
        values = [];
        break;

      case "products":
        contentType = "products";

        const categories = await fetchProductCategories();
        const vendors = await fetchProductVendors();
        const retailers = await fetchProductRetailers();
        const sku = await fetchProductSku();

        values = {
          categories,
          vendors,
          retailers,
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

    setShowAttrValues(true);
  };

  const fetchTags = async (params?: { includeAi?: boolean; type?: string }) => {
    const res = await tagsApi.getTags({ ...params });
    return res.data;
  };

  const fetchAITags = async () => {
    return fetchTags({ includeAi: true });
  };

  const fetchProductCategories = async () => {
    return fetchTags({ type: "product_category" });
  };

  const fetchProductVendors = async () => {
    return fetchTags({ type: "product_vendor" });
  };

  const fetchProductRetailers = async () => {
    return fetchTags({ type: "product_retailer" });
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
            </div>
          );
        })}
      </div>
      {showAttrValues && (
        <FilterOptionPopup
          activeAttribute={activeAttribute}
          options={values}
          contentType={contentType}
          setShowAttrValues={setShowAttrValues}
        />
      )}
    </div>
  );
};

export default FilterView;
