import Tag from "../common/misc/tag";
import React, { useContext } from "react";

import styles from "./face-recognition-filter-tag.module.css";

import { FilterContext, UserContext, AssetContext } from "../../context";

export default function FaceRecognitionFilterTag() {
  const { activeSortFilter, setActiveSortFilter } = useContext(FilterContext);

  const onClear = () => {
    setActiveSortFilter({ ...activeSortFilter, filterFaceRecognitions: [] });
  };

  return (
    <div className={styles.container}>
      {activeSortFilter.filterFaceRecognitions?.map((face: any, index: number) => {
        return (
          <div key={index}>
            <Tag
              data={face}
              tag={face.name}
              canRemove={true}
              removeFunction={() => {}}
              altColor={"blue"}
              wrapperClass={styles.tag}
            />

            <div
              className={styles["clear-text"]}
              onClick={() => {
                onClear();
              }}
            >
              Clear all
            </div>
          </div>
        );
      })}
    </div>
  );
}
