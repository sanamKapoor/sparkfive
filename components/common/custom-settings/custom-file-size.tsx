import {useEffect, useState} from 'react'
import styles from './custom-file-size.module.css'

import { Utilities } from '../../../assets'

// APIs
import customFieldsApi from '../../../server-api/attribute'

// Components
import toastUtils from '../../../utils/toast'
import { AssetOps } from '../../../assets'
import IconClickable from "../buttons/icon-clickable";
import SpinnerOverlay from "../spinners/spinner-overlay";
import Input from "../inputs/input";
import Button from "../buttons/button";
import ConfirmModal from "../modals/confirm-modal";

import { customSettings } from '../../../constants/custom-settings'

// Maximum custom fields
const maximumCustomFields = 3;

const CustomFileSizes = () => {
    const [fileSizeList, setFileSizeList] = useState([])
    const [loading, setLoading] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [currentDeleteId, setCurrentDeleteId] = useState() // Id is pending to delete

    // Create the new tag
    const createValue = async (index, item) => {
        let currentFieldList = [...fileSizeList];
        currentFieldList[index].values.push({
            name: item.name
        });
        setFileSizeList(currentFieldList)
    }

    // Get tag list
    const getCustomFields = async () => {
        // Show loading
        setLoading(true)

        let { data } = await customFieldsApi.getCustomFields({isAll: 1, sort: 'createdAt,asc'})

        if(data.length > 0){
            // There still be available fields to create
            if(data.length < maximumCustomFields){
                const dataLength = data.length
                // Add it
                for(let i=0;i<(maximumCustomFields-dataLength);i++){
                    data.push({
                        id: null,
                        name: '',
                        type: 'selectOne',
                        values: []
                    })
                }
            }

            setFileSizeList(data)
        }else{
            setFileSizeList([
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
        setLoading(false)
    }

    const deleteValue = async(customFieldIndex, valueIndex) => {
        let currentFieldList = [...fileSizeList];
        currentFieldList[customFieldIndex].values.splice(valueIndex, 1)
        setFileSizeList(currentFieldList)
    }

    // Save updated changes
    const saveChanges = async (index) => {
        try{
            // Show loading
            setLoading(true)

            // Call API to delete tag
            await customFieldsApi.createCustomField({
                attributes: [
                    fileSizeList[index]
                ]
            })

            toastUtils.success('Custom field changes saved')

            // Refresh the list
            getCustomFields();
        }catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create tag, please try again later.')

            // Show loading
            setLoading(false)
        }
    }

    const deleteCustomAttribute = async(id) => {
        // Hide confirm modal
        setConfirmDeleteModal(false)

        // Show loading
        setLoading(true)

        // Call API to delete tag
        await customFieldsApi.deleteCustomField({attributeIds: [id]})

        // Refresh the list
        getCustomFields();
    }

    // On input change
    const onInputChange = (e, name, index) => {
        let currentFieldList = [...fileSizeList];
        currentFieldList[index][name] = e.target.value;
        setFileSizeList(currentFieldList)
    }

    // On select option change
    const onSelectChange = (value, index) => {
        let currentFieldList = [...fileSizeList];
        currentFieldList[index].type = value;
        setFileSizeList(currentFieldList)
    }

    const addNew = () => {
        setFileSizeList(fileSizeList.concat([{
            id: null,
            name: ''
        }]))
    }

    useEffect(()=>{
        // getCustomFields();

    },[])

    return (
        <div className={styles['main-wrapper']}>
            {fileSizeList.map((field, index)=>{
               return <div className={`${styles['row']} ${styles['field-block']}`} key={index}>
                   <div className={`${styles['col-40']} ${styles['col-md-100']}`}>
                       <div className={styles['row']}>
                           <div className={`${styles['col-100']} ${styles['flex-display']}`}>
                               <span className={styles['font-weight-600']}>{index+1}.</span>
                               <span className={`${styles['row-header']} ${styles['font-weight-600']}`}>Custom File Size name</span>
                           </div>
                           <div className={`${styles['col-100']} ${styles['p-l-30']}`}>
                               <label className={`${styles['input-label']} visibility-hidden`}>
                                   Width (px)
                               </label>
                               <Input
                                   onChange={(e)=>{onInputChange(e, 'name', index)}}
                                   value={field.name}
                                   placeholder={'Field name'}
                                   styleType={'regular-short'} />
                           </div>
                       </div>
                   </div>
                   <div className={`${styles['col-35']} ${styles['col-md-100']}`}>
                       <div className={styles['row']}>
                           <div className={`${styles['col-100']} ${styles['flex-display']} justify-center`}>
                               <span className={`${styles['row-header']} ${styles['font-weight-600']}`}>Dimensions</span>
                           </div>
                           <div className={`${styles['col-100']}`}>
                               <div className={'row'}>
                                   <div className={'col-50'}>
                                       <label className={styles['input-label']}>
                                           Width (px)
                                       </label>
                                       <Input
                                           onChange={(e)=>{onInputChange(e, 'width', index)}}
                                           value={field.width}
                                           placeholder={'Width'}
                                           additionalClasses={'center-input'}
                                           type={'number'}
                                           styleType={'regular-short'} />
                                   </div>
                                   <div className={'col-50'}>
                                       <label className={styles['input-label']}>
                                           Height (px)
                                       </label>
                                       <Input
                                           onChange={(e)=>{onInputChange(e, 'height', index)}}
                                           value={field.height}
                                           placeholder={'Height'}
                                           type={'number'}
                                           additionalClasses={'center-input'}
                                           styleType={'regular-short'} />
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
                   <div className={`${styles['col-20']} ${styles['col-md-100']} ${styles['button-row']}`}>
                       <div className={'row'}>
                           <div className={`${styles['col-100']} ${styles['flex-display']}`}>
                               <span className={`${styles['row-header']} ${styles['font-weight-600']} visibility-hidden`}>Header</span>
                           </div>
                           <div className={`${styles['col-100']} p-r-0 p-l-0 d-flex p-t-15`}>
                               <Button
                                   styleTypes={['exclude-min-height']}
                                   type={'button'}
                                   text='Save'
                                   styleType='primary'
                                   onClick={()=>{saveChanges(index)}}
                                   disabled={!field.name}
                               />
                               {<IconClickable additionalClass={styles['action-button']}  src={AssetOps[`delete`]}  tooltipText={'Delete'} tooltipId={'Delete'}
                                                           onClick={()=>{
                                                               if(field.id){
                                                                   setCurrentDeleteId(field.id)
                                                                   setConfirmDeleteModal(true)
                                                               }else{
                                                                   setFileSizeList(fileSizeList.filter((item, indexItem)=> index !== indexItem))
                                                               }
                                                           }}
                               />}
                           </div>
                       </div>
                   </div>
               </div>
            })}

            {fileSizeList.length < customSettings.CUSTOM_FILE_SIZES.MAX_CONFIGURATIONS && <div className={`${styles['row']} ${styles['field-block']}`}>
                <div className={`${styles['col-100']}`}>
                    <div className={`${styles['row']} p-l-r-10`}>
                        <div className={`add ${styles['select-add']}`} onClick={addNew}>
                            <IconClickable src={Utilities.add} />
                            <span className={'font-weight-500'}>Add New</span>
                            <span className={'font-12'}>&nbsp; (up to 10 allowed)</span>
                        </div>
                    </div>
                </div>
            </div>}

            <ConfirmModal
                modalIsOpen={confirmDeleteModal}
                closeModal={()=>{setConfirmDeleteModal(false)}}
                confirmAction={()=>{deleteCustomAttribute(currentDeleteId)}}
                confirmText={'Delete'}
                message={<span>This custom field will be deleted and removed from any file that has it.&nbsp; Are you sure you want to delete this?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

            {loading && <SpinnerOverlay />}
        </div>
    )
}

export default CustomFileSizes
