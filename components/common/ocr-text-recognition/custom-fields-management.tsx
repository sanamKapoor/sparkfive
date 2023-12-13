import { useEffect, useState } from 'react'
import _ from "lodash"
import styles from './custom-fields-management.module.css'


// Components
import CreatableSelect from '../inputs/creatable-select'
import Tag from "../misc/tag"

// APIs
import customFieldsApi from '../../../server-api/attribute'
import teamApi from '../../../server-api/team'
import SpinnerOverlay from "../spinners/spinner-overlay";
import ConfirmModal from "../modals/confirm-modal";

// Utils
import toastUtils from '../../../utils/toast'

// Maximum custom fields
const maximumCustomFields = 6;

const defaultCustomFields = [
]

const sort = (data) => {
    return _.orderBy(data, [item => (item.name || "")?.toLowerCase()],['asc']);
}

const mappingCustomFieldData = (list, valueList) => {
    let rs = []
    list.map((field)=>{
        let value = valueList.filter(valueField => valueField.id === field.id)

        if(value.length > 0){
            value[0].values = sort(value[0].values);
            rs.push(value[0])
        }else{
            let customField = { ...field }
            customField.values = []
            rs.push(customField)
        }
    })

    return rs
}

const CustomFieldsManagement = () => {
    const [activeDropdown, setActiveDropdown] = useState<number>(undefined)
    const [customFieldList, setCustomFieldList] = useState(defaultCustomFields)
    const [ocrCustomFields, setOcrCustomFields] = useState(mappingCustomFieldData(customFieldList, []))
    const [loading, setLoading] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [currentDeleteId, setCurrentDeleteId] = useState() // Id is pending to delete

    // Create the new tag
    const addOcrCustomField = async (item) => {
        try {
            // Show loading
            setLoading(true)

            await teamApi.addOcrCustomFields({ id: item.id })

            // Reload the list
            getOcrCustomFields();

        } catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create tag, please try again later.')

            // Show loading
            setLoading(false)
        }
    }

    // Get tag list
    const getCustomFields = async () => {
        // Show loading
        setLoading(true)

        let { data } = await customFieldsApi.getCustomFields({ isAll: 1, sort: 'createdAt,asc' })

        if (data.length > 0) {

            setCustomFieldList(data)
        } else {
            setCustomFieldList([
                {
                    id: null,
                    name: '',
                    type: 'selectOne',
                    values: []
                },
                {
                    id: null,
                    name: '',
                    type: 'selectOne',
                    values: []
                },
                {
                    id: null,
                    name: '',
                    type: 'selectOne',
                    values: []
                },
                {
                    id: null,
                    name: '',
                    type: 'selectOne',
                    values: []
                },
                {
                    id: null,
                    name: '',
                    type: 'selectOne',
                    values: []
                },
                {
                    id: null,
                    name: '',
                    type: 'selectOne',
                    values: []
                }
            ])
        }

        // Hide loading
        // setLoading(false)
    }

    const getOcrCustomFields = async () => {
        let { data } = await teamApi.getOcrCustomFields()

        const mapping = mappingCustomFieldData(customFieldList, data)

        setOcrCustomFields(mapping)

        // Show loading
        setLoading(false)
    }

    useEffect(()=>{
        if(customFieldList.length > 0){
            getOcrCustomFields();
        }

    },[customFieldList])

    // Save updated changes
    const saveChanges = async (index) => {
        try {
            // Show loading
            setLoading(true)

            // Call API to delete tag
            await customFieldsApi.createCustomField({
                attributes: [
                    customFieldList[index]
                ]
            })

            toastUtils.success('Custom field changes saved')

            // Refresh the list
            getCustomFields();
        } catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create tag, please try again later.')

            // Show loading
            setLoading(false)
        }
    }

    const deleteCustomAttribute = async (id) => {
        // Hide confirm modal
        setConfirmDeleteModal(false)

        // Show loading
        setLoading(true)

        // Call API to delete tag
        await teamApi.removeOcrCustomFields(id)

        // Refresh the list
        getCustomFields();
    }

    useEffect(() => {
        getCustomFields();
    }, [])

    return (
        <div className={styles['main-wrapper']}>
            {ocrCustomFields.map((field, index) => {
                return <div className={`${styles['row']} ${styles['field-block']}`} key={index}>
                    <div className={`${styles['col-50']} ${styles['col-md-100']}`}>
                        <div className={styles['row']}>
                            <div className={`${styles['col-100']} ${styles['flex-display']}`}>
                                <span className={styles['font-weight-600']}>{index + 1}.</span>
                                <span className={`${styles['row-header']} ${styles['font-weight-600']}`}>Custom Field Name</span>
                            </div>
                            <div className={`${styles['col-100']} ${styles['p-l-30']}`}>
                                <span>{field.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles['col-50']} ${styles['col-md-100']}`}>
                        <div className={styles['row']}>
                            <div className={`${styles['col-100']} ${styles['flex-display']}`}>
                                <span className={`${styles['row-header']} ${styles['font-weight-600']}`}>Values</span>
                            </div>
                            <div className={`${styles['col-100']} ${styles['p-l-30']}`}>
                                <ul className={styles['tag-wrapper']}>
                                    {field.values.map((tag, valueIndex) => <li key={valueIndex} className={styles['tag-item']}>
                                        <Tag
                                            altColor={(index % 2 !== 0) ? 'yellow' : ''}
                                            tag={<span>{tag.name}</span>}
                                            data={tag}
                                            type="custom-fields"
                                            canRemove={true}
                                            editFunction={() => {
                                            }}
                                            removeFunction={() => {
                                                setCurrentDeleteId(tag.id)
                                                setConfirmDeleteModal(true)
                                            }}
                                        />
                                    </li>)}
                                </ul>

                                <CreatableSelect
                                    title=''
                                    addText='Add New Values'
                                    onAddClick={() => setActiveDropdown(index)}
                                    selectPlaceholder={'Enter a new value'}
                                    avilableItems={customFieldList[index]?.values || []}
                                    setAvailableItems={() => { }}
                                    selectedItems={[]}
                                    setSelectedItems={() => { }}
                                    onAddOperationFinished={() => { }}
                                    onRemoveOperationFinished={() => { }}
                                    onOperationFailedSkipped={() => setActiveDropdown(undefined)}
                                    isShare={false}
                                    asyncCreateFn={(item) => {
                                        addOcrCustomField(item)
                                    }}
                                    dropdownIsActive={activeDropdown === index}
                                    selectClass={styles['tag-select']}
                                    creatable={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            })}

            <ConfirmModal
                modalIsOpen={confirmDeleteModal}
                closeModal={() => { setConfirmDeleteModal(false) }}
                confirmAction={() => { deleteCustomAttribute(currentDeleteId) }}
                confirmText={'Delete'}
                message={<span>This custom field will be deleted from Text Recognition.&nbsp; Are you sure you want to delete it?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

            {loading && <SpinnerOverlay />}
        </div>
    )
}

export default CustomFieldsManagement
