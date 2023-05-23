import { useEffect, useState } from 'react'
import styles from './tag-management.module.css'


// Components
import CreatableSelect from '../inputs/creatable-select'
import Tag from "../misc/tag"
import SpinnerOverlay from "../spinners/spinner-overlay";

// APIs
import teamApi from '../../../server-api/team'
import folderApi from '../../../server-api/attribute'
import ConfirmModal from "../modals/confirm-modal";

// Utils
import toastUtils from '../../../utils/toast'

const CollectionManagement = () => {
    const [activeDropdown, setActiveDropdown] = useState('')
    const [collectionList, setCollectionList] = useState([])
    const [collectionTags, setCollectionTags] = useState([])
    const [loading, setLoading] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [currentDeleteId, setCurrentDeleteId] = useState() // Id is pending to delete

    // Create the new tag
    const addCollectionTag = async (item) => {
        try {
            // Show loading
            setLoading(true)

            await teamApi.addOcrCollection({ id: item.id })

            // Reload the list
            getCollectionTags();

        } catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not add collection, please try again later.')

            // Show loading
            setLoading(false)
        }
    }

    // Get tag list
    const getCollectionTags = async () => {
        // Show loading
        setLoading(true)

        let { data } = await teamApi.getOcrCollections();
        setCollectionTags(data)

        // Hide loading
        setLoading(false)
    }

    const deleteCollectionTag = async (id) => {
        // // Hide confirm modal
        setConfirmDeleteModal(false)
        //
        // // Show loading
        setLoading(true)
        //
        // // Call API to delete tag
        await teamApi.removeOcrCollection(id)
        //
        // // Refresh the list
        getCollectionTags();
    }

    const getTagList = async () => {
        try {
            let { data } = await folderApi.getFolders({ isAll: 1});

            setCollectionList(data)
        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    useEffect(()=>{
        getTagList()
        getCollectionTags();
    },[])

    return (
        <div className={styles['main-wrapper']}>
            <div className={styles['operation-row']}>
                <CreatableSelect
                    title=''
                    addText='Add Collections'
                    onAddClick={() => setActiveDropdown('tags')}
                    selectPlaceholder={'Select a collection'}
                    avilableItems={collectionList}
                    setAvailableItems={() => { }}
                    selectedItems={[]}
                    setSelectedItems={() => { }}
                    onAddOperationFinished={(stateUpdate) => {
                        console.log(stateUpdate)
                        // updateAssetState({
                        //     tags: { $set: stateUpdate.concat(aiTags) }
                        // })
                        // loadTags()
                    }}
                    onRemoveOperationFinished={() => { }}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    isShare={false}
                    asyncCreateFn={(newItem)=>{
                        addCollectionTag(newItem)
                    }}
                    dropdownIsActive={activeDropdown === 'tags'}
                    selectClass={styles['tag-select']}
                    creatable={false}
                />
            </div>


            <ul className={styles['tag-wrapper']}>
                {collectionTags.map((tag, index) => <li key={index} className={styles['tag-item']}>
                    <Tag
                        canEdit={false}
                        tag={<><span>{tag.name}</span></>}
                        data={tag}
                        type="tag"
                        canRemove={true}
                        editFunction={() => {}}
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
                confirmAction={() => { deleteCollectionTag(currentDeleteId) }}
                confirmText={'Delete'}
                message={<span>This collection will be removed from OCR Text Recognition List.&nbsp; Are you sure you want to delete it?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

        </div>
    )
}

export default CollectionManagement
