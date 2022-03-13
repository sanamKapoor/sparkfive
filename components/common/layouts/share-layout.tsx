import styles from './share-layout.module.css'
import { GeneralImg, Navigation, Utilities } from '../../../assets'
import AssetContextProvider from '../../../context/asset-provider'
import AssetHeaderOps from "../asset/asset-header-ops";

const ShareLayout = ({ children }) => {
	return (
		<>
			<AssetContextProvider>
				{children}
				<footer className={styles.footer}>
				</footer>
			</AssetContextProvider>
		</>
	)
}

export default ShareLayout
