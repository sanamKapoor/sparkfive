//🚧 work in progress 🚧
import React, { useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import {
  IAttribute,
  IAttributeValue,
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
  const [values, setValues] = useState<IAttributeValue[]>([]);

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

  /** TODO: 1. check for permission and custom restrictions
   * 2. Check for share pages
   *
   **/
  const onAttributeClick = async (data: IAttribute) => {
    let values: IAttributeValue[] = [];

    setActiveAttribute(data.name);
    setContentType("list");
    //TODO: define pre-defined attrs as ENUMS
    if (data.type === "pre-defined") {
      if (data.id === "tags") {
        const res = await tagsApi.getTags({ includeAi: false });
        values = res.data;
      } else if (data.id === "aiTags") {
        const res = await tagsApi.getTags({ includeAi: true });
        values = res.data.filter((tag) => tag.type === "AI");
      } else if (data.id === "campaigns") {
        const res = await campaignApi.getCampaigns();
        values = res.data;
      } else if (data.id === "products") {
        //TODO
      } else if (data.id === "fileTypes") {
        const res = await filterApi.getAssetFileExtensions();
        values = res.data;
      } else if (data.id === "lastUpdated") {
        //TODO
      } else if (data.id === "dateUploaded") {
        //TODO
      } else if (data.id === "orientation") {
        const res = await filterApi.getAssetOrientations();
        values = res.data;
      } else if (data.id === "resolution") {
        setContentType("resolutions");
        const res = await filterApi.getAssetResolutions();
        values = res.data;
      } else if (data.id === "dimensions") {
        setContentType("dimensions");
        const res = await filterApi.getAssetDimensionLimits();
        values = res.data;
      }
    } else {
      setContentType("list");
      const res = await customFieldsApi.getCustomFieldWithCount(data.id, {
        assetsCount: "yes",
      });
      console.log("res: ", res.data);
      values = res.data;
    }
    setValues(values);
    setShowAttrValues(true);
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
