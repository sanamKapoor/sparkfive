import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'
import { AssetContext, LoadingContext } from '../../../context'
import assetApi from '../../../server-api/asset'
import update from 'immutability-helper'

// Components
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import SidePanelBulk from './side-panel-bulk'
import EditGrid from './edit-grid'
import SpinnerOverlay from '../spinners/spinner-overlay'

const BulkEditOverlay = ({ handleBackButton, selectedAssets }) => {

	const { loadingAssets } = useContext(AssetContext)

	const [loading, setLoading] = useState(true)

	const [sideOpen, setSideOpen] = useState(true)

	const [initialSelect, setInitialSelect] = useState(false)

	const [assetProjects, setAssetProjects] = useState([])
	const [assetTags, setTags] = useState([])
	const [assetCampaigns, setCampaigns] = useState([])

	const [editAssets, setEditAssets] = useState([])

	const [originalInputs, setOriginalInputs] = useState({
		campaigns: [],
		projects: [],
		tags: []
	})

	useEffect(() => {
		if (!loadingAssets && !initialSelect && selectedAssets.length > 0) {
			setInitialSelect(true)
			setEditAssets(selectedAssets.map(assetItem => ({ ...assetItem, isEditSelected: true })))
			getInitialAttributes()
		}
		if (loadingAssets) {
			setEditAssets([])
			setInitialSelect(false)
		}
	}, [selectedAssets, loadingAssets])

	const getInitialAttributes = async () => {
		try {
			const { data: { tags, projects, campaigns } } = await assetApi.getBulkProperties({ assetIds: selectedAssets.map(({ asset: { id } }) => id) })
			setCampaigns(campaigns)
			setAssetProjects(projects)
			setTags(tags)

			setOriginalInputs({
				campaigns,
				projects,
				tags
			})
		} catch (err) {
			// TODO: Maybe show error?
		} finally{
			setLoading(false)
		}
	}

	const toggleSideMenu = (value = null) => {
		if (value === null)
			setSideOpen(!sideOpen)
		else
			setSideOpen(value)
	}

	const toggleSelectedEdit = (id) => {
		const assetIndex = editAssets.findIndex(assetItem => assetItem.asset.id === id)
		setEditAssets(update(editAssets, {
			[assetIndex]: {
				isEditSelected: { $set: !editAssets[assetIndex].isEditSelected }
			}
		}))
	}

	const selectAll = () => {
		setEditAssets(editAssets.map(assetItem => ({ ...assetItem, isEditSelected: true })))
	}

	const deselectAll = () => {
		setEditAssets(editAssets.map(asset => ({ ...asset, isEditSelected: false })))
	}

	const editSelectedAssets = editAssets.filter(({ isEditSelected }) => isEditSelected)

	return (
		<div className={`app-overlay ${styles.container}`}>
			{loading && <SpinnerOverlay />}
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
				<EditGrid assets={editAssets} toggleSelectedEdit={toggleSelectedEdit} />
			</section>
			{sideOpen &&
				<section className={styles.side}>
					<SidePanelBulk
						elementsSelected={editSelectedAssets}
						onUpdate={handleBackButton}
						assetCampaigns={assetCampaigns}
						assetProjects={assetProjects}
						assetTags={assetTags}
						originalInputs={originalInputs}
						setAssetProjects={setAssetProjects}
						setCampaigns={setCampaigns}
						setTags={setTags}
						setLoading={setLoading}
						loading={loading}
					/>
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