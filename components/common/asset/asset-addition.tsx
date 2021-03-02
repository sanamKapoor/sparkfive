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

	const { assets, setAssets, setNeedsFetch, setAddedIds, activePageMode, folders, setFolders } = useContext(AssetContext)

	const onFilesDataGet = async (files) => {
		const currentDataClone = [...assets]
		const currenFolderClone = [...folders]
		try {
			let needsFolderFetch
			const formData = new FormData()
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
			files.forEach(file => {
				newPlaceholders.push({
					asset: {
						name: file.originalFile.name,
						createdAt: new Date(),
						size: file.originalFile.size,
						stage: 'draft',
						type: 'image'
					},
					isUploading: true
				})
				formData.append('asset', file.path || file.originalFile)
			})
			setAssets([...newPlaceholders, ...currentDataClone])
			setFolders([...folderPlaceholders, ...currenFolderClone])
			const { data } = await assetApi.uploadAssets(formData, getCreationParameters())
			if (needsFolderFetch) {
				setNeedsFetch('folders')
			} else {
				setAssets([...data, ...currentDataClone])
				setAddedIds(data.map(assetItem => assetItem.asset.id))
			}
			toastUtils.success(`${data.length} Asset(s) uploaded.`)
		} catch (err) {
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
			const newPlaceholders = []
			files.forEach(file => {
				newPlaceholders.push({
					asset: {
						name: file.name,
						createdAt: new Date(),
						size: file.size,
						stage: 'draft',
						type: 'image'
					},
					isUploading: true
				})
			})
			setAssets([...newPlaceholders, ...currentDataClone])
			const { data } = await assetApi.importAssets('dropbox', files.map(file => ({ link: file.link, name: file.name, size: file.bytes })), getCreationParameters())
			setAssets([...data, ...currentDataClone])
			setAddedIds(data.id)
			toastUtils.success('Assets imported.')
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

	const getCreationParameters = () => {
		const queryData = {}
		if (activeFolder) {
			queryData.folderId = activeFolder
		}
		if (type === 'project') queryData.projectId = itemId
		if (type === 'task') queryData.taskId = itemId
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