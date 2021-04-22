import {useEffect, useState} from 'react'
import styles from './tag-management.module.css'


// Components
import CreatableSelect from '../inputs/creatable-select'
import Select from "../inputs/select"
import Search from "./search-input"
import Tag from "../misc/tag"
import Input from '../../common/inputs/input'
import SpinnerOverlay from "../spinners/spinner-overlay";
import Button from "../buttons/button";

// APIs
import tagApi from '../../../server-api/attribute'

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

const TagManagement = () => {
    const [activeDropdown, setActiveDropdown] = useState('')
    const [tagList, setTagList] = useState([])
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

        await tagApi.createTags({tags: [item]})

        // Reload the list
        getTagList();
    }

    // Get tag list
    const getTagList = async () => {
        // Show loading
        setLoading(true)

        let { data } = await tagApi.getTags({isAll: 1, sort: sort.value, searchType, searchKey})
        setTagList(data)

        // Hide loading
        setLoading(false)
    }

    const deleteTagList = async(id) => {
        // Show loading
        setLoading(true)

        // Call API to delete tag
        await tagApi.deleteTags({tagIds: [id]})

        // Refresh the list
        getTagList();
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
        await tagApi.updateTags({
            tags: [
                {
                    id: id,
                    name: currentEditValue
                }
            ]
        })

        resetEditState();

        // Refresh the list
        getTagList();
    }

    useEffect(()=>{
        getTagList();
    },[sort, searchKey])

    return (
        <div className={styles['main-wrapper']}>
            <div className={styles['operation-row']}>
                <CreatableSelect
                    title=''
                    addText='Add Tags'
                    onAddClick={() => setActiveDropdown('tags')}
                    selectPlaceholder={'Enter a new tag'}
                    avilableItems={[]}
                    setAvailableItems={()=>{}}
                    selectedItems={[]}
                    setSelectedItems={()=>{}}
                    onAddOperationFinished={()=>{}}
                    onRemoveOperationFinished={()=>{}}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    isShare={false}
                    asyncCreateFn={createTag}
                    dropdownIsActive={activeDropdown === 'tags'}
                    selectClass={styles['tag-select']}
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
                {tagList.map((tag, index) => <li key={index} className={styles['tag-item']}>
                    {(editMode === false || (editMode === true && currentEditIndex !== index)) && <Tag
                        tag={<><span className={styles['tag-item-text']}>{tag.numberOfFiles}</span> <span>{tag.name}</span></>}
                        canRemove={true}
                        editFunction={()=>{
                            setCurrentEditIndex(index);
                            setCurrentEditValue(tag.name);
                            setEditMode(true);

                        }}
                        removeFunction={() => {deleteTagList(tag.id)}}
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
                            onClick={()=>{saveChanges(tag.id)}}
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

export default TagManagement
