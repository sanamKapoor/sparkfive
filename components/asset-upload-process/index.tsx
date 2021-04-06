import {useContext} from "react"
import { Line } from 'rc-progress'
import clsx from "clsx";

import styles from './index.module.css'


import { AssetContext } from '../../context'

const AssetUploadProcess = () => {
    const {
        uploadingAssets,
        uploadingStatus,
        showUploadProcess,
        uploadingFile,
        uploadRemainingTime,
        uploadingPercent,
        setUploadDetailOverlay,
        uploadingFileName
    } = useContext(AssetContext)

    const uploadedAssets = uploadingAssets.filter(asset => asset.status === 'done')
    const failAssetsCount = uploadingAssets.filter(asset => asset.status === 'fail').length

    return <div className={clsx(styles.container, {[styles['center-align']]: uploadingStatus === 'done', [styles['less-margin-bottom']]: uploadingStatus === 'uploading'})}>
        <div className={clsx(styles.row, styles['no-margin'])}>
            {uploadingStatus === 'uploading' && <>
            <span>{uploadingFileName}</span>
            {!isNaN(uploadingFile) && <span>{uploadingFile+1} of {uploadingAssets.length} assets</span>}
                <span>{uploadRemainingTime}</span>
            </>}
            {uploadingStatus === 'done' &&
                <span>{uploadedAssets.length} assets uploaded successfully.
                    {failAssetsCount > 0 && <span className={styles['fail-text']}>{failAssetsCount} failed</span>}
                </span>
            }
            {uploadingStatus === 'done' && failAssetsCount > 0 && <span className={styles['underline-text']} onClick={()=>{setUploadDetailOverlay(true)}}>See detail</span>}
        </div>
        {uploadingStatus === 'done' && <div className={styles['close-button']} onClick={()=>{showUploadProcess('none')}}>
            x
        </div>}
        {uploadingStatus === 'uploading' && <Line percent={uploadingPercent} strokeWidth={1} strokeColor="#fff" trailColor={"#9597a6"}/>}

    </div>
}

export default AssetUploadProcess;
