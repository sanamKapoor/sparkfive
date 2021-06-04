import {useContext} from "react";

import styles from './guest-upload-layout.module.css'
import { GeneralImg } from '../../../assets'

import AssetContextProvider from '../../../context/asset-provider'
import  { GuestUploadContext } from '../../../context'

const GuestUploadLayout = ({ children }) => {
	const { logo } = useContext(GuestUploadContext)

	return (
		<>
			<AssetContextProvider>
				<header className={styles.header}>
					<img
						className={`${styles['logo-img']} ${styles['left-logo']}`}
						src={logo ? logo : GeneralImg.logo} />

						<div className={styles['title']}>Guest Upload</div>

					<div className={styles['right-logo']}>
						<span>Powered by Sparkfive</span>
						<img
							className={styles['logo-img']}
							src={GeneralImg.logo} />
					</div>

				</header>
				{children}
				<footer className={styles.footer}>
				</footer>
			</AssetContextProvider>
		</>
	)
}

export default GuestUploadLayout
