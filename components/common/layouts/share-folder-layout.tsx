import styles from './share-folder-layout.module.css'
import { GeneralImg } from '../../../assets'
import { useState, useEffect, useContext } from "react"
import { AssetContext, ShareContext, FilterContext } from '../../../context'

import AssetHeaderOps from '../asset/asset-header-ops'

const ShareFolderLayout = ({ children, advancedLink = false }) => {

	const { folderInfo } = useContext(ShareContext)
	const { assets, folders } = useContext(AssetContext)
	const { activeSortFilter } = useContext(FilterContext)

	const selectedAssets = assets.filter(asset => asset.isSelected)
	const selectedFolders = folders.filter(folder => folder.isSelected)

	const amountSelected= activeSortFilter.mainFilter === 'folders' ? selectedFolders.length : selectedAssets.length

	return (
		<>
			<header className={styles.header} id={"share-header"}>
				<div className={styles['image-wrapper']}>
					<img
						className={styles['logo-img']}
						src={folderInfo?.teamIcon || GeneralImg.logo} />
				</div>
				<h1 className={styles['collection-name']}>{folderInfo?.folderName}</h1>
			</header>
			{amountSelected > 0 &&
					<div className={styles['ops-wrapper']}>
						<AssetHeaderOps isShare={true} advancedLink={advancedLink} isFolder={activeSortFilter.mainFilter === 'folders'}/>
					</div>
				}
			{children}
			<footer className={styles.footer}>
			</footer>
		</>
	)
}

export default ShareFolderLayout
