import {useContext} from "react"
import { Line } from 'rc-progress'
import clsx from "clsx";

import styles from './index.module.css'


import { AssetContext } from '../../context'

const AssetDownloadProcess = () => {
    const {
        downloadingPercent,
        downloadingStatus,
        updateDownloadingStatus,
        totalDownloadingAssets,
        downloadingError
    } = useContext(AssetContext)


    return <div className={clsx(styles.container, {[styles['center-align']]: downloadingStatus === 'done', [styles['less-margin-bottom']]: downloadingStatus === 'zipping'})}>
        <div className={clsx(styles.row, styles['no-margin'])}>
            {
                downloadingStatus === 'zipping' && <>
                        <span>
                            {<span className={styles['no-wrap-text']}>
                                Preparing download
                            </span>
                            }
                        </span>
                    </>
            }

            {
                downloadingStatus === 'zipping' &&
                <span className={styles['processing-file-count']}>Zipping {totalDownloadingAssets} assets</span>
            }

            {downloadingStatus === 'done' && <span>Download ready</span>}

            {downloadingStatus === 'error' && <span>{downloadingError}</span>}

            {(downloadingStatus === 'done' || downloadingStatus === 'error') &&
                <div className={styles['close-button']} onClick={()=>{updateDownloadingStatus('none', 0, 0, '')}}>
                    x
                </div>
            }

            {downloadingStatus === 'zipping' && <Line percent={downloadingPercent} strokeWidth={1} strokeColor="#fff" trailColor={"#9597a6"}/>}
        </div>

    </div>
}

export default AssetDownloadProcess;
