import styles from './share-folder-layout.module.css'
import { GeneralImg } from '../../../assets'
import { useState, useEffect } from "react";

const ShareFolderLayout = ({ children }) => {

	const folder = {
		icon: 'https://images.pexels.com/photos/1202481/pexels-photo-1202481.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
		name: 'El Gato',
	}

	const [folderIcon, setFolderIcon] = useState(GeneralImg.logo)
	const [folderName, setFolderName] = useState(folder.name)

	useEffect(() => {
		if (folder.icon) {
			setFolderIcon(folder.icon)
		} else {
			setFolderIcon(GeneralImg.logo)
		}
	}, []);

	return (
		<>
			<header className={styles.header}>
				<img
					className={styles['logo-img']}
					src={folderIcon} />
				<h1>{folderName}</h1>
			</header>
			{children}
			<footer className={styles.footer}>
			</footer>
		</>
	)
}

export default ShareFolderLayout
