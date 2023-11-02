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
import Badge from "../UI/Badge/badge";
import FilterOptionPopup from "../filter-option-popup";
import styles from "./index.module.css";

const FilterView = () => {
  const [attrs, setAttrs] = useState<IAttribute[]>([]);
  const [values, setValues] = useState<IFilterAttributeValues>([]);

  const [contentType, setContentType] =
    useState<IFilterPopupContentType>("list");
  const [activeAttribute, setActiveAttribute] = useState<IAttribute | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);
  const { activeSortFilter, setRenderedFlag } = useContext(FilterContext);

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
    setRenderedFlag(true)
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
          if (activeSortFilter?.filterNonAiTags?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter.filterNonAiTags.find(
                (filter) => filter.id === item.id
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
          break;

        case FilterAttributeVariants.AI_TAGS:
          values = await fetchAITags();
          values = (values as IAttributeValue[])?.filter(
            (tag) => tag.type === "AI"
          );
          if (activeSortFilter?.filterAiTags?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter.filterAiTags.find(
                (filter) => filter.id === item.id
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
          break;

        case FilterAttributeVariants.CAMPAIGNS:
          values = await fetchCampaigns();
          if (activeSortFilter?.filterCampaigns?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter.filterCampaigns.find(
                (filter) => filter.id === item.id
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
          break;

        case FilterAttributeVariants.FILE_TYPES:
          contentType = "fileTypes";
          values = await fetchAssetFileExtensions();
          if (activeSortFilter?.filterFileTypes?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter.filterFileTypes.find(
                (filter) => filter.value === item.name
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
          break;

        case FilterAttributeVariants.ORIENTATION:
          contentType = "orientation";
          values = await fetchAssetOrientations();
          if (activeSortFilter?.filterOrientations?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter.filterOrientations.find(
                (filter) => filter.value === item.name
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
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
          values = activeSortFilter?.lastUpdated;
          break;

        case FilterAttributeVariants.DATE_UPLOADED:
          contentType = "dateUploaded";
          values = activeSortFilter?.dateUploaded;
          break;

        case FilterAttributeVariants.PRODUCTS:
          contentType = "products";
          const sku = await fetchProductSku();
          values = sku;
          if (activeSortFilter?.filterProductSku?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter.filterProductSku.find(
                (filter) => filter.id === item.id
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
          break;

        default:
          const filterKey = `custom-p${data.id}`;
          values = await fetchCustomField(data.id);
          if (activeSortFilter[filterKey]?.length > 0) {
            values = values.map((item) => {
              const itemExists = activeSortFilter[filterKey]?.find(
                (filter) => filter.id === item.id
              );
              if (itemExists) {
                return {
                  ...item,
                  isSelected: true,
                };
              } else {
                return { ...item, isSelected: false };
              }
            });
          }
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

  //TODO
  const getFilterKeyForActiveAttribute = (id: string) => {
    const newLocal = "coming inside......";
    console.log(newLocal);
    let key;

    if (id === "tags") key = "filterNonAiTags";
    else if (id === "aiTags") key = "filterAiTags";
    else if (id === "campaigns") key = "filterCampaigns";
    else if (id === "fileTypes") key = "filterFileTypes";
    else key = `custom-p${id}`;

    return key;
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
                {/* TODO */}
                {activeSortFilter[getFilterKeyForActiveAttribute(attr.id)]
                  ?.length > 0 &&
                  attr.id !== FilterAttributeVariants.DATE_UPLOADED &&
                  attr.id !== FilterAttributeVariants.LAST_UPDATED &&
                  attr.id !== FilterAttributeVariants.DIMENSIONS && (
                    <Badge
                      count={
                        activeSortFilter[
                          getFilterKeyForActiveAttribute(attr.id)
                        ]?.length
                      }
                    />
                  )}
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
                  setOptions={setValues}
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
