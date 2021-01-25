import { useContext } from 'react'
import { AssetContext, UserContext } from '../../../context'
import downloadUtils from '../../../utils/download'

import { ASSET_DOWNLOAD } from '../../../constants/permissions'

// Components
import Button from '../../common/buttons/button'

const AssetHeaderOps = ({ isUnarchive = false, itemType = '', isShare = false }) => {
	const {
		assets,
		setAssets,
		setActiveOperation
	} = useContext(AssetContext)

	const { hasPermission } = useContext(UserContext)

	const selectedAssets = assets.filter(asset => asset.isSelected)

	const downloadSelectedAssets = async () => {
		downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
	}

	const deselectAll = () => {
		setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
	}
	return (
		<>
			{!isShare && <Button text={'Delete'} type='button' styleType='tertiary' onClick={() => setActiveOperation('delete')} />}
			{!isShare && <Button text={isUnarchive ? 'Unarchive' : 'Archive'} type='button' styleType='tertiary' onClick={() => setActiveOperation(isUnarchive ? 'unarchive' : 'archive')} />}
			{(isShare || hasPermission([ASSET_DOWNLOAD])) && <Button text={'Download'} type='button' styleType={isShare ? 'secondary' : 'tertiary'} onClick={downloadSelectedAssets} />}
			{!isShare && <Button text={'Move'} type='button' styleType='tertiary' onClick={() => setActiveOperation('move')} />}
			{!isShare && <Button text={'Copy'} type='button' styleType='tertiary' onClick={() => setActiveOperation('copy')} />}
			{!isShare && <Button text={'Share'} type='button' styleType='tertiary' onClick={() => setActiveOperation('share')} />}
			{itemType && !isShare && <Button text={'Remove'} type='button' styleType='tertiary' onClick={() => setActiveOperation('remove_item')} />}
			<Button text={`Deselect All (${selectedAssets.length})`} type='button' styleType='primary' onClick={deselectAll} />
		</>
	)
}

export default AssetHeaderOps