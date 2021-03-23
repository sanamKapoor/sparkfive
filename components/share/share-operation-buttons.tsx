import styles from "./share-operation-buttons.module.css"

import Button from "../common/buttons/button"

const ShareOperationButtons = ({ selectAll, selectedAsset, downloadSelectedAssets }: Props) => {
    return  <div className={styles.container}>
        {selectedAsset && <span className={styles['download-text']} onClick={downloadSelectedAssets}>Download</span>}
        <Button text={selectedAsset ? `Deselect All (${selectedAsset})` : `Select All`} type='button' styleType='primary' onClick={selectAll}/>
    </div>

}

interface Props{
    downloadSelectedAssets: () => void
    selectAll: () => void
    selectedAsset: number
}

export default ShareOperationButtons
