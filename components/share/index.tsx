// External import
import update from "immutability-helper"
import { useEffect, useState } from 'react'

// Styles
import styles from './index.module.css'

import assetApi from '../../server-api/asset'
import toastUtils from '../../utils/toast'
import urlUtils from '../../utils/url'

// Utils
import downloadUtils from '../../utils/download'

// Components
import ShareItem from './share-item'
import ShareOperationButtons from "./share-operation-buttons"

const AssetShare = () => {

	const [assets, setAssets] = useState([])
	const [selectedAsset, setSelectedAsset] = useState(0)

	// Toggle select asset
	const toggleSelected = (id) => {
		const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)

		// Toggle selected item
		if(!assets[assetIndex].isSelected){
			setSelectedAsset(selectedAsset+1)
		}else{
			setSelectedAsset(selectedAsset-1)
		}

		setAssets(update(assets, {
			[assetIndex]: {
				isSelected: { $set: !assets[assetIndex].isSelected }
			}
		}))
	}

	// Select/Deselect all assets
	const selectAll = () => {
		// If already select all, do deselect
		if(selectedAsset){
			setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: false })))
			setSelectedAsset(0)
		}else{
			setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
			setSelectedAsset(assets.length)
		}

	}

	// Download select assets
	const downloadSelectedAssets = async () => {
		const selectedAssets = assets.filter(asset => asset.isSelected)

		downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
	}

	useEffect(() => {
		getAssets()
	}, [])

	const getAssets = async () => {
		try {
			const { shareJWT } = urlUtils.getQueryParameters()
			if (shareJWT) {
				const { data } = await assetApi.getSharedAssets(shareJWT)
				setAssets(data)
			}
		} catch (err) {
			toastUtils.error('Could not get assets from server')
		}
	}

	return (
		<section className={styles.container}>
			<ShareOperationButtons selectAll={selectAll} selectedAsset={selectedAsset} downloadSelectedAssets={downloadSelectedAssets}/>
			<div className={styles['list-wrapper']}>
				<ul className={styles['grid-list']}>
					{assets.map((assetItem) => {
						return (
							<li className={styles['grid-item']} key={assetItem.asset.id}>
								<ShareItem {...assetItem} toggleSelected={()=>{toggleSelected(assetItem.asset.id)}} selectAll={selectAll}/>
							</li>
						)
					})}
				</ul>
			</div>
		</section >
	)
}

export default AssetShare
