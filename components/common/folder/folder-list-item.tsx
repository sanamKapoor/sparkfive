import styles from "./folder-list-item.module.css"
import { Utilities, Assets } from '../../../assets'
import { useState } from 'react'
import { format } from 'date-fns'
import zipDownloadUtils from '../../../utils/download'

// Components
import FolderOptions from './folder-options'
import ConfirmModal from '../modals/confirm-modal'
import IconClickable from '../buttons/icon-clickable'

const FolderListItem = ({
	index,
	id,
	name,
	size,
	length,
	createdAt,
	assets,
	viewFolder,
	isLoading = false,
	deleteFolder = () => { },
	shareAssets = (folder) => { },
	copyShareLink = (folder) => { },
	setCurrentSortAttribute = (attribute) => { },
	copyEnabled,
	toggleSelected,
	isSelected,
	sortAttribute
}) => {

	const dateFormat = 'MMM do, yyyy h:mm a'

	const [deleteOpen, setDeleteOpen] = useState(false)

	const downloadFoldercontents = () => {
		zipDownloadUtils.zipAndDownload(assets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.name })), name)
	}


	const getSortAttributeClassName = attribute => sortAttribute.replace('-', '') === attribute && styles['active']
	const setSortAttribute = attribute => {
		if (attribute === sortAttribute) {
			setCurrentSortAttribute('-' + attribute)
		} else {
			setCurrentSortAttribute(sortAttribute.startsWith('-') ? '' : attribute)
		}
	}
	const arrowIcon = sortAttribute.startsWith('-') ? Utilities.arrowUpGrey : Utilities.arrowGrey

	return (
		<>
			<div className={styles.list}>
				{index === 0 &&
					<div className={styles.header}>
						<h4 onClick={() => setSortAttribute('folder.name')} >
							Name
							<IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('folder.name')}`} />
						</h4>
						<h4 onClick={() => setSortAttribute('folder.length')} >
							Assets
							<IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('folder.length')}`} />
						</h4>
						<h4 onClick={() => setSortAttribute('folder.created-at')} >
							Created At
							<IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('folder.created-at')}`} />
						</h4>
						<h4></h4>
					</div>
				}
				<div className={styles.item}>
					<div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
						{!isLoading &&
							<IconClickable src={isSelected ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={toggleSelected} />
						}
					</div>
					<div className={`${styles.name} ${isLoading && 'loadable'}`} onClick={viewFolder}>
						{name}
					</div>
					<div className={styles.field_name}>
						{!isLoading && `${length} Assets`}
					</div>
					<div className={`${styles.field_name} ${isLoading && 'loadable'}`}>
						{format(new Date(createdAt), dateFormat)}
					</div>
					{!isLoading &&
						<div>
							<FolderOptions
								downloadFoldercontents={downloadFoldercontents}
								shareAssets={shareAssets}
								setDeleteOpen={setDeleteOpen}
								copyShareLink={copyShareLink}
								copyEnabled={copyEnabled}
							/>
						</div>
					}
				</div>
			</div>
			<ConfirmModal
				closeModal={() => setDeleteOpen(false)}
				confirmAction={() => {
					deleteFolder()
					setDeleteOpen(false)
				}}
				confirmText={'Delete'}
				message={'Are you sure you want to delete this folder?'}
				modalIsOpen={deleteOpen}
			/>
		</>
	)
}

export default FolderListItem