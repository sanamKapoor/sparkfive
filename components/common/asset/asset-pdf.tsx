import styles from "./asset-pdf.module.css";
import React, { useState } from 'react';

const AssetPdf = ({
  asset
}) => {
  const url = encodeURI(`${process.env.SERVER_BASE_URL}/assets/cdn/${asset.storageId}`)
  const [file, setFile] = useState(url);

  return (
    <div className={`${styles["pdf-container"]}`}>
      <iframe src={file}></iframe>
    </div>
  );
};

export default AssetPdf;
