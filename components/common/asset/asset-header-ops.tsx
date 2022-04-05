// External
import { useContext, useEffect, useState } from 'react'
import fileDownload from 'js-file-download';
import zipDownloadUtils from '../../../utils/download'

import styles from './asset-header-ops.module.css'

// Contexts
import { AssetContext, UserContext, FilterContext } from '../../../context'

// Utils
import downloadUtils from '../../../utils/download'
import { ASSET_DOWNLOAD } from '../../../constants/permissions'
import { getAssetsFilters } from '../../../utils/asset'
import assetApi from '../../../server-api/asset'
import shareApi from '../../../server-api/share-collection'
import folderApi from '../../../server-api/folder'

// Components
import { AssetOps } from '../../../assets'

// Components
import Button from '../../common/buttons/button'
import IconClickable from '../../common/buttons/icon-clickable'
import { useRouter } from "next/router";

const AssetHeaderOps = ({ isUnarchive = false, itemType = '', isShare = false, isFolder = false, deselectHidden = false, iconColor = '', deletedAssets = false }) => {
	const {
		assets,
		setAssets,
		folders,
		setFolders,
		setActiveOperation,
		selectedAllAssets,
		selectAllAssets,
		totalAssets,
		activeFolder,
		updateDownloadingStatus
	} = useContext(AssetContext)

	const router = useRouter()

	const { hasPermission } = useContext(UserContext)

	const { activeSortFilter, term } = useContext(FilterContext)
	const [sharePath, setSharePath] = useState('')

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
			if (isShare) {
				api = shareApi
			}

			if (payload.assetIds.length > 0 || selectedAllAssets) {
                const { data } = await api.downloadAll(payload, filters);
                // Download file to storage
                fileDownload(data, "assets.zip");

                updateDownloadingStatus("done", 0, 0);
            } else if (payload.folderIds.length > 0) {
				const { data } = await folderApi.downloadFoldersAsZip(payload, filters);

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
			updateDownloadingStatus('error', 0, 0, 'Internal Server Error. Please try again.')
		}

		// downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
	}

	const deselectAll = () => {
		if (!isFolder) {
			// Mark deselect all
			selectAllAssets(false)

			setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
		} else {
			setFolders(folders.map(folder => ({ ...folder, isSelected: false })))
		}
	}

	useEffect(() => {
		const { asPath } = router
		if (asPath) {
			// Get shareUrl from path
			const splitPath = asPath.split('collections/')
			setSharePath(splitPath[1])
		}
	}, [router.asPath])

	return (
		<>
			{(!isShare && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`edit${iconColor}`]} tooltipText={'Edit'} tooltipId={'Edit'} onClick={() => setActiveOperation('edit')} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`delete${iconColor}`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => setActiveOperation('update')} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps.generateThumbnail} tooltipText={'Generate thumbnail'} onClick={() => setActiveOperation('generate_thumbnails')} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`archive${iconColor}`]} tooltipText={isUnarchive ? 'Unarchive' : 'Archive'} tooltipId={isUnarchive ? 'Unarchive' : 'Archive'} onClick={() => setActiveOperation(isUnarchive ? 'unarchive' : 'archive')} />}
			{(isShare || hasPermission([ASSET_DOWNLOAD]) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`download${iconColor}`]} tooltipId={'Download'} tooltipText={'Download'} onClick={downloadSelectedAssets} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`move${iconColor}`]} tooltipText={'Add to Collection'} tooltipId={'Move'} onClick={() => setActiveOperation('move')} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`copy${iconColor}`]} tooltipText={'Copy'} tooltipId={'Copy'} onClick={() => setActiveOperation('copy')} />}
			{((!isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`share${iconColor}`]} tooltipText={'Share'} tooltipId={'Share'} onClick={() => setActiveOperation('share')} />}
			{((isFolder && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`share${iconColor}`]} tooltipText={'Share'} tooltipId={'Share'} onClick={() => setActiveOperation('shareCollections')} />}
			{((!isFolder && itemType && !isShare) && !deletedAssets) && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`delete${iconColor}`]} tooltipText={'Remove'} onClick={() => setActiveOperation('remove_item')} />}
			{deletedAssets && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`move${iconColor}`]} tooltipText={'Recover Asset'} tooltipId={'Recover'} onClick={() => setActiveOperation('recover')} />}
			{deletedAssets && <IconClickable additionalClass={styles['action-button']} src={AssetOps[`delete${iconColor}`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => setActiveOperation('delete')} />}
			{!deselectHidden && <Button text={`Deselect All (${!isFolder ? (totalSelectAssets) : selectedFolders.length})`} type='button' styleType='primary' onClick={deselectAll} />}
		</>
	)
}

export default AssetHeaderOps
