import {useEffect, useState} from 'react'
import styles from './index.module.css'
import copy from 'copy-to-clipboard'

// APIs
import guestUploadApi from '../../../../server-api/guest-upload'
import SpinnerOverlay from "../../spinners/spinner-overlay";
import Input from "../../inputs/input";
import OptionList from "./option-list";
import Button from "../../buttons/button";
import ConfirmModal from "../../modals/confirm-modal";

// Utils
import toastUtils from '../../../../utils/toast'
import { AssetOps } from '../../../../assets'
import IconClickable from "../../buttons/icon-clickable";
import Select from "../../inputs/select";
import { Utilities } from '../../../../assets'

// Maximum links
import { maximumLinks, statusList } from '../../../../constants/guest-upload'
import ShareModal from "../../modals/share-modal";

const defaultLinks = [
    {
        id: null,
        url: '',
        password: '',
        values: [],
        status: 'public',
        default: true, // Created as default, this will show blank field on screen
        showPassword: false
    },
    {
        id: null,
        url: '',
        password: '',
        values: [],
        status: 'public',
        default: true,
        showPassword: false
    },
    {
        id: null,
        url: '',
        password: '',
        values: [],
        status: 'public',
        default: true,
        showPassword: false
    }
]

const Links = () => {
    const [linkList, setLinkList] = useState(defaultLinks)
    const [loading, setLoading] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [currentDeleteId, setCurrentDeleteId] = useState() // Id is pending to delete
    const [currentShareId, setCurrentShareId] = useState() // Id is pending to share
    const [shareModal, setShareModal] = useState(false)

    // Create the new tag
    const createValue = async (index, item) => {
        let currentFieldList = [...linkList];
        currentFieldList[index].values.push({
            url: item.url
        });
        setLinkList(currentFieldList)
    }

    // Get tag list
    const getLinks = async () => {
        // Show loading
        setLoading(true)

        let { data } = await guestUploadApi.getLinks({isAll: 1, sort: 'createdAt,asc'})

        if(data.length > 0){
            // There still be available fields to create
            if(data.length < maximumLinks){
                const dataLength = data.length
                // Add it
                for(let i=0;i<(maximumLinks-dataLength);i++){
                    data.push({
                        id: null,
                        url: '',
                        password: '',
                        values: [],
                        status: 'public',
                        default: true
                    })
                }
            }

            setLinkList(data)
        }else{
            setLinkList(defaultLinks)
        }

        // Hide loading
        setLoading(false)
    }

    const deleteValue = async(customFieldIndex, valueIndex) => {
        let currentFieldList = [...linkList];
        currentFieldList[customFieldIndex].values.splice(valueIndex, 1)
        setLinkList(currentFieldList)
    }

    // Save updated changes
    const saveChanges = async (index) => {
        try{
            // Show loading
            setLoading(true)

            // Call API to delete tag
            await guestUploadApi.createLink({
                links: [
                    linkList[index]
                ]
            })

            // Updated
            if(linkList[index].id){
                toastUtils.success('Upload link changes saved')
            }else{ // Created
                toastUtils.success('Upload link has been created')
            }



            // Refresh the list
            getLinks();

            return true
        }catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create tag, please try again later.')

            // Show loading
            setLoading(false)

            return false
        }
    }

    const deleteLink = async(id) => {
        // Hide confirm modal
        setConfirmDeleteModal(false)

        // Show loading
        setLoading(true)

        // Call API to delete tag
        await guestUploadApi.deleteLink({linkIds: [id]})

        // Refresh the list
        getLinks();
    }

    // On input change
    const onInputChange = (e, name, index) => {
        let currentFieldList = [...linkList];
        currentFieldList[index][name] = e.target.value;
        setLinkList(currentFieldList)
    }

    // On select option change
    const onSelectChange = (item, index) => {
        let currentFieldList = [...linkList];
        currentFieldList[index].status = item.value;

        // Switch from private to public
        if(item.value === 'public'){
            // Clear password state
            currentFieldList[index].showPassword = false
            currentFieldList[index].password = ''
        }
        setLinkList(currentFieldList)
    }

    // On click create new link button
    const activateInputLink = async (index) => {
        saveChanges(index)

    }

    // On show password field
    const showPassword = (index, value) => {
        let currentFieldList = [...linkList];
        currentFieldList[index].showPassword = value;
        setLinkList(currentFieldList)
    }

    // Share link
    const shareLink = (recipients, message) => {
        guestUploadApi.shareLink({ recipients, message, id: currentShareId })
        toastUtils.success('Link shared succesfully')
    }

    const passwordOperations = [
        {
            value: true,
            label: 'Show Password'
        }
    ]

    useEffect(()=>{
        getLinks();
    },[])

    return (
        <div className={styles['main-wrapper']}>
            {linkList.map((field, index)=>{
                return <div className={`${styles['row']} ${styles['field-block']}`} key={index}>
                    <div className={`${styles['col-50']} ${styles['col-md-80']} ${styles['col-sm-100']} p-r-0 p-l-0-mobile`}>
                        <div className={styles['row']}>
                            <div className={`${styles['col-100']} ${styles['flex-display']} p-l-0-mobile`}>
                                <span className={styles['font-weight-600']}>{index+1}.</span>
                                <span className={`${styles['row-header']} ${styles['font-weight-600']}`}>Link URL</span>
                            </div>
                            <div className={`${styles['col-100']} ${styles['p-l-30']} p-l-0-mobile`}>
                                {field.default && <div className={`add ${styles['select-add']}`} onClick={()=>{activateInputLink(index)}}>
                                    <IconClickable src={Utilities.add} />
                                    <span>Create New Link</span>
                                </div>}
                                {!field.default && <Input
                                    onChange={(e)=>{onInputChange(e, 'url', index)}}
                                    value={`${process.env.CLIENT_BASE_URL}/guest-upload?code=${field.url}`}
                                    disabled
                                    placeholder={'Link URL'}
                                    styleType={'regular-short'} />}
                            </div>
                        </div>
                    </div>
                    {!field.default && <div className={`${styles['col-15']} ${styles['col-md-20']} ${styles['col-sm-100']} p-l-0`}>
                        <div className={styles['row']}>
                            <div className={`${styles['col-100']} ${styles['col-sm-d-n']} ${styles['flex-display']}`}>
                                <span className={`${styles['font-weight-600']} ${styles['visibility-hidden']}`}>{index+1}.</span>
                                <span className={`${styles['row-header']} ${styles['visibility-hidden']}`}>Link URL</span>
                            </div>
                            <div className={`${styles['col-100']} ${styles['p-l-0']}`}>
                                <div className={`${styles['row']} justify-center ${styles['operation-row']}`}>
                                    <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`copy`]}  tooltipText={'Copy'} tooltipId={'Copy'}
                                                   onClick={(e)=>{
                                                       copy(`${process.env.CLIENT_BASE_URL}/guest-upload?code=${field.url}`)
                                                   }}
                                    />

                                    <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`share`]}  tooltipText={'Share'} tooltipId={'Share'}
                                                   onClick={()=>{
                                                       setCurrentShareId(field.id)
                                                       setShareModal(true)
                                                   }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className={`${styles['col-15']} ${styles['col-md-80']} ${styles['col-sm-100']} p-l-0`}>
                        <div className={styles['row']}>
                            <div className={`${styles['col-100']} p-l-0`}>
                                <span className={`${styles['row-header']} ${styles['font-weight-600']} m-l-0-mobile`}>Status</span>
                            </div>
                            <div className={`${styles['col-100']} p-l-15 p-l-0-mobile`}>
                                {!field.default && <Select
                                    options={statusList}
                                    additionalClass={'primary-input-height'}
                                    onChange={(selected) => onSelectChange(selected, index)}
                                    placeholder={'Select status'}
                                    styleType='regular'
                                    value={statusList.filter((item)=> item.value === field.status)[0]}
                                />}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles['col-20']} ${styles['col-md-80']} ${styles['col-sm-100']} ${styles['button-row']} p-l-0`}>
                        <div className={styles['row']}>
                            <div className={`${styles['col-100']} p-l-0-mobile`}>
                                <span className={`${styles['row-header']} ${styles['font-weight-600']} ${styles['visibility-hidden']}`}>Status</span>
                            </div>
                            <div className={`${field.status === 'public' ? 'p-r-0' : ''} ${styles['col-100']}  p-l-0-mobile`}>
                                {field.status === 'private' && <>
                                    <Input
                                    type={field.showPassword ? 'text' : 'password'}
                                    onChange={(e)=>{onInputChange(e, 'password', index)}}
                                    value={field.password}
                                    placeholder={'Password'}
                                    styleType={'regular-short'} />

                                    <OptionList data={passwordOperations}
                                                oneColumn={true}
                                                value={field.showPassword}
                                                additionalClass={styles['password-li']}
                                                setValue={(value)=>{showPassword(index, value)}} toggle={true}/>
                                </>
                                }

                                {field.status === 'public' && <div className={`${styles['button-row']} p-l-0 flex-row-reverse`}>
                                    {field.id && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`delete`]}  tooltipText={'Delete'} tooltipId={'Delete'}
                                                                onClick={()=>{
                                                                    setCurrentDeleteId(field.id)
                                                                    setConfirmDeleteModal(true)
                                                                }}
                                    />}
                                    {field.id && <Button
                                        styleTypes={['exclude-min-height']}
                                        type={'button'}
                                        text='Save'
                                        styleType='primary'
                                        onClick={()=>{saveChanges(index)}}
                                        disabled={!field.url}
                                    />}

                                </div>
                                }
                            </div>
                        </div>
                    </div>

                    {field.status === 'private' &&
                    <div className={`${styles['col-100']} ${styles['col-md-100']} ${styles['button-row']} p-l-0 flex-row-reverse m-t-20`}>
                        {field.id && <IconClickable additionalClass={styles['action-button']}  src={AssetOps[`delete`]}  tooltipText={'Delete'} tooltipId={'Delete'}
                                                    onClick={()=>{
                                                        setCurrentDeleteId(field.id)
                                                        setConfirmDeleteModal(true)
                                                    }}
                        />}
                        {field.id && <Button
                            styleTypes={['exclude-min-height']}
                            type={'button'}
                            text='Save'
                            styleType='primary'
                            onClick={()=>{saveChanges(index)}}
                            disabled={!field.url}
                        />}

                    </div>}
                </div>
            })}

            <ConfirmModal
                modalIsOpen={confirmDeleteModal}
                closeModal={()=>{setConfirmDeleteModal(false)}}
                confirmAction={()=>{deleteLink(currentDeleteId)}}
                confirmText={'Delete'}
                message={<span>This link will be deleted. People will not access to it anymore. Are you sure you want to delete this?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

            <ShareModal
                modalIsOpen={shareModal}
                closeModal={()=>{setShareModal(false)}}
                itemsAmount={0}
                shareAssets={shareLink}
                title={'Share link'}
            />

            {loading && <SpinnerOverlay />}
        </div>
    )
}

export default Links
