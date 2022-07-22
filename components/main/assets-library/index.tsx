import styles from './index.module.css'
import { useState, useEffect, useContext, useRef } from 'react'
import { AssetContext, FilterContext, UserContext } from '../../../context'
import update from 'immutability-helper'
import assetApi from '../../../server-api/asset'
import folderApi from '../../../server-api/folder'
import toastUtils from '../../../utils/toast'
import { getFolderKeyAndNewNameByFileName } from '../../../utils/upload'
import { getAssetsFilters, getAssetsSort, DEFAULT_FILTERS, DEFAULT_CUSTOM_FIELD_FILTERS, getFoldersFromUploads } from '../../../utils/asset'

// Components
import AssetOps from '../../common/asset/asset-ops'
import SearchOverlay from '../search-overlay-assets'
import AssetSubheader from '../../common/asset/asset-subheader'
import AssetGrid from '../../common/asset/asset-grid'
import TopBar from '../../common/asset/top-bar'
import FilterContainer from '../../common/filter/filter-container'
import { DropzoneProvider } from '../../common/misc/dropzone'
import RenameModal from '../../common/modals/rename-modal'
import UploadStatusOverlayAssets from "../../upload-status-overlay-assets";
import { validation } from "../../../constants/file-validation";
import { useRouter } from 'next/router'

// utils
import selectOptions from '../../../utils/select-options'
// import advancedConfigParams from '../../../utils/advance-config-params'

import { ASSET_UPLOAD_APPROVAL, ASSET_ACCESS } from '../../../constants/permissions'
import NoPermissionNotice from "../../common/misc/no-permission-notice";

const AssetsLibrary = () => {

  const [activeView, setActiveView] = useState('grid')
  const {
    assets,
    setAssets,
    folders,
    setFolders,
    lastUploadedFolder,
    setPlaceHolders,
    activeFolder,
    setActiveFolder,
    setActivePageMode,
    needsFetch,
    nextPage,
    setNeedsFetch,
    addedIds,
    setAddedIds,
    setLoadingAssets,
    selectAllAssets,
    selectedAllAssets,
    selectAllFolders,
    uploadDetailOverlay,
    setUploadDetailOverlay,
    setUploadingAssets,
    showUploadProcess,
    setUploadingFileName,
    setFolderGroups,
    totalAssets,
    setTotalAssets
  } = useContext(AssetContext)

  const [top, setTop] = useState('calc(55px + 3rem)')

  const {advancedConfig, hasPermission} = useContext(UserContext)

  const [activeMode, setActiveMode] = useState('assets')

  const [activeSearchOverlay, setActiveSearchOverlay] = useState(false)

  const [firstLoaded, setFirstLoaded] = useState(false)

  const [renameModalOpen, setRenameModalOpen] = useState(false)

  const [openFilter, setOpenFilter] = useState(false)

  const { activeSortFilter, setActiveSortFilter, tags, loadTags, loadProductFields, productFields, folders: collection, loadFolders, campaigns, loadCampaigns } = useContext(FilterContext)

  const router = useRouter()
  const preparingAssets = useRef(true)

  // When tag, campaigns, collection changes, used for click on tag/campaigns/collection in admin attribute management
  useEffect(() => {
    if (!preparingAssets.current) return
    if (!router.query.tag && !router.query.product && !router.query.collection && !router.query.campaign) {
      preparingAssets.current = false
      return;
    }
    if (router.query.tag && !tags.length) {
      setPlaceHolders('asset', true)
      loadTags()
      return
    }
    if (router.query.product && !productFields.sku.length) {
      setPlaceHolders('asset', true)
      loadProductFields()
      return
    }

    if (router.query.collection && !collection.length) {
      setPlaceHolders('asset', true)
      loadFolders()
      return
    }

    if (router.query.campaign && !campaigns.length) {
      setPlaceHolders('asset', true)
      loadCampaigns()
      return
    }

    const newSortFilter: any = { ...activeSortFilter }

    if (router.query.campaign) {
      const foundCampaign = campaigns.find(({ name }) => name === router.query.campaign)
      if (foundCampaign) {
        newSortFilter.filterCampaigns = [{
          ...foundCampaign,
          value: foundCampaign.id
        }]
      }
      preparingAssets.current = false
      setActiveSortFilter(newSortFilter)
      return
    }

    // Query folder
    if (router.query.collection) {
      const foundCollection = collection.find(({ name }) => name === router.query.collection)
      if (foundCollection) {
        newSortFilter.filterFolders = [{
          ...foundCollection,
          value: foundCollection.id
        }]
        newSortFilter.mainFilter = 'folders'
      }
      preparingAssets.current = false
      setActiveSortFilter(newSortFilter)
      return
    }

    if (router.query.product) {
      const foundProduct = productFields.sku.find(({ sku }) => sku === router.query.product)
      if (foundProduct) {
        newSortFilter.filterProductSku = [{
          ...foundProduct,
          value: foundProduct.sku
        }]
      }
      preparingAssets.current = false
      setActiveSortFilter(newSortFilter)
      return
    }

    if (router.query.tag) {
      const foundTag = tags.find(({ name }) => name === router.query.tag)
      if (foundTag) {
        newSortFilter.filterNonAiTags = [{
          ...foundTag,
          value: foundTag.id
        }]
      }
      preparingAssets.current = false
      setActiveSortFilter(newSortFilter)
      return
    }

  }, [tags, productFields.sku, collection, campaigns])


  useEffect(() => {
    if(hasPermission([ASSET_ACCESS])){
      // Assets are under preparing (for query etc)
      if (preparingAssets.current) {
        // setActivePageMode('library')
        // setLoadingAssets(true)
        // setFirstLoaded(true)
        return
      } else {
        if (!firstLoaded) {
          setFirstLoaded(true)
        }
      }

      if (firstLoaded) {
        setActivePageMode('library')
        if (activeSortFilter.mainFilter === 'folders') {
          setActiveMode('folders')
          getFolders()
        } else {
          setActiveMode('assets')
          setAssets([])
          getAssets()
        }
      }
    }

  }, [activeSortFilter, firstLoaded])

  useEffect(() => {
    if (firstLoaded && activeFolder !== '') {
      setActiveSortFilter({
        ...activeSortFilter,
        mainFilter: 'all'
      })
    }

  }, [activeFolder])

  useEffect(() => {
    if (needsFetch === 'assets') {
      getAssets()
    } else if (needsFetch === 'folders') {
      getFolders()
    }
    setNeedsFetch('')
  }, [needsFetch])

  useEffect(() => {
    if (activeMode === 'folders') {
      setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
    } else if (activeMode === 'assets') {
      setFolders(folders.map(folder => ({ ...folder, isSelected: false })))
    }
  }, [activeMode])

  useEffect(() => {
    updateSortFilterByAdvConfig()
  }, [advancedConfig.set])

  const clearFilters = () => {
    setActiveSortFilter({
      ...activeSortFilter,
      ...DEFAULT_FILTERS,
      ...DEFAULT_CUSTOM_FIELD_FILTERS(activeSortFilter)
    })
  }

  const updateSortFilterByAdvConfig = async (params: any = {}) => {
    let defaultTab = getDefaultTab()
    const filters = Object.keys(router.query)
    if (filters && filters.length) {
      defaultTab = filters[0] === 'collection' ? 'folders' : 'all';
    } else if (params.mainFilter) {
      defaultTab = params.mainFilter
    }

    let sort = {...activeSortFilter.sort}
    if (defaultTab === 'folders' && !params.folderId) {
      sort = advancedConfig.collectionSortView === 'alphabetical' ? selectOptions.sort[3] : selectOptions.sort[1]
    } else {
      sort = advancedConfig.assetSortView === 'newest' ? selectOptions.sort[1] : selectOptions.sort[3]
    }
    // console.log(advancedConfig.assetSortView, sort.name)

    setActiveSortFilter({
      ...activeSortFilter,
      mainFilter: defaultTab,
      sort
    })

  }

  const getDefaultTab = (advConf?) => {
    const config = advConf || advancedConfig
    const defaultTab = config.defaultLandingPage === 'allTab' ? 'all' : 'folders'
    return defaultTab
  }

  // Upload asset
  const uploadAsset = async (i: number, assets: any, currentDataClone: any, totalSize: number, folderId, folderGroup = {}, subFolderAutoTag = true) => {
    try {
      const formData = new FormData()
      let file = assets[i].file
      let currentUploadingFolderId = null
      let newAssets = 0

      // Do validation
      if (assets[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE) {
        // Violate validation, mark failure
        const updatedAssets = assets.map((asset, index) => index === i ? { ...asset, status: 'fail', index, error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE } : asset);

        // Update uploading assets
        setUploadingAssets(updatedAssets)

        // Remove current asset from asset placeholder
        let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


        // At this point, file place holder will be removed
        setAssets([...newAssetPlaceholder, ...currentDataClone])

        // The final one
        if (i === assets.length - 1) {
          return folderGroup
        } else { // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
        }
      } else {
        // Show uploading toast
        showUploadProcess('uploading', i)
        // Set current upload file name
        setUploadingFileName(assets[i].asset.name)

        // If user is uploading files in folder which is not saved from server yet
        if (assets[i].dragDropFolderUpload && !folderId) {
          // Get file group info, this returns folderKey and newName of file
          let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.name, subFolderAutoTag)

          // Current folder Group have the key
          if (fileGroupInfo.folderKey && folderGroup[fileGroupInfo.folderKey]) {
            currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey]
            // Assign new file name without splash
            // file = new File([file.slice(0, file.size, file.type)],
            //   fileGroupInfo.newName
            //   , { type: file.type, lastModified: (file.lastModifiedDate || new Date(file.lastModified)) })
          }
        }

        // Append file to form data
        formData.append('asset', assets[i].dragDropFolderUpload ? file : file.originalFile)
        formData.append('fileModifiedAt', assets[i].dragDropFolderUpload ?
          new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString() :
          new Date((file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified)).toUTCString()).toISOString()
        )

        let size = totalSize;
        // Calculate the rest of size
        assets.map((asset) => {
          // Exclude done and  assets
          if (asset.status === 'done' || asset.status === 'fail') {
            newAssets += 1
            size -= asset.asset.size
          }
        })

        let attachedQuery = { estimateTime: 1, size, totalSize }


        // Uploading inside specific folders
        if (folderId) {
          attachedQuery['folderId'] = folderId
        }

        // Uploading the new folder
        if (currentUploadingFolderId) {
          attachedQuery['folderId'] = currentUploadingFolderId
        }

        // Call API to upload
        let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery))

        // If user is uploading files in folder which is not saved from server yet
        if (assets[i].dragDropFolderUpload && !folderId) {
          // Get file group info, this returns folderKey and newName of file
          let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.name, subFolderAutoTag)

          /// If user is uploading new folder and this one still does not have folder Id, add it to folder group
          if (fileGroupInfo.folderKey && !folderGroup[fileGroupInfo.folderKey]) {
            folderGroup[fileGroupInfo.folderKey] = data[0].asset.folders[0]
          }
        }


        data = data.map((item) => {
          item.isSelected = true
          return item
        })

        assets[i] = data[0]

        // At this point, file place holder will be removed
        setAssets([...assets, ...currentDataClone])
        setAddedIds(data.map(assetItem => assetItem.asset.id))

        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) => index === i ? { ...asset, status: 'done' } : asset);

        setUploadingAssets(updatedAssets)

        // Update total assets
        setTotalAssets(totalAssets + newAssets + 1)

        // The final one
        if (i === assets.length - 1) {
          return folderGroup
        } else { // Keep going
          await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
        }
      }
    } catch (e) {
      console.log(e)
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) => index === i ? { ...asset, status: 'fail', index, error: 'Processing file error' } : asset);

      // Update uploading assets
      setUploadingAssets(updatedAssets)

      // Remove current asset from asset placeholder
      let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


      // At this point, file place holder will be removed
      setAssets([...newAssetPlaceholder, ...currentDataClone])

      // The final one
      if (i === assets.length - 1) {
        return folderGroup
      } else { // Keep going
        await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
      }
    }
  }

  const onFilesDataGet = async (files) => {
    if(!hasPermission([ASSET_UPLOAD_APPROVAL])){
      const currentDataClone = [...assets]
      const currenFolderClone = [...folders]
      try {
        let needsFolderFetch
        const newPlaceholders = []
        const folderPlaceholders = []
        const foldersUploaded = getFoldersFromUploads(files)
        if (foldersUploaded.length > 0) {
          needsFolderFetch = true
        }
        foldersUploaded.forEach(folder => {
          folderPlaceholders.push({
            name: folder,
            length: 10,
            assets: [],
            isLoading: true,
            createdAt: new Date()
          })
        })

        let totalSize = 0;
        files.forEach(file => {

          let fileToUpload = file;
          let dragDropFolderUpload = false;

          // Upload folder
          if (file.originalFile.path.includes('/')) {
            dragDropFolderUpload = true;
            fileToUpload = new File([file.originalFile.slice(0, file.originalFile.size, file.originalFile.type)],
                file.originalFile.path.substring(1, file.originalFile.path.length)
                , { type: file.originalFile.type, lastModified: (file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified)) })
          } else {
            fileToUpload.path = null;
          }

          totalSize += file.originalFile.size
          newPlaceholders.push({
            asset: {
              name: file.originalFile.name,
              createdAt: new Date(),
              size: file.originalFile.size,
              stage: 'draft',
              type: 'image',
              mimeType: file.originalFile.type,
            },
            file: fileToUpload,
            status: 'queued',
            isUploading: true,
            dragDropFolderUpload, // Drag and drop folder will have different process a bit here
          })
        })

        // Store current uploading assets for calculation
        setUploadingAssets(newPlaceholders)

        // Showing assets = uploading assets + existing assets
        setAssets([...newPlaceholders, ...currentDataClone])
        setFolders([...folderPlaceholders, ...currenFolderClone])

        // Get team advance configurations first
        const subFolderAutoTag = advancedConfig.subFolderAutoTag;

        // Start to upload assets
        let folderGroups = await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, activeFolder, undefined, subFolderAutoTag)

        // Save this for retry failure files later
        setFolderGroups(folderGroups)

        // Finish uploading process
        showUploadProcess('done')

        if (needsFolderFetch) {
          setNeedsFetch('folders')
        }

        // Do not need toast here because we have already process toast
        // toastUtils.success(`${data.length} Asset(s) uploaded.`)
      } catch (err) {
        // Finish uploading process
        showUploadProcess('done')

        setAssets(currentDataClone)
        setFolders(currenFolderClone)
        console.log(err)
        if (err.response?.status === 402) toastUtils.error(err.response.data.message)
        else toastUtils.error('Could not upload assets, please try again later.')
      }
    }

  }

  const getCreationParameters = (attachQuery?: any) => {
    let queryData: any = {}
    if (activeFolder) {
      queryData.folderId = activeFolder
    }
    // Attach extra query
    if (attachQuery) {
      queryData = { ...queryData, ...attachQuery }
    }
    return queryData
  }

  const getAssets = async (replace = true, complete = null) => {
    try {
      setLoadingAssets(true)
      if (replace) {
        setAddedIds([])
      }
      setPlaceHolders('asset', replace)
      const { data } = await assetApi.getAssets({
        ...getAssetsFilters({
          replace,
          activeFolder,
          addedIds,
          nextPage,
          userFilterObject: activeSortFilter
        }),
        complete,
        ...getAssetsSort(activeSortFilter)
      })
      setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace)
      setFirstLoaded(true)
    } catch (err) {
      //TODO: Handle error
      console.log(err)
    } finally {
      setLoadingAssets(false)
    }
  }

  const getFolders = async (replace = true) => {
    try {

      // don't reload folder on active detail folder/collection
      if (activeFolder) {
        return
      }

      if (replace) {
        setAddedIds([])
      }
      setPlaceHolders('folder', replace)
      const {field, order} = activeSortFilter.sort
      const queryParams = { page: replace ? 1 : nextPage,  sortField: field, sortOrder: order}

      if (!replace && addedIds.length > 0) {
        queryParams.excludeIds = addedIds.join(',')
      }
      if (activeSortFilter.filterFolders?.length > 0) {
        queryParams.folders = activeSortFilter.filterFolders.map(item => item.value).join(',')
      }

      const { data } = await folderApi.getFolders(queryParams)

      let assetList = { ...data, results: data.results }
      if (lastUploadedFolder && activeSortFilter.mainFilter === "folders" && activeSortFilter.sort.value === "alphabetical") {
        const lastFolder = {...lastUploadedFolder}
        assetList.results.unshift(lastFolder)
      }

      setFolders(assetList, replace)
    } catch (err) {
      //TODO: Handle error
      console.log(err)
    }
  }

  const toggleSelected = (id) => {
    if (activeMode === 'assets') {
      const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
      const selectedValue = !assets[assetIndex].isSelected
      // Toggle unselect when selected all will disable selected all
      if(!selectedValue && selectedAllAssets){
        selectAllAssets(false)
      }
      setAssets(update(assets, {
        [assetIndex]: {
          isSelected: { $set: !assets[assetIndex].isSelected }
        }
      }))
    } else if (activeMode === 'folders') {
      const folderIndex = folders.findIndex(folder => folder.id === id)
      setFolders(update(folders, {
        [folderIndex]: {
          isSelected: { $set: !folders[folderIndex].isSelected }
        }
      }))
    }
  }

  const selectAll = () => {
    if (activeMode === 'assets') {
      // Mark select all
      selectAllAssets()

      setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
    } else if (activeMode === 'folders') {
      selectAllFolders()

      setFolders(folders.map(folder => ({ ...folder, isSelected: true })))
    }
  }

  const mapWithToggleSelection = asset => ({ ...asset, toggleSelected })

  const backToFolders = () => {
    setActiveFolder('')
    // setActiveSortFilter({
    //   ...activeSortFilter,
    //   // filterFolders: [], // Open this comment to reset filter folders
    //   mainFilter: 'folders'
    // })
    updateSortFilterByAdvConfig({mainFilter: 'folders'})
  }

  const selectedAssets = assets.filter(asset => asset.isSelected)

  const selectedFolders = folders.filter(folder => folder.isSelected)

  const viewFolder = async (id) => {
    // setActiveSortFilter({
    //   ...activeSortFilter,
    //   ...DEFAULT_FILTERS,
    //   ...DEFAULT_CUSTOM_FIELD_FILTERS(activeSortFilter),
    //   mainFilter: 'folders'
    // })
    // router.replace("/main/assets") // Open this comment to reset query string url
    setActiveFolder(id)
    updateSortFilterByAdvConfig({folderId: id})

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

  const loadMore = () => {
    if (activeMode === 'assets') {
      getAssets(false)
    } else {
      getFolders(false)
    }
  }

  const onChangeWidth = () => {
    let remValue = '3rem'
    if(window.innerWidth <= 900){
      remValue = '1rem + 1px'
    }

    let el = document.getElementById('top-bar');
    let header = document.getElementById('main-header');
    let subHeader = document.getElementById('sub-header');
    let style = getComputedStyle(el);

    const headerTop = (document.getElementById('top-bar')?.offsetHeight || 55)
    setTop(`calc(${headerTop}px + ${header?.clientHeight || 0}px + ${remValue} - ${style.paddingBottom} - ${style.paddingTop})`)
  }

  useEffect(()=>{
    onChangeWidth()

    window.addEventListener('resize', onChangeWidth);

    return () => window.removeEventListener("resize", onChangeWidth);
  },[])

  return (
    <>
      <AssetSubheader
        activeFolder={activeFolder}
        getFolders={getFolders}
        mode={activeMode}
        amountSelected={activeMode === 'assets' ? selectedAssets.length : selectedFolders.length}
        activeFolderData={activeFolder && folders.find(folder => folder.id === activeFolder)}
        backToFolders={backToFolders}
        setRenameModalOpen={setRenameModalOpen}
        activeSortFilter={activeSortFilter}
      />
      {hasPermission([ASSET_ACCESS]) ?
          <>
            <main className={`${styles.container}`}>
              {advancedConfig.set && <TopBar
                  activeSortFilter={activeSortFilter}
                  setActiveSortFilter={setActiveSortFilter}
                  setActiveView={setActiveView}
                  activeFolder={activeFolder}
                  setActiveSearchOverlay={() => { selectAllAssets(false); setActiveSearchOverlay(true) }}
                  selectAll={selectAll}
                  setOpenFilter={setOpenFilter}
                  openFilter={openFilter}
                  deletedAssets={false} />
              }
              <div className={`${openFilter && styles['col-wrapper']} ${styles['grid-wrapper']}`} style={{marginTop: top}}>
                <DropzoneProvider>
                  {advancedConfig.set && <AssetGrid
                      activeFolder={activeFolder}
                      getFolders={getFolders}
                      activeView={activeView}
                      activeSortFilter={activeSortFilter}
                      onFilesDataGet={onFilesDataGet}
                      toggleSelected={toggleSelected}
                      mode={activeMode}
                      viewFolder={viewFolder}
                      deleteFolder={deleteFolder}
                      loadMore={loadMore}
                      openFilter={openFilter}
                  />
                  }
                </DropzoneProvider>
                {openFilter &&
                    <FilterContainer
                        clearFilters={clearFilters}
                        openFilter={openFilter}
                        setOpenFilter={setOpenFilter}
                        activeSortFilter={activeSortFilter}
                        setActiveSortFilter={setActiveSortFilter}
                        isFolder={activeSortFilter.mainFilter === 'folders'}
                    />
                }
              </div>
            </main>
            <AssetOps />
          </>
          :
          <NoPermissionNotice />
      }

      <RenameModal
        closeModal={() => setRenameModalOpen(false)}
        modalIsOpen={renameModalOpen}
        renameConfirm={confirmFolderRename}
        type={'Folder'}
        initialValue={activeFolder && folders.find(folder => folder.id === activeFolder)?.name}
      />
      {activeSearchOverlay &&
        <SearchOverlay
          closeOverlay={closeSearchOverlay}
          operationsEnabled={true}
          activeFolder={activeFolder}
        />
      }
      {uploadDetailOverlay && <UploadStatusOverlayAssets closeOverlay={() => { setUploadDetailOverlay(false) }} />}
    </>
  )
}

export default AssetsLibrary
