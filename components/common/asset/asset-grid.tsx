import styles from './asset-grid.module.css'
import useDropzone from '../misc/dropzone'
import update from 'immutability-helper'
import { useEffect, useContext, useState } from 'react'
import { AssetContext, UserContext } from '../../../context'
import toastUtils from '../../../utils/toast'
import { Waypoint } from 'react-waypoint'
import copyClipboard from 'copy-to-clipboard'
import urlUtils from '../../../utils/url'
import downloadUtils from '../../../utils/download'
import assetsApi from '../../../server-api/asset'

// Components
import AssetAddition from './asset-addition'
import FolderGridItem from '../folder/folder-grid-item'
import FolderListItem from '../folder/folder-list-item'
import AssetThumbail from './asset-thumbail'
import ListItem from './list-item'
import AssetUpload from './asset-upload'
import DetailOverlay from './detail-overlay'
import ConfirmModal from '../modals/confirm-modal'
import Button from '../buttons/button'
import useSortedAssets from '../../../hooks/use-sorted-assets'

const AssetGrid = ({
  activeView = 'grid',
  isShare = false,
  onFilesDataGet = (files) => { },
  toggleSelected,
  mode = 'assets',
  activeSortFilter = {},
  deleteFolder = (id) => { },
  itemSize = 'regular',
  activeFolder = '',
  type = '',
  itemId = '',
  getFolders = () => { },
  loadMore = () => { },
  viewFolder = (id) => { },
  sharePath = '',
  openFilter }) => {

  let isDragging
  if (!isShare) isDragging = useDropzone()
  const { assets, setAssets, setActiveOperation, setOperationAsset, nextPage, setOperationFolder, folders } = useContext(AssetContext)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [activeArchiveAsset, setActiveArchiveAsset] = useState(undefined)
  const [activeAssetId, setActiveAssetId] = useState('')

  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false)

  const [initAsset, setInitAsset] = useState(undefined)

  const [sortedAssets, currentSortAttribute, setCurrentSortAttribute] = useSortedAssets(assets)
  const [sortedFolders, currentSortFolderAttribute, setCurrentSortFolderAttribute] = useSortedAssets(folders)
  useEffect(() => {
    const { assetId } = urlUtils.getQueryParameters()
    if (assetId)
      getInitialAsset(assetId)
  }, [])

  const getInitialAsset = async (id) => {
    try {
      const { data } = await assetsApi.getById(id)
      setInitAsset(data)
    } catch (err) {
      console.log(err)
    }
  }

  const openArchiveAsset = asset => {
    setActiveAssetId(asset.id)
    setActiveArchiveAsset(asset)
  }

  const openDeleteAsset = id => {
    setActiveAssetId(id)
    setDeleteModalOpen(true)
  }

  const deleteAsset = async id => {
    try {
      await assetsApi.updateAsset(id, { updateData: {status: 'deleted', stage: 'draft', deletedAt: new Date((new Date().toUTCString())).toISOString()} })
      const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
      if (assetIndex !== -1)
        setAssets(update(assets, {
          $splice: [[assetIndex, 1]]
        }))
      toastUtils.success('Assets deleted successfully')
    }
    catch (err) {
      // TODO: Error handling
      toastUtils.error('Could not delete assets, please try again later.')
    }
  }

  const archiveAsset = async id => {
    const newState = activeArchiveAsset?.stage !== 'archived' ? 'archived' : 'draft'
    try {
      await assetsApi.updateAsset(id, { updateData: { stage: newState } })
      const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
      setAssets(update(assets, {
        $splice: [[assetIndex, 1]]
      }))
      toastUtils.success(`Assets ${newState === 'archived' ? 'archived' : 'unarchived'} successfully`)
    }
    catch (err) {
      // TODO: Error handling
      toastUtils.error(`Could not ${newState === 'archived' ? 'archive' : 'unarchive'} assets, please try again later.`)
    }
  }

  const beginAssetOperation = ({ asset = null, folder = null }, operation) => {
    if (asset) setOperationAsset(asset)
    if (folder) setOperationFolder(folder)
    setActiveOperation(operation)
  }

  const downloadAsset = (assetItem) => {
    downloadUtils.downloadFile(assetItem.realUrl, assetItem.asset.name)
  }

  const shouldShowUpload = activeSearchOverlay || (mode === 'assets' && assets.length === 0) || (mode === 'folders' && folders.length === 0)

  const copyShareLink = (folder) => copyClipboard(`${process.env.CLIENT_BASE_URL}/collections/${folder.sharePath}`)

  const getShareIsEnabled = ({ shareStatus }) => shareStatus === 'public' || shareStatus === 'private'

  const showLoadMore = ((mode === 'assets' && assets.length > 0) || (mode === 'folders' && folders.length > 0))
  const loadingAssetsFolders = ((assets.length > 0 && assets[assets.length - 1].isLoading) || (folders.length > 0 && folders[folders.length - 1].isLoading))

  return (
    <section className={`${styles.container} ${openFilter && styles.filter}`}>
      {(shouldShowUpload || isDragging) && !isShare &&
        <AssetUpload
          onDragText={'Drop files here to upload'}
          preDragText={shouldShowUpload ? `Drag and drop your files here to upload (png, jpg, gif, doc, xlsx, pdf or mp4)` : ''}
          onFilesDataGet={onFilesDataGet} />
      }
      {shouldShowUpload && !isShare &&
        <AssetAddition
          displayMode='regular'
          folderAdd={false}
          activeFolder={activeFolder}
          getFolders={getFolders}
          type={type}
          itemId={itemId}
          activeSearchOverlay={activeSearchOverlay}
          setActiveSearchOverlay={setActiveSearchOverlay}
        />
      }
      <div className={styles['list-wrapper']}>
        {activeView === 'grid' &&
          <ul className={`${styles['grid-list']} ${styles[itemSize]}`}>
            {mode === 'assets' && assets.map((assetItem, index) => {
              if (assetItem.status !== 'fail') {
                return (
                  <li className={styles['grid-item']} key={assetItem.asset.id || index}>
                    <AssetThumbail
                      {...assetItem}
                      sharePath={sharePath}
                      isShare={isShare}
                      type={type}
                      toggleSelected={() => toggleSelected(assetItem.asset.id)}
                      openArchiveAsset={() => openArchiveAsset(assetItem.asset)}
                      openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                      openMoveAsset={() => beginAssetOperation({ asset: assetItem }, 'move')}
                      openCopyAsset={() => beginAssetOperation({ asset: assetItem }, 'copy')}
                      openShareAsset={() => beginAssetOperation({ asset: assetItem }, 'share')}
                      downloadAsset={() => downloadAsset(assetItem)}
                      openRemoveAsset={() => beginAssetOperation({ asset: assetItem }, 'remove_item')}
                    />
                  </li>
                )
              }
            })}

            {mode === 'folders' && !isShare && folders.map((folder, index) => {
              return (
                <li className={styles['grid-item']} key={folder.id || index}>
                  <FolderGridItem {...folder}
                    toggleSelected={() => toggleSelected(folder.id)}
                    viewFolder={() => viewFolder(folder.id)}
                    deleteFolder={() => deleteFolder(folder.id)}
                    copyShareLink={() => copyShareLink(folder)}
                    copyEnabled={getShareIsEnabled(folder)}
                    shareAssets={() => beginAssetOperation({ folder }, 'shareFolders')} />
                </li>
              )
            })}
          </ul>
        }
        {activeView === 'list' &&
          <ul className={'regular-list'}>
            {mode === 'assets' && sortedAssets.map((assetItem, index) => {
              return (
                <li className={styles['regular-item']} key={assetItem.asset.id || index}>
                  <ListItem
                    isShare={isShare}
                    type={type}
                    assetItem={assetItem}
                    index={index}
                    toggleSelected={() => toggleSelected(assetItem.asset.id)}
                    openArchiveAsset={() => openArchiveAsset(assetItem.asset.id)}
                    openDeleteAsset={() => openDeleteAsset(assetItem.asset.id)}
                    openMoveAsset={() => beginAssetOperation({ asset: assetItem }, 'move')}
                    openCopyAsset={() => beginAssetOperation({ asset: assetItem }, 'copy')}
                    openShareAsset={() => beginAssetOperation({ asset: assetItem }, 'share')}
                    downloadAsset={() => downloadAsset(assetItem)}
                    openRemoveAsset={() => beginAssetOperation({ asset: assetItem }, 'remove_item')}
                    setCurrentSortAttribute={setCurrentSortAttribute}
                    sortAttribute={currentSortAttribute}
                  />
                </li>
              )
            })}
            {mode === 'folders' && !isShare && sortedFolders.map((folder, index) => {
              return (
                <li className={styles['grid-item']} key={folder.id || index}>
                  <FolderListItem {...folder}
                    toggleSelected={() => toggleSelected(folder.id)}
                    viewFolder={() => viewFolder(folder.id)}
                    deleteFolder={() => deleteFolder(folder.id)} index={index}
                    copyShareLink={() => copyShareLink(folder)}
                    copyEnabled={getShareIsEnabled(folder)}
                    shareAssets={() => beginAssetOperation({ folder }, 'shareFolders')}
                    setCurrentSortAttribute={setCurrentSortFolderAttribute}
                    sortAttribute={currentSortFolderAttribute}
                  />
                </li>
              )
            })}
          </ul>
        }
        {(showLoadMore) && nextPage !== -1 &&
          <>
            {(nextPage > 2 || mode === 'folders') ?
              <>
                {!loadingAssetsFolders &&
                  <Waypoint onEnter={loadMore} fireOnRapidScroll={false} />
                }
              </>

              :
              <>
                {!loadingAssetsFolders &&
                  <div className={styles['button-wrapper']}>
                    <Button
                      text='Load More'
                      type='button'
                      styleType='primary'
                      onClick={loadMore} />
                  </div>
                }
              </>
            }
          </>
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
        closeModal={() => setActiveArchiveAsset(undefined)}
        confirmAction={() => {
          archiveAsset(activeAssetId)
          setActiveAssetId('')
          setActiveArchiveAsset(undefined)
        }}
        confirmText={`${activeArchiveAsset?.stage !== 'archived' ? 'Archive' : 'Unarchive'}`}
        message={
          <span>
            Are you sure you want to &nbsp;<strong>{`${activeArchiveAsset?.stage !== 'archived' ? 'Archive' : 'Unarchive'}`}</strong>&nbsp; this asset?
          </span>
        }
        modalIsOpen={activeArchiveAsset}
      />

      {/* Overlay exclusive to page load assets */}
      {initAsset &&
        <DetailOverlay
          isShare={isShare}
          sharePath={sharePath}
          asset={initAsset.asset}
          realUrl={initAsset.realUrl}
          initialParams={{ side: 'comments' }}
          openShareAsset={() => beginAssetOperation({ asset: initAsset }, 'share')}
          openDeleteAsset={() => openDeleteAsset(initAsset.asset.id)}
          closeOverlay={() => setInitAsset(undefined)} />
      }
    </section >
  )
}

export default AssetGrid
