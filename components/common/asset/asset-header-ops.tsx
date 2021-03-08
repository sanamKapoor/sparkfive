import { useContext } from 'react'
import { AssetContext, UserContext } from '../../../context'
import downloadUtils from '../../../utils/download'

import { ASSET_DOWNLOAD } from '../../../constants/permissions'

// Components
import Button from '../../common/buttons/button'

const AssetHeaderOps = ({ isUnarchive = false, itemType = '', isShare = false, isFolder = false, deselectHidden = false, buttonStyleType = 'tertiary' }) => {
	const {
		assets,
		setAssets,
		folders,
		setFolders,
		setActiveOperation
	} = useContext(AssetContext)

	const { hasPermission } = useContext(UserContext)

	const selectedAssets = assets.filter(asset => asset.isSelected)
	const selectedFolders = folders.filter(folder => folder.isSelected)

	const downloadSelectedAssets = async () => {
		downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
	}

	const deselectAll = () => {
		if (!isFolder) {
			setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
		} else {
			setFolders(folders.map(folder => ({ ...folder, isSelected: false })))
		}
	}

	return (
		<>
			{!isShare && <Button text={'Edit'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation('edit')} />}
			{!isFolder && !isShare && <Button text={'Delete'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation('delete')} />}
			{!isFolder && !isShare && <Button text={isUnarchive ? 'Unarchive' : 'Archive'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation(isUnarchive ? 'unarchive' : 'archive')} />}
			{!isFolder && (isShare || hasPermission([ASSET_DOWNLOAD])) && <Button text={'Download'} type='button' styleType={isShare ? 'secondary' : buttonStyleType} onClick={downloadSelectedAssets} />}
			{!isFolder && !isShare && <Button text={'Move'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation('move')} />}
			{!isFolder && !isShare && <Button text={'Copy'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation('copy')} />}
			{!isFolder && !isShare && <Button text={'Share'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation('share')} />}
			{!isFolder && itemType && !isShare && <Button text={'Remove'} type='button' styleType={buttonStyleType} onClick={() => setActiveOperation('remove_item')} />}
			{!deselectHidden && <Button text={`Deselect All (${!isFolder ? selectedAssets.length : selectedFolders.length})`} type='button' styleType='primary' onClick={deselectAll} />}
		</>
	)
}

export default AssetHeaderOps