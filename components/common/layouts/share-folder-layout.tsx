import styles from './share-folder-layout.module.css'
import { GeneralImg } from '../../../assets'
import { useState, useEffect, useContext } from "react"
import { AssetContext, ShareContext } from '../../../context'

import AssetHeaderOps from '../asset/asset-header-ops'

const ShareFolderLayout = ({ children }) => {

	const { folderInfo } = useContext(ShareContext)
	const { assets } = useContext(AssetContext)

	const selectedAssets = assets.filter(asset => asset.isSelected)

	return (
		<>
			<header className={styles.header}>
				<img
					className={styles['logo-img']}
					src={folderInfo?.teamIcon || GeneralImg.logo} />
				<h1>{folderInfo?.folderName}</h1>
				{selectedAssets.length > 0 &&
					<div className={styles['ops-wrapper']}>
						<AssetHeaderOps isShare={true} />
					</div>
				}
			</header>
			{children}
			<footer className={styles.footer}>
			</footer>
		</>
	)
}

export default ShareFolderLayout
