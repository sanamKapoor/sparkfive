import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'
import { AssetContext } from '../../../context'

// Components
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import SidePanelBulk from './side-panel-bulk'
import EditGrid from './edit-grid'

const BulkEditOverlay = ({ handleBackButton, selectedAssets }) => {

	const { assets } = useContext(AssetContext)

	const [sideOpen, setSideOpen] = useState(true)

	const toggleSideMenu = (value = null) => {
		if (value === null)
			setSideOpen(!sideOpen)
		else
			setSideOpen(value)
	}

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
							<Button text={'Select All'} type={'button'} styleType={'secondary'} />
							<Button text={`(${selectedAssets.length}) Selected`} type={'button'} styleType={'primary'} />
						</div>
					</div>
				</div>
				<EditGrid assets={selectedAssets} />
			</section>
			{sideOpen &&
				<section className={styles.side}>
					<SidePanelBulk elementsSelected={selectedAssets} />
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