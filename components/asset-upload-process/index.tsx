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
    } = useContext(AssetContext)

    const uploadedAssets = uploadingAssets.filter(asset => asset.status === 'done')
    const failAssetsCount = uploadingAssets.filter(asset => asset.status === 'fail').length

    return <div className={clsx(styles.container, {[styles['center-align']]: uploadingStatus === 'done'})}>
        <div className={clsx(styles.row, styles['no-margin'])}>
            {uploadingStatus === 'uploading' && <>
                <span>{uploadingAssets[uploadingFile].asset.name}</span>
                <span>{uploadingFile+1} of {uploadingAssets.length} assets</span>
                <span>{uploadRemainingTime}</span>
            </>}
            {uploadingStatus === 'done' &&
                <span>{uploadedAssets.length} assets uploaded successfully.
                    {failAssetsCount > 0 && <span>{failAssetsCount} failed</span>}
                </span>
            }
            {uploadingStatus === 'done' && <span className={styles['underline-text']} onClick={()=>{setUploadDetailOverlay(true)}}>See detail</span>}
        </div>
        {uploadingStatus === 'done' && <div className={styles['close-button']} onClick={()=>{showUploadProcess('none')}}>
            x
        </div>}
        {uploadingStatus === 'uploading' && <Line percent={uploadingPercent} strokeWidth={1} strokeColor="#fff" trailColor={"#9597a6"}/>}

    </div>
}

export default AssetUploadProcess;
