import React from "react";
import styles from "./index.module.css";
import { Utilities, AppImg } from "../../../assets";
import { utimesSync } from "fs";
import IconClickable from "../../common/buttons/icon-clickable";
import SubCollectionHeader from "./sub-collection-header";
import SubCollectionData from "./sub-collection-data";
import AssetListVIew from "../../Asset-listing/List-view";
import SubCollectionHeading from "./sub-collection-heading";

const SubcollectionListView = () => {
  return (
    <>
    <SubCollectionHeading/>
     <table className={`${styles["table-head"]}`}>
      <SubCollectionHeader/>
      <SubCollectionData/>
    
     </table>
     <AssetListVIew/>

     
    </>
  );
};
export default SubcollectionListView;
