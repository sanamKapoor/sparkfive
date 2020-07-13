import styles from './asset-grid.module.css'
import useDropzone from '../misc/dropzone'
import { useEffect, useContext, useState } from 'react'
import { AssetContext } from '../../../context'

// Components
import FolderGridItem from '../folder/folder-grid-item'
import FolderListItem from '../folder/folder-list-item'
import AssetThumbail from './asset-thumbail'
import ListItem from './list-item'
import AssetUpload from './asset-upload'
import ConfirmModal from '../modals/confirm-modal'

import assetsApi from '../../../server-api/asset'


const AssetGrid = ({ activeView = 'grid', onFilesDataGet, toggleSelected, mode = 'assets', folders = [], viewFolder = (id) => { } }) => {

  const isDragging = useDropzone()
  const { assets, setAssets } = useContext(AssetContext)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [archiveModalOpen, setArchiveModalOpen] = useState(false)
  const [activeAssetId, setActiveAssetId] = useState('')

  const openArchiveAsset = id => {
    setActiveAssetId(id)
    setArchiveModalOpen(true)
  }
  
  const openDeleteAsset = id => {
    setActiveAssetId(id)
    setDeleteModalOpen(true)
  }

  const deleteAsset = async id => {
    try {
      await assetsApi.deleteAsset(id)
    }
    catch (err) {
      // TODO: Error handling
    }
  }
  
  const archiveAsset = async id => {
    try {
      await assetsApi.updateAsset(id, {stage: 'archived'})
    }
    catch (err) {
      // TODO: Error handling
    }
  }
  
  return (
    <section className={styles.container}>
      {(assets.length === 0 || isDragging) &&
        <AssetUpload
          onDragText={'Drop files here to upload'}
          preDragText={assets.length === 0 ? `Drag 'n' drop some files here` : ''}
          onFilesDataGet={onFilesDataGet} />
      }
      <div className={styles['list-wrapper']}>
        {activeView === 'grid' &&
          <ul className={styles['grid-list']}>
            {mode === 'assets' && assets.map((assetItem) => {
              return (
                <li className={styles['grid-item']} key={assetItem.asset.id}>
                  <AssetThumbail 
                    {...assetItem} 
                    toggleSelected={() => toggleSelected(assetItem.asset.id)}
                    openArchiveAsset={() => openArchiveAsset(assetItem.asset.id)}
                    openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                  />
                </li>
              )
            })}

            {mode === 'folders' && folders.map((folder) => {
              return (
                <li className={styles['grid-item']} key={folder.id}>
                  <FolderGridItem {...folder} viewFolder={() => viewFolder(folder.id)} />
                </li>
              )
            })}
          </ul>
        }
        {activeView === 'list' &&
          <ul className={'regular-list'}>
            {mode === 'assets' && assets.map((assetItem, index) => {
              return (
                <li className={styles['regular-item']} key={index}>
                  <ListItem 
                    assetItem={assetItem}
                    index={index}
                  />
                </li>
              )
            })}
            {mode === 'folders' && folders.map((folder) => {
              return (
                <li className={styles['grid-item']} key={folder.id}>
                  <FolderListItem {...folder} viewFolder={() => viewFolder(folder.id)} />
                </li>
              )
            })}
          </ul>
        }
      </div>
      {/* Delete modal */}
      <ConfirmModal
        closeModal={() => setDeleteModalOpen(false)}
        confirmAction={() => {
          deleteAsset(activeAssetId)
          setActiveAssetId('')
          setDeleteModalOpen(false)
        }}
        confirmText={'Delete'}
        message={
          <span>
            Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this asset?
        </span>
        }
        modalIsOpen={deleteModalOpen}
      />

      {/* Archive modal */}
      <ConfirmModal
        closeModal={() => setArchiveModalOpen(false)}
        confirmAction={() => {
          archiveAsset(activeAssetId)
          setActiveAssetId('')
          setArchiveModalOpen(false)
        }}
        confirmText={'Archive'}
        message={
          <span>
            Are you sure you want to &nbsp;<strong>Archive</strong>&nbsp; this asset?
        </span>
        }
        modalIsOpen={archiveModalOpen}
      />
    </section >
  )
}

export default AssetGrid