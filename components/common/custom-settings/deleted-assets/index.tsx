import styles from './index.module.css'
import { useState, useEffect, useContext, useRef } from 'react'
import { AssetContext, FilterContext } from '../../../../context'
import update from 'immutability-helper'
import assetApi from '../../../../server-api/asset'
import folderApi from '../../../../server-api/folder'
import toastUtils from '../../../../utils/toast'
import { getFolderKeyAndNewNameByFileName } from '../../../../utils/upload'
import { getAssetsFilters, getAssetsSort, DEFAULT_FILTERS, DEFAULT_CUSTOM_FIELD_FILTERS, getFoldersFromUploads } from '../../../../utils/asset'

// Components
import AssetOps from '../../../common/asset/asset-ops'
import AssetSubheader from '../../../common/asset/asset-subheader'
import TopBar from '../../../common/asset/top-bar'
import FilterContainer from '../../../common/filter/filter-container'
import { DropzoneProvider } from '../../../common/misc/dropzone'
import RenameModal from '../../../common/modals/rename-modal'
import UploadStatusOverlayAssets from "../../../upload-status-overlay-assets";
import { validation } from "../../../../constants/file-validation";
import { useRouter } from 'next/router'
import DeletedAssets from './deleted-assets'

const DeletedAssetsLibrary = () => {

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
	nextPage,
	setNeedsFetch,
	addedIds,
	setAddedIds,
	setLoadingAssets,
	selectAllAssets,
	uploadDetailOverlay,
	setUploadDetailOverlay,
	setUploadingAssets,
	showUploadProcess,
	setUploadingFileName,
	setFolderGroups,
	totalAssets,
	setTotalAssets
  } = useContext(AssetContext)


  const [firstLoaded, setFirstLoaded] = useState(false)

  const [renameModalOpen, setRenameModalOpen] = useState(false)

  const [openFilter, setOpenFilter] = useState(false)

  const { activeSortFilter, setActiveSortFilter, tags, loadTags, loadProductFields, productFields, folders: collection, loadFolders, campaigns, loadCampaigns } = useContext(FilterContext)

  const router = useRouter()
  const canLoad = useRef(false)

  useEffect(() => {
	if (canLoad.current) return
	if (!router.query.tag && !router.query.product && !router.query.collection && !router.query.campaign) {
	  canLoad.current = true
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
	  canLoad.current = true
	  setActiveSortFilter(newSortFilter)
	  return
	}

	if (router.query.collection) {
	  const foundCollection = collection.find(({ name }) => name === router.query.collection)
	  if (foundCollection) {
		newSortFilter.filterFolders = [{
		  ...foundCollection,
		  value: foundCollection.id
		}]
		newSortFilter.mainFilter = 'folders'
	  }
	  canLoad.current = true
	  setActiveSortFilter(newSortFilter)
	  return
	}

	if (router.query.product) {
	  const foundProduct = productFields.sku.find(({ sku }) => sku === router.query.product)
	  if (foundProduct) {
		newSortFilter.filterProductSku = {
		  ...foundProduct,
		  value: foundProduct.sku
		}
	  }
	  canLoad.current = true
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
	  canLoad.current = true
	  setActiveSortFilter(newSortFilter)
	  return
	}

  }, [tags, productFields.sku, collection, campaigns])

  useEffect(() => {
	if (!canLoad.current) {
	  return
	}
    setActivePageMode('library')
     setAssets([])
      getAssets()
  }, [activeSortFilter])

  useEffect(() => {
	if (firstLoaded && activeFolder !== '')
	  setActiveSortFilter({
		...activeSortFilter,
		mainFilter: 'all',
	  })
  }, [activeFolder])

  useEffect(() => {
	  getAssets()
  }, [needsFetch])

  const clearFilters = () => {
	setActiveSortFilter({
	  ...activeSortFilter,
	  ...DEFAULT_FILTERS,
	  ...DEFAULT_CUSTOM_FIELD_FILTERS(activeSortFilter)
	})
  }

  // Upload asset
  const uploadAsset = async (i: number, assets: any, currentDataClone: any, totalSize: number, folderId, folderGroup = {}) => {
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
		  await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup)
		}
	  } else {
		// Show uploading toast
		showUploadProcess('uploading', i)
		// Set current upload file name
		setUploadingFileName(assets[i].asset.name)

		// If user is uploading files in folder which is not saved from server yet
		if (assets[i].dragDropFolderUpload && !folderId) {
		  // Get file group info, this returns folderKey and newName of file
		  let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.name)

		  // Current folder Group have the key
		  if (fileGroupInfo.folderKey && folderGroup[fileGroupInfo.folderKey]) {
			currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey]
			// Assign new file name without splash
			file = new File([file.slice(0, file.size, file.type)],
			  fileGroupInfo.newName
			  , { type: file.type, lastModified: (file.lastModifiedDate || new Date(file.lastModified)) })
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
		  let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.name)

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
		  await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup)
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
		await uploadAsset(i + 1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup)
	  }
	}
  }

  const onFilesDataGet = async (files) => {
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

	  // Start to upload assets
	  let folderGroups = await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, activeFolder)

	  // Save this for retry failure files later
	  setFolderGroups(folderGroups)

	  // Finish uploading process
	  showUploadProcess('done')

	  if (needsFolderFetch) {
		setNeedsFetch('folders')
	  }
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

  const getCreationParameters = (attachQuery?: any) => {
	let queryData: any = {}
	if (activeFolder) {
	  queryData.folderId = activeFolder
	}
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
		...getAssetsSort(activeSortFilter),
		deletedAssets: true
	  })
	  setAssets({ ...data, results: data.results.map(mapWithToggleSelection) }, replace)
	  setFirstLoaded(true)
	} catch (err) {
	  console.log(err)
	} finally {
	  setLoadingAssets(false)
	}
  }

  const selectAll = () => {
	  selectAllAssets()
	  setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
  }

  const mapWithToggleSelection = asset => ({ ...asset, toggleSelected })

  const backToFolders = () => {
    console.log('common/custom-settings/deleted-assets--- backToFolders() --- line:452', 'SET ACTIVE FOLDER');
	setActiveFolder('')
	setActiveSortFilter({
	  ...activeSortFilter,
	  mainFilter: 'folders'
	})
  }

  const selectedAssets = assets.filter(asset => asset.isSelected)

  const viewFolder = async (id) => {
	console.log(`View folder`)
	setActiveFolder(id)
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

  const toggleSelected = (id) => {
	const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
	setAssets(update(assets, {
	  [assetIndex]: {
		isSelected: { $set: !assets[assetIndex].isSelected }
	  }
	}))
  }

  const loadMore = () => {
	  getAssets(false)
  }

  return (
    <DeletedAssets
      activeFolder={activeFolder}
      activeView={activeView}
      activeSortFilter={activeSortFilter}
      setActiveSortFilter={setActiveSortFilter}
      onFilesDataGet={onFilesDataGet}
      toggleSelected={toggleSelected}
      mode='assets'
      viewFolder={viewFolder}
      loadMore={loadMore}
      openFilter={openFilter}
    />
  );
}

export default DeletedAssetsLibrary
