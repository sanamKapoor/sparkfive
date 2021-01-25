import styles from './share-folder-layout.module.css'
import { GeneralImg } from '../../../assets'
import { useState, useEffect, useContext } from "react"
import { ShareContext } from '../../../context'

const ShareFolderLayout = ({ children }) => {

	const { folderInfo } = useContext(ShareContext)

	return (
		<>
			<header className={styles.header}>
				<img
					className={styles['logo-img']}
					src={folderInfo?.teamIcon || GeneralImg.logo} />
				<h1>{folderInfo?.folderName}</h1>
			</header>
			{children}
			<footer className={styles.footer}>
			</footer>
		</>
	)
}

export default ShareFolderLayout
