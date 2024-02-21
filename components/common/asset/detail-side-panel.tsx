// External
import { format } from "date-fns";
import filesize from "filesize";
import { useContext } from "react";
import React from "react";

import { AssetContext } from "../../../context";
import { getParsedExtension } from "../../../utils/asset";
// @ts-ignore
import styles from "./detail-side-panel.module.css";
import RecognitionUser from "./recognition-user";

interface Asset {
  id: string;
  name: string;
  type: string;
  thumbailUrl: string;
  realUrl: string;
  extension: string;
  version: number;
}
interface Item {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sharePath: null;
  sharePassword: null;
  shareStatus: null;
  status: string;
  thumbnailPath: null;
  thumbnailExtension: null;
  thumbnails: null;
  thumbnailStorageId: null;
  thumbnailName: null;
  assetsCount: string;
  assets: Asset[];
  size: string;
  length: number;
  parentId: string | null;
}

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const SidePanel = ({ asset, isShare, closeOverlay }: Props) => {
  const { createdAt, fileModifiedAt, extension, dimension, size, dpi } = asset;

  const {
    subFoldersAssetsViewList: { results: subcollectionAssets, next: nextAsset, total: totalAssets },
  } = useContext(AssetContext);

  let formattedDimension;
  if (dimension) {
    const [width, height] = dimension.split(",");
    if (!isNaN(width) || !isNaN(height)) {
      formattedDimension = `${width} x  ${height} px`;
    }
  }

  let formattedDPI;
  if (dpi !== 0) {
    formattedDPI = dpi + " DPI";
  } else {
    formattedDPI = "";
  }

  const fieldValues = [
    {
      field: "Last Updated",
      value: fileModifiedAt ? format(new Date(fileModifiedAt), "P") : "",
    },
    {
      field: "Uploaded",
      value: format(new Date(createdAt), "P"),
    },
    // {
    //   field: 'Type',
    //   value: capitalCase(type)
    // },
    {
      field: "Extension",
      value: getParsedExtension(extension),
    },
    {
      field: "Resolution",
      value: formattedDPI,
    },
    {
      field: "Dimension",
      value: formattedDimension,
    },
    {
      field: "Size",
      value: filesize(size),
    },
  ];

  return (
    <>
      <div className={` ${!isShare ? styles.fieldWrapper : styles.shareWrapper}`}>
        <h2 className={styles["details-heading"]}>Details</h2>

        <div className={styles["first-section"]}>
          {fieldValues.map((fieldvalue) => (
            <div className={styles["field-wrapper"]} key={fieldvalue.field}>
              <div className={`secondary-text ${styles.field}`}>{fieldvalue.field}</div>
              <div className={`normal-text ${styles["meta-text"]}`}>{fieldvalue.value}</div>
            </div>
          ))}
          {asset.facialUser && <RecognitionUser user={asset.facialUser} onApplyFilter={closeOverlay} asset={asset} />}
        </div>
      </div>
    </>
  );
};

interface Props {
  asset: any;
  isShare: boolean;
  closeOverlay: () => void;
}

export default SidePanel;
