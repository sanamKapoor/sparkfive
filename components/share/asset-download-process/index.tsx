
import { Line } from 'rc-progress'
import clsx from "clsx";

import styles from './index.module.css'


const AssetDownloadProcess = (props) => {
    const {
        downloadingPercent,
        downloadingStatus,
        onClose,
        downloadingError = "",
        selectedAsset = 0
    } = props


    return <div className={clsx(styles.container, {
        [styles['center-align']]: downloadingStatus === 'done',
        [styles['less-margin-bottom']]: (downloadingStatus === 'zipping' || downloadingStatus === 'preparing')
    })}>
        <div className={clsx(styles.row, styles['no-margin'])}>
            {
                (downloadingStatus === 'zipping' || downloadingStatus === 'preparing') && <>
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
                <span className={styles['processing-file-count']}>Zipping {selectedAsset} assets</span>
            }

            {downloadingStatus === 'done' && <span>Download ready</span>}

            {downloadingStatus === 'error' && <span>{downloadingError}</span>}

            {(downloadingStatus === 'done' || downloadingStatus === 'error') &&
                <div className={styles['close-button']} onClick={onClose}>
                    x
                </div>
            }

            {(downloadingStatus === 'zipping' || downloadingStatus === 'preparing')  && <Line percent={downloadingPercent} strokeWidth={1} strokeColor="#fff" trailColor={"#9597a6"}/>}
        </div>

    </div>
}

export default AssetDownloadProcess;
