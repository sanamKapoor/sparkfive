import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'
import { AssetContext } from '../../../context'
import update from 'immutability-helper'

// Components
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import SidePanelBulk from './side-panel-bulk'
import EditGrid from './edit-grid'

const BulkEditOverlay = ({ handleBackButton, selectedAssets }) => {

	const { assets, setAssets } = useContext(AssetContext)

	const [sideOpen, setSideOpen] = useState(true)

	useEffect(() => deselectAll(), [])

	const toggleSideMenu = (value = null) => {
		if (value === null)
			setSideOpen(!sideOpen)
		else
			setSideOpen(value)
	}

	const toggleSelectedEdit = (id) => {
		const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
		setAssets(update(assets, {
			[assetIndex]: {
				isEditSelected: { $set: !assets[assetIndex].isEditSelected }
			}
		}))
	}

	const selectAll = () => {
		setAssets(assets.map(assetItem => ({ ...assetItem, isEditSelected: true })))
	}

	const deselectAll = () => {
		setAssets(assets.map(asset => ({ ...asset, isEditSelected: false })))
	}

	const editSelectedAssets = selectedAssets.filter(({ isEditSelected }) => isEditSelected)

	return (
		<div className={`app-overlay ${styles.container}`}>
			<section className={styles.content}>
				<div className={styles['top-wrapper']}>
					<div className={styles.back} onClick={handleBackButton}>
						<IconClickable src={Utilities.back} />
						<span>Back</span>
					</div>
					<div className={styles.name}>
						<h3>Edit Assets</h3>
						<div className={styles['asset-actions']}>
							<Button text={'Select All'} type={'button'} styleType={'secondary'} onClick={selectAll} />
							<Button text={`Deselect All (${editSelectedAssets.length})`} type={'button'} styleType={'primary'} onClick={deselectAll} />
						</div>
					</div>
				</div>
				<EditGrid assets={selectedAssets} toggleSelectedEdit={toggleSelectedEdit} />
			</section>
			{sideOpen &&
				<section className={styles.side}>
					<SidePanelBulk elementsSelected={editSelectedAssets} onUpdate={handleBackButton}/>
				</section>
			}
			<section className={styles.menu}>
				<IconClickable src={Utilities.closePanelLight} onClick={() => toggleSideMenu()}
					additionalClass={`${styles['menu-icon']} ${!sideOpen && 'mirror'}`} />
			</section>
		</div >
	)
}

export default BulkEditOverlay