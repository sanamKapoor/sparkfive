//🚧 work in progress 🚧
import React, { useEffect, useState } from "react";

import { Utilities } from "../../../assets";
import { IAttribute } from "../../../interfaces/filters";
import tagsApi from "../../../server-api/tag";
import teamApi from "../../../server-api/team";

import IconClickable from "../buttons/icon-clickable";

const FilterView = () => {
  const [attrs, setAttrs] = useState<IAttribute[]>([]);
  const [values, setValues] = useState([]); //TODO: define type
  const [showAttrValues, setShowAttrValues] = useState<boolean>(false);

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

  const onAttributeClick = async (data: IAttribute) => {
    let values = [];

    if (data.type === "pre-defined") {
      if (data.id === "tags") {
        const res = await tagsApi.getTags({ includeAi: false });
        values = res.data;
      } else if (data.id === "aiTags") {
        const res = await tagsApi.getTags({ includeAi: true });
        values = res.data.filter((tag) => tag.type === "AI");
      } else {
      }
      console.log("handling pre-defined attributes..........");
    } else {
      console.log("handling custom attributes..........");
    }
    setValues(values);
    setShowAttrValues(true);
  };

  return (
    //TODO: move inline style to specific css module
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        paddingTop: "20px",
        gap: "10px",
      }}
    >
      {attrs.map((attr) => {
        return (
          <>
            <div
              key={attr.id}
              onClick={(e) => {
                onAttributeClick(attr);
              }}
            >
              {attr.name}
            </div>
            {/* //TODO: move inline style to specific css module */}
          </>
        );
      })}
      {showAttrValues && (
        <div
          style={{
            display: "block",
            background: "white",
            paddingTop: "20px",
          }}
        >
          <h1>Select Tags</h1>
          <input value="" placeholder="Search Tags...." />
          {values.map((value) => {
            return (
              <>
                <IconClickable src={Utilities.radioButtonNormal} />
                <span>{value.name}</span>
                <span>{value.count}</span>
                <></>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterView;
