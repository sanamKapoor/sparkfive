// External import
import update from "immutability-helper"
import {useContext, useEffect, useState, useRef} from 'react'

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
import fileDownload from "js-file-download";
import AssetDownloadProcess from "./asset-download-process"


// Contexts
import { AssetContext } from '../../context'

const AssetShare = () => {

	const {
		updateDownloadingStatus
	} = useContext(AssetContext)

	const [assets, setAssets] = useState([])
	const [selectedAsset, setSelectedAsset] = useState(0)
	const [showDownloadPopup, setShowDownloadPopup] = useState(false)
	const [downloadStatus, setDownloadStatus] = useState("")
	const [downloadingPercent, setDownloadingPercent] = useState(30)
	const interval = useRef()

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

	const zipping = () => {
		setDownloadStatus("zipping")
		setShowDownloadPopup(true)
		// simulateProcess();
	}

	const done = () => {
		setDownloadStatus("done")
		// cancelSimulatedProcess
	}

	const simulateProcess = () => {
		// @ts-ignore
		interval.current = setInterval(()=>{
			if(downloadingPercent < 100){
				setDownloadingPercent(downloadingPercent+10)
			}

		},1000)
	}

	const cancelSimulatedProcess = () => {
		if(interval.current){
			clearInterval(interval.current)
			setDownloadingPercent(0)
		}

	}

	// Download select assets
	const downloadSelectedAssets = async () => {
		try{

			const { shareJWT } = urlUtils.getQueryParameters()

			const selectedAssets = assets.filter(asset => asset.isSelected)

			let payload = {
				assetIds: selectedAssets.map((item)=>item.asset.id),
			};

			// Show processing bar
			zipping()

			const { data } = await assetApi.shareDownload(payload, {shareJWT});
			// Download file to storage
			fileDownload(data, "assets.zip");

			done();

			// downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets.zip')
		}catch (e){

		}

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

			{showDownloadPopup && <AssetDownloadProcess downloadingStatus={downloadStatus} onClose={()=>{setShowDownloadPopup(false)}} downloadingPercent={downloadingPercent} selectedAsset={selectedAsset}/>}
		</section >
	)
}

export default AssetShare
