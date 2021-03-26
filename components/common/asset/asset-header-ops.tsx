import styles from './asset-header-ops.module.css'
import { useContext } from 'react'
import { AssetContext, UserContext } from '../../../context'
import downloadUtils from '../../../utils/download'

import { ASSET_DOWNLOAD } from '../../../constants/permissions'

import { AssetOps } from '../../../assets'

// Components
import Button from '../../common/buttons/button'
import IconClickable from '../../common/buttons/icon-clickable'

const AssetHeaderOps = ({ isUnarchive = false, itemType = '', isShare = false, isFolder = false, deselectHidden = false, iconColor = '' }) => {
	const {
		assets,
		setAssets,
		folders,
		setFolders,
		setActiveOperation,
		selectedAllAssets,
		selectAllAssets,
		totalAssets
	} = useContext(AssetContext)

	const { hasPermission } = useContext(UserContext)

	const selectedAssets = assets.filter(asset => asset.isSelected)
	let totalSelectAssets = selectedAssets.length;

	// Hidden pagination assets are selected
	if(selectedAllAssets){
		// Get assets is not selected on screen
		const currentUnSelectedAssets = assets.filter(asset => !asset.isSelected)
		totalSelectAssets  = totalAssets - currentUnSelectedAssets.length
	}


	const selectedFolders = folders.filter(folder => folder.isSelected)

	const downloadSelectedAssets = async () => {
		downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
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

	return (
		<>
			{!isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`edit${iconColor}`]} tooltipText={'Edit'} tooltipId={'Edit'} onClick={() => setActiveOperation('edit')} />}
			{!isFolder && !isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`delete${iconColor}`]}  tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => setActiveOperation('delete')} />}
			{!isFolder && !isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`archive${iconColor}`]}  tooltipText={isUnarchive ? 'Unarchive' : 'Archive'} tooltipId={isUnarchive ? 'Unarchive' : 'Archive'} onClick={() => setActiveOperation(isUnarchive ? 'unarchive' : 'archive')} />}
			{!isFolder && (isShare || hasPermission([ASSET_DOWNLOAD])) && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`download${iconColor}`]}  tooltipId={'Download'} tooltipText={'Download'} onClick={downloadSelectedAssets} />}
			{!isFolder && !isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`move${iconColor}`]}  tooltipText={'Move'} tooltipId={'Move'} onClick={() => setActiveOperation('move')} />}
			{!isFolder && !isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`copy${iconColor}`]}  tooltipText={'Copy'} tooltipId={'Copy'} onClick={() => setActiveOperation('copy')} />}
			{!isFolder && !isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`share${iconColor}`]}  tooltipText={'Share'} tooltipId={'Share'} onClick={() => setActiveOperation('share')} />}
			{!isFolder && itemType && !isShare && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`delete${iconColor}`]}  tooltipText={'Remove'} onClick={() => setActiveOperation('remove_item')} />}
			{!deselectHidden && <Button text={`Deselect All (${!isFolder ? (totalSelectAssets) : selectedFolders.length})`} type='button' styleType='primary' onClick={deselectAll} />}
		</>
	)
}

export default AssetHeaderOps
