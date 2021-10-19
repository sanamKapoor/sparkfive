import {useEffect, useState} from 'react'
import styles from './tag-management.module.css'


// Components
import CreatableSelect from '../inputs/creatable-select'
import Select from "../inputs/select"
import Search from "./search-input"
import Tag from "../misc/tag"

// APIs
import campaignApi from '../../../server-api/attribute'
import productApi from '../../../server-api/attribute'
import SpinnerOverlay from "../spinners/spinner-overlay";
import Input from "../inputs/input";
import Button from "../buttons/button";
import ConfirmModal from "../modals/confirm-modal";

// Utils
import toastUtils from '../../../utils/toast'

const sorts = [
    {
        value: 'sku,asc',
        label: 'Alphabetical (A-Z)'
    },
    {
        value: 'sku,desc',
        label: 'Alphabetical (Z-A)'
    },
    {
        value: 'numberOfFiles,asc',
        label: 'Popularity (Low to High)'
    },
    {
        value: 'numberOfFiles,desc',
        label: 'Popularity (High to Low)'
    }
]

const ProductManagement = () => {
    const [activeDropdown, setActiveDropdown] = useState('')
    const [productList, setProductList] = useState([])
    const [sort, setSort] = useState(sorts[0])
    const [searchType, setSearchType] = useState('')
    const [searchKey, setSearchKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [currentDeleteId, setCurrentDeleteId] = useState() // Id is pending to delete
    const [editMode, setEditMode] = useState(false) // Double click on tag to edit
    const [currentEditIndex, setCurrentEditIndex] = useState<number>() // Current edit tag
    const [currentEditValue, setCurrentEditValue] = useState('') // Current edit value

    // Create the new tag
    const createProduct = async (item) => {
        try{
            // Show loading
            item.sku = item.name
            delete item.name
            setLoading(true)
            await productApi.createProducts({products: [item]})

            // Reload the list
            getProductList();
        }catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create folder, please try again later.')

            // Show loading
            setLoading(false)
        }

    }

    // Get folder list
    const getProductList = async () => {
        // Show loading
        setLoading(true)

        let { data } = await productApi.getProducts({isAll: 1, sort: sort.value, searchType, searchKey})
        setProductList(data)

        // Hide loading
        setLoading(false)
    }

    const deleteProductList = async(id) => {
        // Hide confirm modal
        setConfirmDeleteModal(false)

        // Show loading
        setLoading(true)
        // Call API to delete folder
        await productApi.deletProducts({productIds: [id]})

        // Refresh the list
        getProductList();
    }

    // Reset edit state
    const resetEditState = () => {
        setEditMode(false);
        setCurrentEditIndex(0);
        setCurrentEditValue('')
    }

    // Save updated changes
    const saveChanges = async (id) => {
        // Show loading
        setLoading(true)

        // Call API to delete tag
        await campaignApi.updateCampaigns({
            campaigns: [
                {
                    id: id,
                    name: currentEditValue
                }
            ]
        })

        resetEditState();

        // Refresh the list
        getProductList();
    }

    useEffect(()=>{
        getProductList();
    },[sort, searchKey])

    return (
        <div className={styles['main-wrapper']}>
            <div className={styles['operation-row']}>
            <CreatableSelect
                    title=''
                    addText='Add Product'
                    onAddClick={() => setActiveDropdown('products')}
                    selectPlaceholder={'Enter a product sku'}
                    avilableItems={[]}
                    setAvailableItems={()=>{}}
                    selectedItems={[]}
                    setSelectedItems={()=>{}}
                    onAddOperationFinished={()=>{}}
                    onRemoveOperationFinished={()=>{}}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    isShare={false}
                    asyncCreateFn={createProduct}
                    dropdownIsActive={activeDropdown === 'products'}
                    selectClass={styles['campaign-select']}
                />

                <Select
                    options={sorts}
                    onChange={(value)=>{setSort(value)}}
                    placeholder={'Select to sort'}
                    styleType={`regular ${styles['sort-select']}`}
                    value={sort}
                />
            </div>

            <div className={styles['search-row']}>
                <div className={styles['search-column-1']}>
                    <Search
                        name={'start'}
                        searchType={searchType}
                        placeholder={'Starts with'}
                        onSubmit={(key)=>{setSearchType('start');setSearchKey(key);}}
                        onClear={()=>{setSearchKey('')}}
                    />
                </div>
                <div className={styles['search-column-2']}>
                    <Search
                        name={'exact'}
                        searchType={searchType}
                        placeholder={'Exact Match'}
                        onSubmit={(key)=>{setSearchType('exact');setSearchKey(key);}}
                        onClear={()=>{setSearchKey('')}}
                    />
                </div>
                <div className={styles['search-column-3']}>
                    <Search
                        name={'contain'}
                        searchType={searchType}
                        placeholder={'Contains'}
                        onSubmit={(key)=>{setSearchType('contain');setSearchKey(key);}}
                        onClear={()=>{setSearchKey('')}}
                    />
                </div>
            </div>

            <ul className={styles['tag-wrapper']}>
                {productList.map((folder, index) => <li key={index} className={styles['tag-item']}>
                    {(editMode === false || (editMode === true && currentEditIndex !== index)) && <Tag
                        tag={<><span className={styles['tag-item-text']}>{folder.numberOfFiles}</span> <span>{folder.sku}</span></>}
                        canRemove={true}
                        editFunction={()=>{
                            setCurrentEditIndex(index);
                            setCurrentEditValue(folder.name);
                            setEditMode(true);

                        }}
                        removeFunction={() => {
                            setCurrentDeleteId(folder.id)
                            setConfirmDeleteModal(true)
                        }}
                    />}
                    {editMode === true && currentEditIndex === index && <div>

                        <Button
                            styleTypes={['exclude-min-height']}
                            type={'submit'}
                            className={styles['edit-submit-btn']}
                            text='Save changes'
                            styleType='primary'
                            onClick={()=>{saveChanges(folder.id)}}
                        />
                        <Button
                            styleTypes={['secondary']}
                            type={'button'}
                            className={styles['edit-cancel-btn']}
                            text='Cancel'
                            styleType='primary'
                            onClick={resetEditState}
                        />
                    </div>}
                </li>)}
            </ul>

            {loading && <SpinnerOverlay />}

            <ConfirmModal
                modalIsOpen={confirmDeleteModal}
                closeModal={()=>{setConfirmDeleteModal(false)}}
                confirmAction={()=>{deleteProductList(currentDeleteId)}}
                confirmText={'Delete'}
                message={<span>This folder will be deleted and removed from any file that has it.&nbsp; Are you sure you want to delete these?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

        </div>
    )
}

export default ProductManagement
