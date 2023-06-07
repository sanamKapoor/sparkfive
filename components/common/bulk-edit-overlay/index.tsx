import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'
import { AssetContext, LoadingContext } from '../../../context'
import assetApi from '../../../server-api/asset'
import customFieldsApi from '../../../server-api/attribute'
import update from 'immutability-helper'
import { isMobile } from "react-device-detect";

// Components
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import SidePanelBulk from './side-panel-bulk'
import EditGrid from './edit-grid'
import SpinnerOverlay from '../spinners/spinner-overlay'
import BaseModal from '../modals/base'

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
	let rs = []
	list.map((field) => {
		let value = valueList.filter(valueField => valueField.id === field.id)

		if (value.length > 0) {
			rs.push(value[0])
		} else {
			let customField = { ...field }
			customField.values = []
			rs.push(customField)
		}
	})

	return rs
}

const BulkEditOverlay = ({ handleBackButton, selectedAssets }) => {

	const { loadingAssets } = useContext(AssetContext)

	const [loading, setLoading] = useState(true)

	const [sideOpen, setSideOpen] = useState(true)

	const [initialSelect, setInitialSelect] = useState(false)

	const [assetProjects, setAssetProjects] = useState([])
	const [assetTags, setTags] = useState([])
	const [assetCampaigns, setCampaigns] = useState([])
	const [assetFolders, setFolders] = useState([])

	const initialEditAssets = selectedAssets.map(assetItem => ({ ...assetItem, isEditSelected: true }));

	const [editAssets, setEditAssets] = useState(initialEditAssets);

	const [addMode, setAddMode] = useState(true)

	const [originalInputs, setOriginalInputs] = useState({
		campaigns: [],
		projects: [],
		tags: [],
		customs: [],
		folders: []
	})

	// Custom fields
	const [inputCustomFields, setInputCustomFields] = useState([])
	const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, originalInputs.customs))

	const getCustomFieldsInputData = async () => {
		try {
			const { data } = await customFieldsApi.getCustomFields({ isAll: 1, sort: 'createdAt,asc' })

			setInputCustomFields(data)

			return data

		} catch (err) {
			// TODO: Maybe show error?
		}
	}

	// Reset all selected field values
	const resetSelectedFieldValue = () => {
		setAssetProjects([])
		setTags([])
		setCampaigns([])
		setFolders([])


		// Default custom field values
		const updatedMappingCustomFieldData = mappingCustomFieldData(inputCustomFields, [])

		setAssetCustomFields(update(assetCustomFields, {
			$set: updatedMappingCustomFieldData
		}))
	}

	const initialize = () => {
		if (addMode) {
			resetSelectedFieldValue()
		} else if (!addMode) {
			setCampaigns(originalInputs.campaigns)
			setAssetProjects(originalInputs.projects)
			setTags(originalInputs.tags)
			setAssetCustomFields(originalInputs.customs)
			setFolders(originalInputs.folders)

			// Custom fields
			if (inputCustomFields.length > 0) {
				const updatedMappingCustomFieldData = mappingCustomFieldData(inputCustomFields, originalInputs.customs)

				setAssetCustomFields(update(assetCustomFields, {
					$set: updatedMappingCustomFieldData
				}))

			} else {
				setAssetCustomFields(originalInputs.customs)
			}
		}
	}

	useEffect(() => {
		if (!loadingAssets && !initialSelect && selectedAssets.length > 0) {
			setInitialSelect(true)
			setEditAssets(initialEditAssets)
			getInitialAttributes()
		}
		if (loadingAssets) {
			setEditAssets([])
			setInitialSelect(false)
		}
	}, [selectedAssets, loadingAssets])

	useEffect(() => {
		initialize()
	}, [addMode, originalInputs])

	useEffect(() => {
		getInitialAttributes();
	}, [editAssets]);

	const getInitialAttributes = async () => {
		try {
			// Get custom fields list
			await getCustomFieldsInputData();

			const assetIds = editAssets.filter(({ isEditSelected }) => isEditSelected).map(({ asset: { id } }) => id) ;
			
			const { data: { tags, projects, campaigns, customs, folders } } = await assetApi.getBulkProperties({ assetIds})
			setOriginalInputs({
				campaigns,
				projects,
				tags,
				customs,
				folders,
			})
		} catch (err) {
			// TODO: Maybe show error?
		} finally {
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

		initialize()
	}

	const deselectAll = () => {
		setEditAssets(editAssets.map(asset => ({ ...asset, isEditSelected: false })))

		resetSelectedFieldValue()
	}

	const editSelectedAssets = editAssets.filter(({ isEditSelected }) => isEditSelected)

	// On change custom fields (add/remove)
	const onChangeCustomField = (index, data) => {
		// Show loading
		// setIsLoading(true)

		// Hide select list
		// setActiveCustomField(undefined)


		// Update asset custom field (local)
		setAssetCustomFields(update(assetCustomFields, {
			[index]: {
				values: { $set: data }
			}
		}))

		// Show loading
		// setIsLoading(false)
	}

	return (
		isMobile ? (
			<div className={`app-overlay ${styles.container}`}>
				{loading && <SpinnerOverlay />}
				<section className={styles.content}>
					<div className={styles.back} onClick={handleBackButton}>
						<IconClickable src={Utilities.back} />
						<span>Back</span>
					</div>
					<div className={styles['top-wrapper']}>
						<div className={styles.name}>
							<h3>Edit Assets</h3>
							<div className={styles['asset-actions']}>
								<Button text={'Select All'} type={'button'} styleType={'secondary'} onClick={selectAll} />
								<Button text={`Deselect All (${editSelectedAssets.length})`} type={'button'} styleType={'primary'} onClick={deselectAll} />
							</div>
						</div>
						<div className={styles.mode}>
							<p>Mode: </p>
							<div className={styles.option} onClick={() => setAddMode(true)}>
								<IconClickable src={addMode ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
								/>
								Add
							</div>
							<div className={styles.option} onClick={() => setAddMode(false)}>
								<IconClickable src={!addMode ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']} />
								Remove
							</div>
						</div>
					</div>
					<EditGrid assets={editAssets} toggleSelectedEdit={toggleSelectedEdit} />
				</section>
				{sideOpen &&
					<section className={styles.side}>
						<SidePanelBulk
							elementsSelected={editSelectedAssets}
							onUpdate={getInitialAttributes}
							assetCampaigns={assetCampaigns}
							assetProjects={assetProjects}
							assetTags={assetTags}
							assetCustomFields={assetCustomFields}
							assetFolders={assetFolders}
							originalInputs={originalInputs}
							setAssetProjects={setAssetProjects}
							setCampaigns={setCampaigns}
							setTags={setTags}
							setCustomFields={onChangeCustomField}
							setFolders={setFolders}
							setLoading={setLoading}
							loading={loading}
							addMode={addMode}
						/>
					</section>
				}
				<section className={styles.menu}>
					<IconClickable src={Utilities.closePanelLight} onClick={() => toggleSideMenu()}
						additionalClass={`${styles['menu-icon']} ${!sideOpen && 'mirror'}`} />
				</section>
			</div>
		) : (
			<BaseModal
				closeModal={handleBackButton}
				additionalClasses={['visible-block']}
				modalIsOpen={true}
				overlayAdditionalClass={styles['edit-modal-outer']}
				headText={
					<div className={styles['top-wrapper']}>
						<div className={styles.name}>
							<h3>Edit Assets</h3>
						</div>
						<div className={styles['asset-actions']}>
							<Button text={'Select All'} type={'button'} styleType={'secondary'} onClick={selectAll} />
							<Button text={`Deselect All (${editSelectedAssets.length})`} type={'button'} styleType={'primary'} onClick={deselectAll} />
						</div>
						<div className={styles.mode}>
							<p>Mode: </p>
							<div className={styles.option} onClick={() => setAddMode(true)}>
								<IconClickable src={addMode ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
								/>
								Add
							</div>
							<div className={styles.option} onClick={() => setAddMode(false)}>
								<IconClickable src={!addMode ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']} />
								Remove
							</div>
						</div>
					</div>
				}
				children={
					<div className={styles.wrapper}>
						{loading && <SpinnerOverlay />}
						<section className={styles.content}>
							<EditGrid assets={editAssets} toggleSelectedEdit={toggleSelectedEdit} />
						</section>
						{sideOpen &&
							<section className={styles.side}>
								<SidePanelBulk
									elementsSelected={editSelectedAssets}
									onUpdate={getInitialAttributes}
									assetCampaigns={assetCampaigns}
									assetProjects={assetProjects}
									assetTags={assetTags}
									assetCustomFields={assetCustomFields}
									assetFolders={assetFolders}
									originalInputs={originalInputs}
									setAssetProjects={setAssetProjects}
									setCampaigns={setCampaigns}
									setTags={setTags}
									setCustomFields={onChangeCustomField}
									setFolders={setFolders}
									setLoading={setLoading}
									loading={loading}
									addMode={addMode}
								/>
							</section>
						}
						<section className={styles.menu}>
							<IconClickable src={Utilities.closePanelLight} onClick={() => toggleSideMenu()}
								additionalClass={`${styles['menu-icon']} ${!sideOpen && 'mirror'}`} />
						</section>
					</div >
				}
			/>
		)

	)
}

export default BulkEditOverlay
