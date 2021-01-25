import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { AssetContext } from '../../../context'
import FilterProvider from '../../../context/filter-provider'
import selectOptions from '../../common/select-options'
import update from 'immutability-helper'
import assetApi from '../../../server-api/asset'
import folderApi from '../../../server-api/folder'
import toastUtils from '../../../utils/toast'
import { getAssetsFilters, getAssetsSort } from '../../../utils/asset'

// Components
import AssetOps from '../../common/asset/asset-ops'
import SearchOverlay from '../search-overlay-assets'
import AssetSubheader from './asset-subheader'
import AssetGrid from '../../common/asset/asset-grid'
import TopBar from '../../common/asset/top-bar'
import FilterContainer from '../../common/filter/filter-container'
import { DropzoneProvider } from '../../common/misc/dropzone'
import RenameModal from '../../common/modals/rename-modal'

const DEFAULT_FILTERS = {
  filterCampaigns: [],
  filterChannels: [],
  filterTags: [],
  filterProjects: [],
  filterFileTypes: [],
  filterOrientations: [],
  filterProductFields: [],
  filterProductType: [],
  dimensionWidth: undefined,
  dimensionHeight: undefined,
  beginDate: undefined,
  endDate: undefined
}

const AssetsLibrary = () => {

  const [activeSortFilter, setActiveSortFilter] = useState({
    sort: selectOptions.sort[1],
    mainFilter: 'all',
    ...DEFAULT_FILTERS,
    dimensionsActive: false
  })
  const [activeView, setActiveView] = useState('grid')
  const {
    assets,
    setAssets,
    folders,
    setFolders,
    setPlaceHolders,
    activeFolder,
    setActiveFolder,
    setActivePageMode,
    needsFetch,
    setNeedsFetch,
    addedIds,
    setAddedIds
  } = useContext(AssetContext)

  const [activeMode, setActiveMode] = useState('assets')

  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false)

  const [firstLoaded, setFirstLoaded] = useState(false)

  const [renameModalOpen, setRenameModalOpen] = useState(false)

  const [openFilter, setOpenFilter] = useState(false)

  useEffect(() => {
    console.log('first thing?')
    setActivePageMode('library')
    if (activeSortFilter.mainFilter === 'folders') {
      setActiveMode('folders')
      getFolders()
    } else {
      setActiveMode('assets')
      setAssets([])
      getAssets()
    }
  }, [activeSortFilter])

  useEffect(() => {
    if (firstLoaded && activeFolder !== '')
      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: 'all'
      })
  }, [activeFolder])

  useEffect(() => {
    if (needsFetch === 'assets') {
      getAssets()
    } else if (needsFetch === 'folders') {
      getFolders()
    }
    setNeedsFetch('')
  }, [needsFetch])

  const clearFilters = () => {
    setActiveSortFilter({
      ...activeSortFilter,
      ...DEFAULT_FILTERS
    })
  }

  const onFilesDataGet = async (files) => {
    const currentDataClone = [...assets]
    try {
      const formData = new FormData()
      const newPlaceholders = []
      files.forEach(file => {
        let { originalFile } = file
        newPlaceholders.push({
          asset: {
            name: originalFile.name,
            createdAt: new Date(),
            size: originalFile.size,
            stage: 'draft',
            type: 'image'
          },
          isUploading: true
        })
        const { path, type, size } = originalFile
        if (path.includes('/')) {
          originalFile = new File([originalFile.slice(0, size, type)],
            path.substring(1, path.length)
            , { type })
        }
        formData.append('asset', originalFile)
      })
      setAssets([...newPlaceholders, ...currentDataClone])
      const { data } = await assetApi.uploadAssets(formData, getCreationParameters())
      if (activeMode === 'folders') {
        setNeedsFetch('folders')
      } else {
        setAddedIds(data.map(assetItem => assetItem.asset.id))
        setAssets([...data, ...currentDataClone])
      }
      toastUtils.success(`${data.length} Asset(s) uploaded.`)
    } catch (err) {
      setAssets(currentDataClone)
      console.log(err)
      if (err.response?.status === 402) toastUtils.error(err.response.data.message)
      else toastUtils.error('Could not upload assets, please try again later.')
    }
  }

  const getCreationParameters = () => {
    const queryData = {}
    if (activeFolder) {
      queryData.folderId = activeFolder
    }

    return queryData
  }

  const getAssets = async (replace = true) => {
    try {
      if (replace) {
        setAddedIds([])
      }
      setPlaceHolders('asset', replace)
      const { data } = await assetApi.getAssets({
        ...getAssetsFilters({
          replace,
          activeFolder,
          addedIds,
          userFilterObject: activeSortFilter
        }),
        ...getAssetsSort(activeSortFilter)
      })
      setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace)
      setFirstLoaded(true)
    } catch (err) {
      //TODO: Handle error
      console.log(err)
    }
  }

  const getFolders = async () => {
    try {
      setPlaceHolders('folder')
      const { data } = await folderApi.getFolders()
      setFolders(data)
    } catch (err) {
      //TODO: Handle error
      console.log(err)
    }
  }

  const toggleSelected = (id) => {
    const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
    setAssets(update(assets, {
      [assetIndex]: {
        isSelected: { $set: !assets[assetIndex].isSelected }
      }
    }))
  }

  const selectAll = () => {
    setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
  }

  const mapWithToggleSelection = asset => ({ ...asset, toggleSelected })

  const backToFolders = () => {
    setActiveFolder('')
    setActiveSortFilter({
      ...activeSortFilter,
      mainFilter: 'folders'
    })
  }

  const selectedAssets = assets.filter(asset => asset.isSelected)

  const viewFolder = async (id) => {
    setActiveFolder(id)
  }

  const deleteFolder = async (id) => {
    try {
      await folderApi.deleteFolder(id)
      const modFolderIndex = folders.findIndex(folder => folder.id === id)
      setFolders(update(folders, {
        $splice: [[modFolderIndex, 1]]
      }))
      toastUtils.success('Collection deleted successfully')
    } catch (err) {
      console.log(err)
    }
  }

  const closeSearchOverlay = () => {
    getAssets()
    setActiveSearchOverlay(false)
  }

  const confirmFolderRename = async (newValue) => {
    try {
      await folderApi.updateFolder(activeFolder, { name: newValue })
      const modFolderIndex = folders.findIndex(folder => folder.id === activeFolder)
      setFolders(update(folders, {
        [modFolderIndex]: {
          name: { $set: newValue }
        }
      }))
      toastUtils.success('Collection name updated')
    } catch (err) {
      console.log(err)
      toastUtils.error('Could not update collection name')
    }
  }

  return (
    <FilterProvider>
      <AssetSubheader
        activeFolder={activeFolder}
        getFolders={getFolders}
        amountSelected={selectedAssets.length}
        activeFolderData={activeFolder && folders.find(folder => folder.id === activeFolder)}
        backToFolders={backToFolders}
        setRenameModalOpen={setRenameModalOpen}
        activeSortFilter={activeSortFilter}
      />
      <main className={`${styles.container}`}>
        <TopBar
          activeSortFilter={activeSortFilter}
          setActiveSortFilter={setActiveSortFilter}
          setActiveView={setActiveView}
          activeFolder={activeFolder}
          setActiveSearchOverlay={() => setActiveSearchOverlay(true)}
          selectAll={selectAll}
          setOpenFilter={setOpenFilter}
          openFilter={openFilter}
        />
        <div className={`${openFilter && styles['col-wrapper']}`}>
          <DropzoneProvider>
            <AssetGrid
              activeFolder={activeFolder}
              getFolders={getFolders}
              activeView={activeView}
              activeSortFilter={activeSortFilter}
              onFilesDataGet={onFilesDataGet}
              toggleSelected={toggleSelected}
              mode={activeMode}
              folders={folders}
              viewFolder={viewFolder}
              deleteFolder={deleteFolder}
              loadMore={() => getAssets(false)}
              openFilter={openFilter}
            />
          </DropzoneProvider>
          {openFilter &&
            <FilterContainer
              clearFilters={clearFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              activeSortFilter={activeSortFilter}
              setActiveSortFilter={setActiveSortFilter}
            />
          }
        </div>
      </main>
      <AssetOps />
      <RenameModal
        closeModal={() => setRenameModalOpen(false)}
        modalIsOpen={renameModalOpen}
        renameConfirm={confirmFolderRename}
        type={'Folder'}
        initialValue={activeFolder && folders.find(folder => folder.id === activeFolder).name}
      />
      {activeSearchOverlay &&
        <SearchOverlay
          closeOverlay={closeSearchOverlay}
        />
      }
    </FilterProvider>
  )
}

export default AssetsLibrary
