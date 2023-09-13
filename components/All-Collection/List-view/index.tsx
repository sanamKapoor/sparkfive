import React from "react";
import styles from "./index.module.css";
import { Utilities } from "../../../assets";
import CollectionHeader from "./all-collection-header";
import CollectionData from "./all-collection-data";

const CollectionListVIew = () => {
  return (
    <>
      <table className={`${styles["table-head"]}`}>
    <CollectionHeader/>
    <CollectionData/>
    </table>
    </>
  );
};
export default CollectionListVIew;
