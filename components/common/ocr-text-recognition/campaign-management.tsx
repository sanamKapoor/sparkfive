import { useEffect, useState } from 'react'
import styles from './tag-management.module.css'


// Components
import CreatableSelect from '../inputs/creatable-select'
import Tag from "../misc/tag"
import SpinnerOverlay from "../spinners/spinner-overlay";

// APIs
import teamApi from '../../../server-api/team'
import campaignApi from '../../../server-api/campaign'
import ConfirmModal from "../modals/confirm-modal";

// Utils
import toastUtils from '../../../utils/toast'

const CampaignManagement = () => {
    const [activeDropdown, setActiveDropdown] = useState('')
    const [tagList, setTagList] = useState([])
    const [ocrCampaigns, setOcrCampaigns] = useState([])
    const [loading, setLoading] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [currentDeleteId, setCurrentDeleteId] = useState() // Id is pending to delete

    // Create the new tag
    const addOcrCampaign = async (item) => {
        try {
            // Show loading
            setLoading(true)

            await teamApi.addOcrCampaign({ id: item.id })

            // Reload the list
            getOcrCampaigns();

        } catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create tag, please try again later.')

            // Show loading
            setLoading(false)
        }
    }

    // Get tag list
    const getOcrCampaigns = async () => {
        // Show loading
        setLoading(true)

        let { data } = await teamApi.getOcrCampaigns();
        setOcrCampaigns(data)

        // Hide loading
        setLoading(false)
    }

    const deleteOcrTag = async (id) => {
        // // Hide confirm modal
        setConfirmDeleteModal(false)
        //
        // // Show loading
        setLoading(true)
        //
        // // Call API to delete tag
        await teamApi.removeOcrCampaign(id)
        //
        // // Refresh the list
        getOcrCampaigns();
    }

    const getTagList = async () => {
        try {
            const { data } = await campaignApi.getCampaigns({ includeAi: false })

            setTagList(data)
        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    useEffect(() => {
        getTagList()
        getOcrCampaigns();
    }, [])

    return (
        <div className={styles['main-wrapper']}>
            <div className={styles['operation-row']}>
                <CreatableSelect
                    title=''
                    addText='Add Campaigns'
                    onAddClick={() => setActiveDropdown('tags')}
                    selectPlaceholder={'Select a campaign'}
                    avilableItems={tagList}
                    setAvailableItems={() => { }}
                    selectedItems={[]}
                    setSelectedItems={() => { }}
                    onAddOperationFinished={(stateUpdate) => {
                        // updateAssetState({
                        //     tags: { $set: stateUpdate.concat(aiTags) }
                        // })
                        // loadTags()
                    }}
                    onRemoveOperationFinished={() => { }}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    isShare={false}
                    asyncCreateFn={(newItem) => {
                        addOcrCampaign(newItem)
                    }}
                    dropdownIsActive={activeDropdown === 'tags'}
                    selectClass={styles['tag-select']}
                    creatable={false}
                />
            </div>


            <ul className={styles['tag-wrapper']}>
                {ocrCampaigns.map((tag, index) => <li key={index} className={styles['tag-item']}>
                    <Tag
                        canEdit={false}
                        tag={<><span>{tag.name}</span></>}
                        data={tag}
                        type="tag"
                        canRemove={true}
                        editFunction={() => { }}
                        removeFunction={() => {
                            setCurrentDeleteId(tag.id)
                            setConfirmDeleteModal(true)
                        }
                        }
                    />
                </li>)}
            </ul>

            {loading && <SpinnerOverlay />}

            <ConfirmModal
                modalIsOpen={confirmDeleteModal}
                closeModal={() => { setConfirmDeleteModal(false) }}
                confirmAction={() => { deleteOcrTag(currentDeleteId) }}
                confirmText={'Delete'}
                message={<span>This campaign will be removed from Text Recognition List.&nbsp; Are you sure you want to delete it?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

        </div>
    )
}

export default CampaignManagement
