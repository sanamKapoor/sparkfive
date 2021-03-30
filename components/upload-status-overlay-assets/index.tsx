import {  useContext } from 'react'
import { AssetContext } from '../../context'
import styles from './index.module.css'

import update from 'immutability-helper'

// Components
import AssetItem from './asset-item'
import Button from '../common/buttons/button'


const UploadStatusOverlayAssets = ({ closeOverlay }) => {

  const { assets, uploadingAssets, setUploadingAssets, reUploadAsset } = useContext(AssetContext)

  const selectedAssets = uploadingAssets.filter(asset => asset.isSelected)
  let totalSelectAssets = selectedAssets.length;

  // Get fail uploading assets
  const failUploadingAssets = uploadingAssets.filter(asset => asset.status === 'fail')

  const toggleSelected = (asset) => {
    const index = uploadingAssets.findIndex(assetItem => assetItem.asset.name === asset.name)

    setUploadingAssets(update(uploadingAssets, {
      [index]: {
        isSelected: { $set: !uploadingAssets[index].isSelected }
      }
    }))
  }

  const selectAll = () => {
    setUploadingAssets(uploadingAssets.map(assetItem => ({ ...assetItem, isSelected: true })))
  }

  const deselectAll = () => {
    setUploadingAssets(uploadingAssets.map(assetItem => ({ ...assetItem, isSelected: false })))
  }

  // Close search modal
  const closeUploadDetailModal = () => {
    // Reset all value
    closeOverlay();
  }

  const retryUpload = () => {

  }

  const onRetry = async (index) => {
    // Start to upload assets
    reUploadAsset(0, uploadingAssets, assets, uploadingAssets[index].asset.size, [uploadingAssets[index]])

    closeOverlay();
  }

  const onBulkRetry = async () => {
    const selectedAssets = uploadingAssets.filter((asset)=>asset.isSelected)

    let totalSize = 0;
    selectedAssets.map((asset)=>{
      totalSize+=asset.asset.size
    })
    // Start to upload assets
    reUploadAsset(0, uploadingAssets, assets, totalSize, selectedAssets)

    closeOverlay();
  }


  return (
    <div className={`app-overlay search-container`}>
      <div className={'search-top'}>
        <div className={'search-close'} onClick={closeUploadDetailModal}>
          <span className={'search-x'}>X</span>
          <span>esc</span>
        </div>
      </div>
      <div className={'search-content'}>
        <h2 >
          Upload Details
        </h2>
        <div className={styles.operations}>
          <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />
          {selectedAssets.length > 0 && <Button text={`Deselect All (${totalSelectAssets})`} type='button' styleType='primary' onClick={deselectAll} />}
          {selectedAssets.length > 0 && <Button text={`Retry (${totalSelectAssets})`} type='button' styleType='primary' onClick={onBulkRetry}/>}
          <span className={styles['select-only-shown-items-text']}>{uploadingAssets.length - failUploadingAssets.length} out of {uploadingAssets.length} successfully uploaded. {failUploadingAssets.length} errors</span>
        </div>
        <ul className={'search-content-list'}>
          <li className={`search-item ${styles['search-item']}`}>
            <div className={`${styles['select-wrapper']}`} />
            <div className={`${styles.name}`}>
              Name
            </div>
            <div className={styles.type}>
              Type
            </div>
            <div className={styles.type}>
              Size
            </div>
            <div className={`${styles['upload-error']}`}>
              Upload Error
            </div>
            <div className={styles.button}>
              <Button type='button' text='Retry' styleType='primary'/>
            </div>
          </li>
          {uploadingAssets.map((assetItem, index) => (
            <AssetItem
              key={index}
              toggleSelected={() => toggleSelected(assetItem.asset)}
              assetItem={assetItem}
              onRetry={()=>{onRetry(index)}}
            />
          ))}
        </ul>
      </div>
    </div >
  )
}

export default UploadStatusOverlayAssets
