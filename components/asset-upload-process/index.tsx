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
        uploadingPercent
    } = useContext(AssetContext)

    const uploadedAssets = uploadingAssets.filter(asset => asset.status === 'done')
    const failAssetsCount = uploadingAssets.length - uploadedAssets.length

    return <div className={clsx(styles.container, {[styles['center-align']]: uploadingStatus === 'done'})}>
        <div className={clsx(styles.row, {[styles['no-margin']]: uploadingStatus === 'done'})}>
            {uploadingStatus === 'uploading' && <>
                <span>{uploadingAssets[uploadingFile].asset.name}</span>
                <span>{uploadingFile+1} of {uploadingAssets.length} assets</span>
                <span>{uploadRemainingTime} remaining</span>
            </>}
            {uploadingStatus === 'done' &&
                <span>{uploadedAssets.length} assets uploaded successfully.
                    {failAssetsCount > 0 && <span>{failAssetsCount} failed</span>}
                </span>
            }
            {uploadingStatus === 'done' && <span className={styles['underline-text']}>See detail</span>}
        </div>
        <div className={styles['close-button']} onClick={()=>{showUploadProcess('none')}}>
            x
        </div>
        {uploadingStatus === 'uploading' && <Line percent={uploadingPercent} strokeWidth={1} strokeColor="#00806e" trailColor={"#fff"}/>}

    </div>
}

export default AssetUploadProcess;
