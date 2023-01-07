// External
import { useContext, useEffect, useRef, useState } from 'react'
import fileDownload from 'js-file-download';
import zipDownloadUtils from '../../../utils/download'

import styles from './asset-header-ops.module.css'

// Contexts
import { AssetContext, UserContext, FilterContext, LoadingContext } from '../../../context'

// Utils
import downloadUtils from '../../../utils/download'
import { ASSET_DOWNLOAD } from '../../../constants/permissions'
import { getAssetsFilters } from '../../../utils/asset'
import assetApi from '../../../server-api/asset'
import shareApi from '../../../server-api/share-collection'
import folderApi from '../../../server-api/folder'
import { Utilities } from '../../../assets'

// Utils
import { getSubdomain } from '../../../utils/domain'
import toastUtils from '../../../utils/toast'

// Components
import { AssetOps } from '../../../assets'

// Components
import Button from '../../common/buttons/button'
import IconClickable from '../../common/buttons/icon-clickable'
import { useRouter } from "next/router";
import ConfirmModal from "../modals/confirm-modal"

// Constants
import { maximumAssociateFiles} from "../../../constants/asset-associate";

const AssetHeaderOps = ({
							isUnarchive = false,
							itemType = '',
							isShare = false,
							isFolder = false,
							deselectHidden = false,
							iconColor = '',
							deletedAssets = false,
							advancedLink = false,
							isSearch = false,
}) => {
	const {
		assets,
		setAssets,
		folders,
		setFolders,
		setActiveOperation,
		selectedAllAssets,
		selectAllAssets,
		selectAllFolders,
		totalAssets,
		activeFolder,
		updateDownloadingStatus,
		setNeedsFetch
	} = useContext(AssetContext)

	const { setIsLoading } = useContext(LoadingContext);

	const router = useRouter()

	const { hasPermission } = useContext(UserContext)

	const { activeSortFilter, term, setSharePath: setContextPath } = useContext(FilterContext)
	const [sharePath, setSharePath] = useState('')
	const [showShareAction, setShowShareAction] = useState(false)
	const contentRef = useRef(null)
	const [showMoreActions, setShowMoreActions] = useState(false)
	const [showAssociateModalOpen, setShowAssociateModalOpen] = useState(false)

	const selectedAssets = assets.filter(asset => asset.isSelected)
	let totalSelectAssets = selectedAssets.length;

	// Hidden pagination assets are selected
	if (selectedAllAssets) {
		// Get assets is not selected on screen
		const currentUnSelectedAssets = assets.filter(asset => !asset.isSelected)
		totalSelectAssets = totalAssets - currentUnSelectedAssets.length
	}


	const selectedFolders = folders.filter(folder => folder.isSelected)
	if (selectedFolders.length > 0) {
		totalSelectAssets = selectedFolders.length;
	}

	const downloadSelectedAssets = async () => {
		console.log(`selectedAllAssets: ${selectedAllAssets}`)
		try {
			let payload = {
				assetIds: [],
				folderIds: [],
			};
			let totalDownloadingAssets = 0;
			let filters = {
				estimateTime: 1
			}

			if (selectedAllAssets) {
				totalDownloadingAssets = totalAssets
				// Download all assets without pagination
				filters = {
					...getAssetsFilters({
						replace: false,
						activeFolder,
						addedIds: [],
						nextPage: 1,
						userFilterObject: activeSortFilter,
					}),
					selectedAll: 1,
					estimateTime: 1
				};

				if (term) {
					// @ts-ignore
					filters.term = term;
				}
				// @ts-ignore
				delete filters.page
			} else if (selectedFolders.length > 0) {
				totalDownloadingAssets = selectedFolders.length;
				payload.folderIds = selectedFolders.map((folder) => folder.id);
			} else {
				totalDownloadingAssets = selectedAssets.length
				payload.assetIds = selectedAssets.map(assetItem => assetItem.asset.id)
			}

			// Add sharePath property if user is at share collection page
			if (sharePath) {
				filters['sharePath'] = sharePath
			}

			// Show processing bar
			updateDownloadingStatus('zipping', 0, totalDownloadingAssets)
			let api = assetApi;

			if (payload.assetIds.length > 0 || selectedAllAssets) {
				if (isShare) {
					api = shareApi
				}
				const { data } = await api.downloadAll(payload, filters);
				// Download file to storage
				fileDownload(data, "assets.zip");

				updateDownloadingStatus("done", 0, 0);
			} else if (payload.folderIds.length > 0) {
				api = folderApi
				if (isShare) {
					api = shareApi
				}
				const { data } = await api.downloadFoldersAsZip(payload, filters);

				// Download file to storage
				fileDownload(data, "assets.zip");

				updateDownloadingStatus("done", 0, 0);
				// let filedata = [];
				// for await (const folderId of payload.folderIds) {
				// let { data } = await folderApi.getInfoToDownloadFolder(folderId.id);
				// data["name"] = folderId.name;
				// filedata.push(data);
				// }
				// zipDownloadUtils.zipAndDownloadCollection(filedata, "collection");
				// updateDownloadingStatus("done", 0, 0);
			}
		} catch (e) {
			console.error(e)
			updateDownloadingStatus('error', 0, 0, 'Internal Server Error. Please try again.')
		}

		// downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
	}

	const associateAssets = async () => {
		if (!isFolder) {
			setIsLoading(true)
			const assetIds = selectedAssets.map(assetItem => assetItem.asset.id)

			if(assetIds.length > 1){
				const assetsToAssociate = selectedAssets.filter(assetItem => (assetItem.asset.fileAssociations.length + selectedAssets.length-1) <= maximumAssociateFiles)
				if(assetsToAssociate.length !== selectedAssets.length){
					setIsLoading(false)
					toastUtils.error(`Some of your selected assets have already maximum ${maximumAssociateFiles} associated files`)
				}else{
					await assetApi.associate(assetIds)
					setNeedsFetch('asset')
					toastUtils.success('Association successful')
					setIsLoading(false)
				}
			}else{
				setIsLoading(false)
				toastUtils.error('Please select at least 2 assets to associate')
			}

		}
	}

	const deselectAll = () => {
		if (!isFolder) {
			// Mark deselect all
			selectAllAssets(false)

			setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
		} else {
			selectAllFolders(false)
			setFolders(folders.map(folder => ({ ...folder, isSelected: false })))
		}
	}

	const processSubdomain = () => {
		return getSubdomain() || "danner"
	}

	useEffect(() => {
		const { asPath } = router
		if (asPath) {
			if (advancedLink) {
				// TODO: Optimize exact path
				const splitPath = asPath.split('/collections/')

				const idPath = splitPath[1].split('/')

				if (idPath && !idPath[0].includes("[team]") && !idPath[1].includes("[id]")) {
					const path = `${processSubdomain()}/${idPath[1]}/${idPath[0]}`
					setSharePath(path)
					setContextPath(path)
				}
			} else {
				// Get shareUrl from path
				const splitPath = asPath.split('collections/')
				setSharePath(splitPath[1])
			}

		}
	}, [router.asPath])

	const handleClickOutside = (event) => {
		if (contentRef.current && !contentRef.current.contains(event.target)) {
			showShareActionList(null, false)
		}
	}

	const showShareActionList = (e, visible) => {
		if (e) {
			e.stopPropagation()
		}

		const getCustomFields = (filters) => {
			let fields = ''
			Object.keys(filters).map((key) => {
				if (key.includes('custom-p')) {
					if (fields) {
						fields = `${fields},${filters[key]}`
					} else {
						fields = `${filters[key]}`
					}
				}
			})

			return fields
		}

		const filters = {
			...getAssetsFilters({
				replace: false,
				activeFolder,
				addedIds: [],
				nextPage: 1,
				userFilterObject: activeSortFilter,
			}),
			selectedAll: "1",
		};

		const customFields = getCustomFields(filters)

		// Select all assets in folder
		if (filters['folderId'] && (customFields || filters['tags']) && selectedAllAssets) {
			setShowShareAction(visible)
			if (visible) {
				document.addEventListener("mousedown", handleClickOutside);
			} else {
				document.removeEventListener("mousedown", handleClickOutside);
			}
		} else {
			setActiveOperation('share')
		}
	}

	return (
		<>
			{(!isShare && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`edit${iconColor}`]} tooltipText={'Edit'} tooltipId={'Edit'} onClick={() => setActiveOperation('edit')} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`delete${iconColor}`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => setActiveOperation('update')} />}
			{(isShare || hasPermission([ASSET_DOWNLOAD]) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`download${iconColor}`]} tooltipId={'Download'} tooltipText={'Download'} onClick={downloadSelectedAssets} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`move${iconColor}`]} tooltipText={'Add to Collection'} tooltipId={'Move'} onClick={() => setActiveOperation('move')} />}
			{((!isFolder && !isShare) && !deletedAssets) &&
				<div className={styles['share-wrapper']} ref={contentRef}>
					<IconClickable
						place={'bottom'}
						additionalClass={`${styles['action-button']}`}
						src={AssetOps[`share${iconColor}`]}
						tooltipText={'Share'}
						tooltipId={'Share'}
						onClick={(e) => {
							showShareActionList(e, true)
							// setActiveOperation('share')
						}}
					/>


					{showShareAction && <div className={styles['share-popover']}>
						<div className={styles['share-title']}>
							Share

							<img src={Utilities.blueClose} alt={"close"} onClick={(e) => {
								showShareActionList(e, false)
							}} />
						</div>
						<ul>
							<li className={styles['share-item']} onClick={() => {
								setShowShareAction(false)
								setActiveOperation('share-as-subcollection')
							}}>
								<img src={Utilities.gridView} alt={"share-collection"} />
								<span className={"font-weight-500"}>Share as Collection</span>
								<p className={styles['share-description']}>
									Create a branded collection
								</p>
							</li>
							<li className={styles['share-item']}
								onClick={() => {
									setShowShareAction(false)
									setActiveOperation('share')
								}}>
								<img src={Utilities.share} alt={"share-file"} />
								<span className={"font-weight-500"}>Share Files</span>
								<p className={styles['share-description']}>
									Create a link to shared file(s)
								</p>
							</li>
						</ul>

					</div>}
				</div>
			}
			{showMoreActions && (
				<>
					{((!isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={`${styles['action-button']} m-l-0`} src={AssetOps.generateThumbnail} tooltipText={'Generate thumbnail'} onClick={() => setActiveOperation('generate_thumbnails')} />}
					{((!isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`archive${iconColor}`]} tooltipText={isUnarchive ? 'Unarchive' : 'Archive'} tooltipId={isUnarchive ? 'Unarchive' : 'Archive'} onClick={() => setActiveOperation(isUnarchive ? 'unarchive' : 'archive')} />}
					{((!isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`copy${iconColor}`]} tooltipText={'Copy'} tooltipId={'Copy'} onClick={() => setActiveOperation('copy')} />}
					{((!isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`moveReplace${iconColor}`]} tooltipText={'Move'} tooltipId={'MoveReplace'} onClick={() => setActiveOperation('moveReplace')} />}
					{((!isFolder && !isShare) && !deletedAssets) && (
						<>
							<IconClickable place={'bottom'} additionalClass={styles['action-button']} src={isSearch ? AssetOps.associateBlue : AssetOps.associate} tooltipText={'Associate'} tooltipId={'Associate'} onClick={() => setShowAssociateModalOpen(true)} />

							<ConfirmModal
								closeModal={() => setShowAssociateModalOpen(false)}
								confirmAction={() => {
									setActiveOperation('associate')
									setShowAssociateModalOpen(false)

									associateAssets()
								}}
								confirmText={"Associate"}
								message={
									<span className=''>
										Are you sure you would like to associate these ({totalSelectAssets}) files with each other?
									</span>
								}
								modalIsOpen={showAssociateModalOpen}
							/>
						</>
					)}
				</>

			)}
			{((isFolder && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`share${iconColor}`]} tooltipText={'Share'} tooltipId={'Share'} onClick={() => setActiveOperation('shareCollections')} />}
			{((!isFolder && itemType && !isShare) && !deletedAssets) && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`delete${iconColor}`]} tooltipText={'Remove'} onClick={() => setActiveOperation('remove_item')} />}
			{deletedAssets && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`move${iconColor}`]} tooltipText={'Recover Asset'} tooltipId={'Recover'} onClick={() => setActiveOperation('recover')} />}
			{deletedAssets && <IconClickable place={'bottom'} additionalClass={styles['action-button']} src={AssetOps[`delete${iconColor}`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => setActiveOperation('delete')} />}

			{showMoreActions ? (
				<span className={isSearch ? styles['search-less-icons-button'] : styles['less-icons-button']} onClick={() => setShowMoreActions(false)}>Less Icons</span>
			) : (
				<IconClickable place={'bottom'} additionalClass={`${styles['action-button']} m-l-0`} src={isSearch  ? Utilities.more :  Utilities.moreWhite} tooltipText={'More'} tooltipId={'More'} onClick={() => setShowMoreActions(true)} />
			)}

			{!deselectHidden && <Button className={styles['deselect-button']} text={`Deselect All (${!isFolder ? (totalSelectAssets) : selectedFolders.length})`} type='button' styleType='primary' onClick={deselectAll} />}
		</>
	)
}

export default AssetHeaderOps
