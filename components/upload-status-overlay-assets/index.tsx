import {useContext, useState} from 'react'
import { AssetContext } from '../../context'
import styles from './index.module.css'

import update from 'immutability-helper'

// Components
import AssetItem from './asset-item'
import Button from '../common/buttons/button'

import teamApi from '../../server-api/team'


const UploadStatusOverlayAssets = ({ closeOverlay }) => {

  const { assets, uploadingAssets, setUploadingAssets, reUploadAsset, activeFolder, folderGroups } = useContext(AssetContext)
  // Get fail uploading assets
  const [failUploadingAssets, setFailUploadingAssets] = useState(uploadingAssets.filter(asset => asset.status === 'fail'))

  const selectedAssets = failUploadingAssets.filter(asset => asset.isSelected)
  let totalSelectAssets = failUploadingAssets.length;

  const toggleSelected = (asset) => {
    const index = uploadingAssets.findIndex(assetItem => assetItem.asset.name === asset.name)

    setUploadingAssets(update(uploadingAssets, {
      [index]: {
        isSelected: { $set: !uploadingAssets[index].isSelected }
      }
    }))
  }

  const selectAll = () => {
    setFailUploadingAssets(failUploadingAssets.map(assetItem => ({ ...assetItem, isSelected: true })))
  }

  const deselectAll = () => {
    setFailUploadingAssets(failUploadingAssets.map(assetItem => ({ ...assetItem, isSelected: false })))
  }

  // Close search modal
  const closeUploadDetailModal = () => {
    // Reset all value
    closeOverlay();
  }

  const getAdvanceConfigurations = async () => {
    const { data } = await teamApi.getAdvanceOptions()
    return data
  }

  const onRetry = async (index) => {
    let size = 0;
    // Calculate the rest of size
    uploadingAssets.map((asset)=>{
      size += asset.asset.size
    })

    // Get team advance configurations first
    const { subFolderAutoTag } =  await getAdvanceConfigurations();

    // Start to upload assets
    reUploadAsset(0, uploadingAssets, assets, size, [uploadingAssets[index]], activeFolder, folderGroups, subFolderAutoTag)

    closeOverlay();
  }

  const onBulkRetry = async () => {
    const selectedAssets = failUploadingAssets.filter((asset)=>asset.isSelected)

    let totalSize = 0;
    // Calculate the rest of size
    uploadingAssets.map((asset)=>{
      totalSize += asset.asset.size
    })

    // Get team advance configurations first
    const { subFolderAutoTag } =  await getAdvanceConfigurations();

    // Start to upload assets
    reUploadAsset(0, uploadingAssets, assets, totalSize, selectedAssets, activeFolder, folderGroups, subFolderAutoTag)

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
          {failUploadingAssets.map((assetItem, index) => (
            <AssetItem
              key={index}
              toggleSelected={() => toggleSelected(assetItem.asset)}
              assetItem={assetItem}
              onRetry={()=>{onRetry(assetItem.index)}}
            />
          ))}
        </ul>
      </div>
    </div >
  )
}

export default UploadStatusOverlayAssets
