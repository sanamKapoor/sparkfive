import { useContext } from "react";
import { Line } from "rc-progress";
import clsx from "clsx";

import styles from "./index.module.css";

import { AssetContext } from "../../context";
import React from "react";
import { Utilities } from "../../assets";

const AssetUploadProcess = () => {
  const {
    uploadingAssets,
    uploadingStatus,
    showUploadProcess,
    uploadingFile,
    uploadRemainingTime,
    uploadingPercent,
    setUploadDetailOverlay,
    uploadingFileName,
    dropboxUploadingFile,
    uploadSourceType,
    uploadingType,
    retryListCount,
    folderImport,
  } = useContext(AssetContext);

  const uploadedAssets = uploadingAssets.filter(
    (asset) => asset.status === "done"
  );
  const failAssetsCount = uploadingAssets.filter(
    (asset) => asset.status === "fail"
  ).length;

  // return <div className={clsx(styles.container, {[styles['center-align']]: uploadingStatus === 'done', [styles['less-margin-bottom']]: uploadingStatus === 'uploading'})}>
  //     <div className={clsx(styles.row, styles['no-margin'])}>
  //         {(uploadingStatus === 'uploading' || uploadingStatus === 're-uploading') && <>
  //         <span>
  //             {<span className={styles['no-wrap-text']}>
  //                 {uploadingFileName}
  //             </span>
  //             }
  //         </span>

  //         {uploadSourceType !== 'dropbox' && !isNaN(uploadingFile) &&
  //         <span className={styles['processing-file-count']}>{uploadingFile+1} of {uploadingStatus === 're-uploading' ? retryListCount : uploadingAssets.length} assets</span>}
  //         </>}

  //         {(!folderImport && (uploadingStatus === 'uploading' || uploadingStatus === 're-uploading')) && <>
  //             {uploadSourceType === 'dropbox' && !isNaN(dropboxUploadingFile) &&
  //             <span className={styles['processing-file-count']}>{dropboxUploadingFile+1} of {uploadingAssets.length} assets</span>}
  //         </>}

  //         {uploadingStatus === 'done' &&
  //             <span>{uploadingType==='version' ? 'Recent version ' : (uploadedAssets.length + ' assets')} uploaded successfully.
  //                 {failAssetsCount > 0 && <span className={`${styles['fail-text']} ${styles['no-max-min-width']}`}>{failAssetsCount} failed</span>}
  //             </span>
  //         }
  //         {uploadingStatus === 'done' && failAssetsCount > 0 && <span className={`${styles['underline-text']} ${styles['no-max-min-width']}`} onClick={()=>{setUploadDetailOverlay(true)}}>See detail</span>}
  //     </div>
  //     {uploadingStatus === 'done' && <div className={styles['close-button']} onClick={()=>{showUploadProcess('none')}}>
  //         x
  //     </div>}
  //     {(uploadingStatus === 'uploading' || uploadingStatus === 're-uploading') && <Line percent={uploadingPercent} strokeWidth={1} strokeColor="#fff" trailColor={"#9597a6"}/>}

  // </div>
  return (
    <div className={styles.uploadingContainer}>
      <div className={styles.uploadHeader}>
        <div className={styles.mainHeading}>Uploading 2 of 30 assets</div>
        <div className={styles.subHeading}>
          Estimated Time: Less than 1 minute
        </div>
        <img src={Utilities.blueClose} alt={"close"} className={styles.closebtn} />
      </div>
      <div className={styles.innerUploadList}>
        
        <div className={styles.uploadItem}>
          <div>AdobeStock_362573241.jpeg</div>
          {/* <div>Complete</div>
          <div className={styles.flexdiv}><img src={Utilities.checkMark} alt={"complete"} /></div>
          <div>Retry</div> */}
          <div className={styles.lineBar}>
            <Line percent={uploadingPercent} strokeWidth={1} strokeColor="#E5E5E5" style={{ width: '158px', height: '12px' }} trailColor={"#9597a6"}/>
             65%
            </div>
        </div>        
      </div>
    </div>
  );
};

export default AssetUploadProcess;
