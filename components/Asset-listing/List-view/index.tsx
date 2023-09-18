import React from "react";
import styles from "./index.module.css";
import { Utilities } from "../../../assets";
import CollectionHeader from "./all-collection-header";
import CollectionData from "./all-collection-data";
import AssetHeader from "./asset-listing-header";
import AssetData from "./asset-listing-data";

const AssetListVIew = () => {
  return (
    <>
      <table className={`${styles["table-head"]}`}>
  <AssetHeader/>
    <AssetData/>
    </table>
    </>
  );
};
export default AssetListVIew;
