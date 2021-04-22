import {useEffect, useState} from 'react'
import styles from './tag-management.module.css'


// Components
import CreatableSelect from '../inputs/creatable-select'
import Select from "../inputs/select"
import Search from "./search-input"
import Tag from "../misc/tag"

// APIs
import campaignApi from '../../../server-api/attribute'
import SpinnerOverlay from "../spinners/spinner-overlay";
import Input from "../inputs/input";
import Button from "../buttons/button";

const sorts = [
    {
        value: 'name,asc',
        label: 'Alphabetical (A-Z)'
    },
    {
        value: 'name,desc',
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

const CampaignManagement = () => {
    const [activeDropdown, setActiveDropdown] = useState('')
    const [campaignList, setCampaignList] = useState([])
    const [sort, setSort] = useState(sorts[0])
    const [searchType, setSearchType] = useState('')
    const [searchKey, setSearchKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false) // Double click on tag to edit
    const [currentEditIndex, setCurrentEditIndex] = useState<number>() // Current edit tag
    const [currentEditValue, setCurrentEditValue] = useState('') // Current edit value

    // Create the new tag
    const createTag = async (item) => {
        // Show loading
        setLoading(true)

        await campaignApi.createCampaigns({campaigns: [item]})

        // Reload the list
        getCampaignList();
    }

    // Get tag list
    const getCampaignList = async () => {
        // Show loading
        setLoading(true)

        let { data } = await campaignApi.getCampaigns({isAll: 1, sort: sort.value, searchType, searchKey})
        setCampaignList(data)

        // Hide loading
        setLoading(false)
    }

    const deleteCampaignList = async(id) => {
        // Show loading
        setLoading(true)

        // Call API to delete tag
        await campaignApi.deleteCampaigns({campaignIds: [id]})

        // Refresh the list
        getCampaignList();
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
        getCampaignList();
    }

    useEffect(()=>{
        getCampaignList();
    },[sort, searchKey])

    return (
        <div className={styles['main-wrapper']}>
            <div className={styles['operation-row']}>
                <CreatableSelect
                    title=''
                    addText='Add Campaign'
                    onAddClick={() => setActiveDropdown('campaigns')}
                    selectPlaceholder={'Enter a new campaign'}
                    avilableItems={[]}
                    setAvailableItems={()=>{}}
                    selectedItems={[]}
                    setSelectedItems={()=>{}}
                    onAddOperationFinished={()=>{}}
                    onRemoveOperationFinished={()=>{}}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    isShare={false}
                    asyncCreateFn={createTag}
                    dropdownIsActive={activeDropdown === 'campaigns'}
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
                        placeholder={'Start with'}
                        onSubmit={(key)=>{setSearchType('start');setSearchKey(key);}}
                    />
                </div>
                <div className={styles['search-column-2']}>
                    <Search
                        placeholder={'Exact Match'}
                        onSubmit={(key)=>{setSearchType('exact');setSearchKey(key);}}
                    />
                </div>
                <div className={styles['search-column-3']}>
                    <Search
                        placeholder={'Contains'}
                        onSubmit={(key)=>{setSearchType('contain');setSearchKey(key);}}
                    />
                </div>
            </div>

            <ul className={styles['tag-wrapper']}>
                {campaignList.map((campaign, index) => <li key={index} className={styles['tag-item']}>
                    {(editMode === false || (editMode === true && currentEditIndex !== index)) && <Tag
                        tag={<><span className={styles['tag-item-text']}>{campaign.numberOfFiles}</span> <span>{campaign.name}</span></>}
                        canRemove={true}
                        editFunction={()=>{
                            setCurrentEditIndex(index);
                            setCurrentEditValue(campaign.name);
                            setEditMode(true);

                        }}
                        removeFunction={() => {deleteCampaignList(campaign.id)}}
                    />}
                    {editMode === true && currentEditIndex === index && <div>
                        <Input
                            placeholder={'Edit name'}
                            onChange={(e)=>{setCurrentEditValue(e.target.value)}}
                            additionalClasses={styles['edit-input']}
                            value={currentEditValue}
                            styleType={'regular-short'} />
                        <Button
                            styleTypes={['exclude-min-height']}
                            type={'submit'}
                            className={styles['edit-submit-btn']}
                            text='Save changes'
                            styleType='primary'
                            onClick={()=>{saveChanges(campaign.id)}}
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

        </div>
    )
}

export default CampaignManagement
