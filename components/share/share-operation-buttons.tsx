import styles from "./share-operation-buttons.module.css"

import Button from "../common/buttons/button"

const ShareOperationButtons = ({ selectAll, selectedAsset, downloadSelectedAssets }: Props) => {
    return <div className={styles.container}>
        <span className={styles['files-shared']}>
            2 Files Shared - Bossco Supply Inc
        </span>
        <div>
            {selectedAsset > 0 &&
                <Button className={styles.download} text={'Download'} type='button' styleType='outlined' onClick={downloadSelectedAssets} />
            }
            <Button className={styles.deselectAll} text={selectedAsset ? `Deselect All (${selectedAsset})` : `Select All`} type='button' styleType='primary' onClick={selectAll} />
        </div>
    </div>

}

interface Props {
    downloadSelectedAssets: () => void
    selectAll: () => void
    selectedAsset: number
}

export default ShareOperationButtons
