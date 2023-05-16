import React, { Children, useState } from "react";
import Autocomplete from "react-autocomplete";
import AssetIcon from "../asset/asset-icon";
import assetApi from "../../../server-api/asset";

import classes from "./search-thumbnail.module.css";
import styles from "../modals/change-thumnail-modal.module.css";

const SearchThumbnail = ({
  onUpload,
  index,
  fileInputRef,
  folderId,
  thumbnailState,
  setThumbnailState,
}) => {
  const [value, setValue] = useState("");
  const [searchData, setSearchData] = useState([]);

  const [searching, setSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  const handleChange = async (e) => {
    const currentValue = e.target.value;

    setValue(currentValue);

    if (currentValue.length === 0) {
      setIsSearched(false);
      setSearchData([]);
    } else if (currentValue.length >= 2) {
      const queryParams = {
        term: currentValue,
        page: 1,
        sharePath: currentValue,
        advSearchFrom: "folders.name",
        folderId,
      };

      try {
        // TODO: optimize this api call (debounce)
        // * make api call to search assets based on value
        const { data } = await assetApi.searchAssets(queryParams);
        setSearchData(data.results);
        setIsSearched(true);
        setSearching(false);
        console.log("search data: ", searchData);
      } catch (err) {
        console.log("err: ", err);
        setSearching(false);
      }
    }
  };

  const handleSelection = (e) => {
    const data = JSON.parse(e);
    if (index === "0") {
      setThumbnailState({
        ...thumbnailState,
        name: data.name,
        src: data.value,
        isEmpty: false,
        isChanging: false,
        mode: "URL",
        data,
      });
    } else {
      const localThumbnailsCopy = [...thumbnailState];
      const findThumbnail = thumbnailState.findIndex(
        (thumb) => thumb.index === index
      );
      if (findThumbnail !== -1) {
        localThumbnailsCopy[findThumbnail] = {
          index,
          src: data.value,
          name: data.name,
          isEmpty: false,
          isChanging: false,
          mode: "URL",
          data,
        };
      }

      setThumbnailState(localThumbnailsCopy);
    }
  };

  return (
    <div className={classes.wrapper}>
      {index !== "0" && <p>{index}</p>}
      <Autocomplete
        getItemValue={(item) => JSON.stringify(item)}
        items={
          searching
            ? [{ name: "0", value: "0" }]
            : searchData.length == 0 && isSearched
            ? [{ name: "1", value: "1" }]
            : searchData.map((ele: any) => ({
                name: ele.asset.name,
                value: ele.thumbailUrl,
                extension: ele.asset.extension,
                storageId: ele.asset.storageId,
              }))
        }
        value={value}
        renderItem={(item, isHighlighted) => {
          if (item.name == "0") {
            return (
              <div
                className={styles.disaplay_box_item}
                style={{
                  pointerEvents: "none",
                  cursor: "not-allowed",
                }}
              >
                <br />
                <span className={styles.heading}>Searching...</span>
              </div>
            );
          } else if (item.name == "1") {
            return (
              <div
                className={styles.disaplay_box_item}
                style={{
                  pointerEvents: "none",
                  cursor: "not-allowed",
                }}
              >
                <br />
                <span className={styles.heading}>No Result Found.</span>
              </div>
            );
          } else {
            return (
              <div className={styles.disaplay_box_item}>
                {item.value !== "" ? (
                  <img src={item.value} alt="" className={styles.imgicon} />
                ) : (
                  <div className={styles.imgicon}>
                    <AssetIcon extension={item.extension} />
                  </div>
                )}
                <span className={styles.heading}>{item.name}</span>
              </div>
            );
          }
        }}
        onChange={handleChange}
        onSelect={handleSelection}
        menuStyle={{
          minWidth: "180px",
          borderRadius: "3px",
          boxShadow: "#f7ebdc",
          background: "#f7ebdc",
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "185px",
          maxWidth: "358px",
          margin: "0px 10px 0px 0px",
          left: "auto",
          top: "auto",
          zIndex: "500",
          position: "fixed",
          width: "100%",
        }}
      />

      <p style={{ margin: "0 16px 0 0" }}>or</p>
      <label
        onChange={onUpload}
        htmlFor={`upload-file-${index}`}
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #dedad4",
          borderRadius: "4px",
          background: "rgba(255, 255, 255, 0.38)",
          padding: "8px 16px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <input
          name=""
          type="file"
          id={`upload-file-${index}`}
          hidden
          ref={fileInputRef}
        />
        Upload Image
      </label>
    </div>
  );
};

export default SearchThumbnail;
