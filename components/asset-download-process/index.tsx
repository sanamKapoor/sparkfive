import clsx from 'clsx';
import { Line } from 'rc-progress';
import { useContext } from 'react';

import { AssetContext } from '../../context';
import styles from './index.module.css';

const AssetDownloadProcess = () => {
  const {
    downloadingPercent,
    downloadingStatus,
    updateDownloadingStatus,
    totalDownloadingAssets,
    downloadingError,
  } = useContext(AssetContext);

  return (
    <div
      className={clsx(styles.container, {
        [styles['center-align']]: downloadingStatus === 'done',
        [styles['less-margin-bottom']]:
          downloadingStatus === 'zipping' || downloadingStatus === 'preparing',
        [styles['err']]: downloadingStatus === 'error',
      })}
    >
      <div className={clsx(styles.row, styles['no-margin'])}>
        <div className={styles.zipheading}>
          <div className={styles.zipheadingInner}>
            <div className={styles.preHeading}>
              {(downloadingStatus === 'zipping' ||
                downloadingStatus === 'preparing') && (
                <>
                  <span className={styles['no-wrap-text']}>
                    Preparing download
                  </span>
                  <div>
                    <strong>Estimated Time:</strong> less than a minute
                  </div>
                </>
              )}
            </div>
            {downloadingStatus === 'done' && (
              <span className={styles['no-wrap-text']}>Download ready</span>
            )}
            {downloadingStatus === 'error' && (
              <span className={styles['no-wrap-text']}>
                {downloadingError ? downloadingError : 'Something went wrong'}
              </span>
            )}
          </div>

          {downloadingStatus === 'zipping' && (
            <div className={styles['processing-file-count']}>
              Zipping {totalDownloadingAssets} assets
            </div>
          )}
        </div>

        {(downloadingStatus === 'done' || downloadingStatus === 'error') && (
          <div
            className={styles['close-button']}
            onClick={() => {
              updateDownloadingStatus('none', 0, 0, '');
            }}
          >
            x
          </div>
        )}

        {(downloadingStatus === 'zipping' ||
          downloadingStatus === 'preparing') && (
          <Line
            percent={downloadingPercent}
            strokeWidth={1}
            style={{ height: '10px', width: '100%' }}
            strokeColor="#fff"
            trailColor={'#9597a6'}
          />
        )}
      </div>
    </div>
  );
};

export default AssetDownloadProcess;
