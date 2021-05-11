import styles from './asset-addition.module.css'
import { useRef, useState, useContext } from 'react'
import { Assets } from '../../../assets'
import { AssetContext } from '../../../context'
import { getFoldersFromUploads } from '../../../utils/asset'
import toastUtils from '../../../utils/toast'
import cookiesUtils from '../../../utils/cookies'
import assetApi from '../../../server-api/asset'
import taskApi from '../../../server-api/task'
import projectApi from '../../../server-api/project'
import folderApi from '../../../server-api/folder'

// Components
import SearchOverlay from '../../main/search-overlay-assets'
import SimpleButton from '../buttons/simple-button'
import ToggleAbleAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import DriveSelector from '../asset/drive-selector'
import FolderModal from '../folder/folder-modal'
import IconClickable from '../buttons/icon-clickable'

import { validation } from '../../../constants/file-validation'
import {getFolderKeyAndNewNameByFileName} from "../../../utils/upload";



const AssetAddition = ({
	activeFolder = '',
	getFolders = () => { },
	activeSearchOverlay = false,
	setActiveSearchOverlay = (active) => { },
	folderAdd = true,
	type = '',
	itemId = '',
	displayMode = 'dropdown'
}) => {

	const fileBrowserRef = useRef(undefined)
	const folderBrowserRef = useRef(undefined)

	const [activeModal, setActiveModal] = useState('')
	const [submitError, setSubmitError] = useState('')

	const {
		assets,
		setAssets,
		setNeedsFetch,
		setAddedIds,
		activePageMode,
		folders,
		setFolders,
		showUploadProcess,
		setUploadingAssets,
		setUploadingFileName,
		setFolderGroups,
		setUploadSourceType,
		setTotalAssets,
		totalAssets
	} = useContext(AssetContext)


	// Upload asset
	const uploadAsset  = async (i: number, assets: any, currentDataClone: any, totalSize: number, folderId, folderGroup = {}) => {
		try{
			const formData = new FormData()
			let file = assets[i].file.originalFile
			let currentUploadingFolderId = null
			let newAssets = 0

			// Get file group info, this returns folderKey and newName of file
			let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.webkitRelativePath)

			// Do validation
			if(assets[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE){
				// Violate validation, mark failure
				const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, status: 'fail', index, error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE} : asset);

				// Update uploading assets
				setUploadingAssets(updatedAssets)

				// Remove current asset from asset placeholder
				let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


				// At this point, file place holder will be removed
				setAssets([...newAssetPlaceholder, ...currentDataClone])

				// The final one
				if(i === assets.length - 1){
					return folderGroup
				}else{ // Keep going
					await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup)
				}
			}else{
				// Show uploading toast
				showUploadProcess('uploading', i)

				// Set current upload file name
				setUploadingFileName(assets[i].asset.name)


				// If user is uploading files in folder which is not saved from server yet
				if(fileGroupInfo.folderKey && !folderId){
					// Current folder Group have the key
					if(folderGroup[fileGroupInfo.folderKey]){
						currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey]
						// Assign new file name without splash
						file = new File([file.slice(0, file.size, file.type)],
							fileGroupInfo.newName
							, { type: file.type, lastModified: (file.lastModifiedDate || new Date(file.lastModified)) })
					}
				}


				// Append file to form data
				formData.append('asset', file)
				formData.append('fileModifiedAt', new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString())

				let size = totalSize;
				// Calculate the rest of size
				assets.map((asset)=>{
					// Exclude done or fail assets
					if(asset.status === 'done' || asset.status === 'fail'){
						size -= asset.asset.size
						newAssets+=1
					}
				})

				let attachedQuery = {estimateTime: 1, size, totalSize}


				// Uploading inside specific folders
				if(folderId){
					attachedQuery['folderId'] = folderId
				}

				// Uploading the new folder
				if(currentUploadingFolderId){
					attachedQuery['folderId'] = currentUploadingFolderId
				}

				// Call API to upload
				let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery))

				// If user is uploading files in folder which is not saved from server yet
				if(fileGroupInfo.folderKey && !folderId){
					/// If user is uploading new folder and this one still does not have folder Id, add it to folder group
					if(!folderGroup[fileGroupInfo.folderKey]){
						folderGroup[fileGroupInfo.folderKey] = data[0].asset.folderId
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

				// Update total assets
				setTotalAssets(totalAssets + newAssets +1)

				// Mark this asset as done
				const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, status: 'done'} : asset);

				setUploadingAssets(updatedAssets)

				// The final one
				if(i === assets.length - 1){
					return
				}else{ // Keep going
					await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup)
				}
			}
		}catch (e){
			// Violate validation, mark failure
			const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, index, status: 'fail', error: 'Processing file error'} : asset);

			// Update uploading assets
			setUploadingAssets(updatedAssets)

			// Remove current asset from asset placeholder
			let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


			// At this point, file place holder will be removed
			setAssets([...newAssetPlaceholder, ...currentDataClone])

			// The final one
			if(i === assets.length - 1){
				return folderGroup
			}else{ // Keep going
				await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup)
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
			const foldersUploaded = getFoldersFromUploads(files, true)
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
				totalSize+=file.originalFile.size
				newPlaceholders.push({
					asset: {
						name: file.originalFile.name,
						createdAt: new Date(),
						size: file.originalFile.size,
						stage: 'draft',
						type: 'image',
						mimeType: file.originalFile.type,
						fileModifiedAt: file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified)
					},
					file,
					status: 'queued',
					isUploading: true
				})
				// formData.append('asset', file.path || file.originalFile)
			})

			// Store current uploading assets for calculation
			setUploadingAssets(newPlaceholders)

			// Showing assets = uploading assets + existing assets
			setAssets([...newPlaceholders, ...currentDataClone])
			setFolders([...folderPlaceholders, ...currenFolderClone])

			// Start to upload assets
			let folderGroups =  await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, activeFolder)

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

	const onDropboxFilesSelection = async (files) => {
		const currentDataClone = [...assets]
		try {
			let totalSize = 0;
			const newPlaceholders = []
			files.forEach(file => {
				totalSize += file.bytes
				newPlaceholders.push({
					asset: {
						name: file.name,
						createdAt: new Date(),
						size: file.bytes,
						stage: 'draft',
						type: 'image'
					},
					isUploading: true
				})
			})
			setAssets([...newPlaceholders, ...currentDataClone])

			// Update uploading assets
			setUploadingAssets(newPlaceholders)

			// Show uploading process
			showUploadProcess('uploading')

			// Show message
			setUploadingFileName('Importing files from Drop Box')

			setUploadSourceType('dropbox')
			const { data } = await assetApi.importAssets('dropbox', files.map(file => ({ link: file.link, name: file.name, size: file.bytes })), getCreationParameters({estimateTime: 1, totalSize}))
			setAssets([...data, ...currentDataClone])
			setAddedIds(data.id)

			// Mark done
			const updatedAssets = data.map(asset => { return {...asset, status: 'done'}});

			// Update uploading assets
			setUploadingAssets(updatedAssets)

			// Mark process as done
			showUploadProcess('done')

			// Reset upload source type
			setUploadSourceType('')
			// toastUtils.success('Assets imported.')
		} catch (err) {
			//TODO: Handle error
			setAssets(currentDataClone)
			console.log(err)
			if (err.response?.status === 402) toastUtils.error(err.response.data.message)
			else toastUtils.error('Could not import assets, please try again later.')
		}
	}

	const onSubmit = async folderData => {
		try {
			const currentDataClone = [...folders]
			const { data } = await folderApi.createFolder(folderData)
			setActiveModal('')
			setFolders([data, ...currentDataClone])
			toastUtils.success('Collection created successfully')
		} catch (err) {
			// TODO: Show error message
			if (err.response?.data?.message) {
				setSubmitError(err.response.data.message)
			} else {
				setSubmitError('Something went wrong, please try again later')
			}
		}
	}

	const openDropboxSelector = (files) => {
		const options = {
			success: onDropboxFilesSelection,
			linkType: 'direct',
			multiselect: true,
			folderselect: false,
			sizeLimit: 1000 * 1024 * 1024
		}
		// Ignore this annoying warning
		Dropbox.choose(options)
	}

	const onDriveFilesSelection = async (files) => {
		const googleAuthToken = cookiesUtils.get('gdriveToken')
		const currentDataClone = [...assets]
		try {
			const newPlaceholders = []
			files.forEach(file => {
				newPlaceholders.push({
					asset: {
						name: file.name,
						createdAt: new Date(),
						size: file.sizeBytes,
						stage: 'draft',
						type: 'image'
					},
					isUploading: true
				})
			})
			setAssets([...newPlaceholders, ...currentDataClone])
			const { data } = await assetApi.importAssets('drive', files.map(file => ({
				googleAuthToken,
				id: file.id,
				name: file.name,
				size: file.sizeBytes,
				mimeType: file.mimeType
			})), getCreationParameters())
			setAssets([...data, ...currentDataClone])
			toastUtils.success('Assets imported.')
		} catch (err) {
			//TODO: Handle error
			setAssets(currentDataClone)
			console.log(err)
			if (err.response?.status === 402) toastUtils.error(err.response.data.message)
			else toastUtils.error('Could not import assets, please try again later.')
		}
	}

	const onLibraryImport = async () => {
		try {
			const assetIds = assets.filter(asset => asset.isSelected).map(assetItem => assetItem.asset.id)
			if (type === 'project') {
				await projectApi.associateAssets(itemId, { assetIds })
			} else if (type === 'task') {
				await taskApi.associateAssets(itemId, { assetIds })
			}
			closeSearchOverlay()
			toastUtils.success('Assets imported successfully')
		} catch (err) {
			console.log(err)
			closeSearchOverlay()
			toastUtils.error('Could not import Assets. Please try again later')
		}
	}

	const closeSearchOverlay = () => {
		setNeedsFetch('assets')
		setActiveSearchOverlay(false)
	}

	const dropdownOptions = [
		{
			label: 'Upload',
			text: 'png, jpg, mp4 and more',
			onClick: () => fileBrowserRef.current.click(),
			icon: Assets.file
		},
		{
			label: 'Upload',
			text: 'folder',
			onClick: () => folderBrowserRef.current.click(),
			icon: Assets.folder
		},
		{
			label: 'Dropbox',
			text: 'Import files',
			onClick: openDropboxSelector,
			icon: Assets.dropbox
		},
		// {
		// 	label: 'Google Drive',
		// 	text: 'Import files',
		// 	onClick: () => { },
		// 	icon: Assets.gdrive,
		// 	CustomContent: ({ children }) => (
		// 		<DriveSelector
		// 			onFilesSelect={onDriveFilesSelection}
		// 		>
		// 			{children}
		// 		</DriveSelector>
		// 	)
		// }
	]

	if (folderAdd) {
		dropdownOptions.unshift({
			label: 'Add Collection',
			text: 'Organized Files',
			onClick: () => setActiveModal('folder'),
			icon: Assets.folder
		})
	}

	if (activePageMode !== 'library') {
		dropdownOptions.unshift({
			label: 'Asset Library',
			text: 'Import from library',
			onClick: () => setActiveSearchOverlay(true),
			icon: Assets.asset
		})
	}

	const getCreationParameters = (attachQuery?: any) => {
		let queryData: any = {}
		if (activeFolder) {
			queryData.folderId = activeFolder
		}
		if (type === 'project') queryData.projectId = itemId
		if (type === 'task') queryData.taskId = itemId
		// Attach extra query
		if(attachQuery){
			queryData = {...queryData, ...attachQuery}
		}
		return queryData
	}

	const onFileChange = (e) => {
		onFilesDataGet(Array.from(e.target.files).map(originalFile => ({ originalFile })))
	}


	const SimpleButtonWrapper = ({ children }) => (
		<div className={`${styles['button-wrapper']} ${!folderAdd && styles['button-wrapper-displaced']}`}>
			<SimpleButton text='+' />
			{children}
		</div>
	)

	const DropDownOptions = () => {

		const Content = (option) => {
			return (
				<li className={styles.option}
					onClick={option.onClick}>
					<IconClickable src={option.icon} additionalClass={styles.icon} />
					<div className={styles['option-label']}>{option.label}</div>
					<div className={styles['option-text']}>{option.text}</div>
				</li>
			)
		}

		return (
			<ul className={`${styles['options-list']} ${styles[displayMode]}`}>
				{dropdownOptions.map(option => (
					<>
						{option.CustomContent ?
							<option.CustomContent>
								<Content {...option} />
							</option.CustomContent>
							:
							<Content {...option} />
						}
					</>
				))}
			</ul>
		)
	}

	return (
		<>
			<input multiple={true} id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
				onChange={onFileChange} />
			<input multiple={true} webkitdirectory='' webkitRelativePath='' id="file-input-id" ref={folderBrowserRef} style={{ display: 'none' }} type='file'
				onChange={onFileChange} />
			{displayMode === 'dropdown' ?
				<ToggleAbleAbsoluteWrapper
					Wrapper={SimpleButtonWrapper}
					Content={DropDownOptions}
				/>
				:
				<DropDownOptions />
			}
			<FolderModal
				modalIsOpen={activeModal === 'folder'}
				closeModal={() => setActiveModal('')}
				onSubmit={onSubmit}
			/>
			{activeSearchOverlay &&
				<SearchOverlay
					closeOverlay={closeSearchOverlay}
					importAssets={onLibraryImport}
					importEnabled={true}
				/>
			}
		</>
	)
}

export default AssetAddition
