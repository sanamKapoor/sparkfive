import styles from './folder-options.module.css'
import { Utilities } from '../../../assets'

// Components
import IconClickable from '../buttons/icon-clickable'
import Dropdown from '../inputs/dropdown'
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'

const FolderOptions = ({
	downloadFoldercontents,
	setDeleteOpen,
	shareAssets,
	copyShareLink,
	copyEnabled
}) => {

	const options = [
		{ label: 'Download', onClick: downloadFoldercontents },
		{ label: 'Delete', onClick: () => setDeleteOpen(true) },
		{ label: 'Share', onClick: shareAssets }
	]

	if (copyEnabled) options.push({ label: 'Copy Link', onClick: copyShareLink })

	return (
		<ToggleableAbsoluteWrapper
			contentClass={styles['asset-actions']}
			wrapperClass={styles['asset-actions-wrapper']}
			Wrapper={({ children }) => (
				<>
					<IconClickable src={Utilities.moreLight} />
					{children}
				</>
			)}
			Content={() => (
				<div className={styles.more} >
					<Dropdown
						options={options}
					/>
				</div>
			)}
		/>
	)
}

export default FolderOptions