import { useEffect, useState } from 'react'
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
import { AppImg, AssetOps } from '../../../../assets'
import IconClickable from "../../buttons/icon-clickable";
import Select from "../../inputs/select";
import { Utilities } from '../../../../assets'

// Maximum links
import { maximumLinks, statusList } from '../../../../constants/guest-upload'
import ShareModal from "../../modals/share-modal";
import ButtonIcon from '../../buttons/button-icon';

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

        let { data } = await guestUploadApi.getLinks({ isAll: 1, sort: 'createdAt,asc' })

        if (data.length > 0) {
            // There still be available fields to create
            if (data.length < maximumLinks) {
                const dataLength = data.length
                // Add it
                for (let i = 0; i < (maximumLinks - dataLength); i++) {
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
        } else {
            setLinkList(defaultLinks)
        }

        // Hide loading
        setLoading(false)
    }

    const deleteValue = async (customFieldIndex, valueIndex) => {
        let currentFieldList = [...linkList];
        currentFieldList[customFieldIndex].values.splice(valueIndex, 1)
        setLinkList(currentFieldList)
    }

    // Save updated changes
    const saveChanges = async (index) => {
        try {
            // Show loading
            setLoading(true)

            // Call API to delete tag
            await guestUploadApi.createLink({
                links: [
                    linkList[index]
                ]
            })

            // Updated
            if (linkList[index].id) {
                toastUtils.success('Upload link changes saved')
            } else { // Created
                toastUtils.success('Upload link has been created')
            }



            // Refresh the list
            getLinks();

            return true
        } catch (err) {
            if (err.response?.status === 400) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not create tag, please try again later.')

            // Show loading
            setLoading(false)

            return false
        }
    }

    const deleteLink = async (id) => {
        // Hide confirm modal
        setConfirmDeleteModal(false)

        // Show loading
        setLoading(true)

        // Call API to delete tag
        await guestUploadApi.deleteLink({ linkIds: [id] })

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
        if (item.value === 'public') {
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

    useEffect(() => {
        getLinks();
    }, [])

    return (
        <div className={styles['main-wrapper']}>
            <h3>Guest Upload Links</h3>

            <div className={`add ${styles['select-add']}`} onClick={() => { activateInputLink(index) }}>
                <IconClickable src={Utilities.add} />
                <span>Add New (Up to 10 Allowed)</span>
            </div>

            {linkList.map((field, index) => (
                <div className={styles.item}>
                    <div className={styles.row}>
                        <div className={styles.item_title}>Link URL</div>
                        {!field.default &&
                            <Input
                                onChange={(e) => { onInputChange(e, 'url', index) }}
                                value={`${process.env.CLIENT_BASE_URL}/guest-upload?code=${field.url}`}
                                disabled
                                placeholder={'Link URL'}
                                styleType={'regular-short'} />
                        }
                        <Button
                            styleTypes={['exclude-min-height']}
                            className={styles['copyBtn']}
                            type={'button'}
                            text='Copy Link'
                            styleType='primary'
                            onClick={(e) => {
                                copy(`${process.env.CLIENT_BASE_URL}/guest-upload?code=${field.url}`)
                            }}
                        />
                        <IconClickable additionalClass={styles['action-button']} src={AssetOps.deleteGray} tooltipText={'Delete'} tooltipId={'Delete'}
                            onClick={() => {
                                setCurrentDeleteId(field.id)
                                setConfirmDeleteModal(true)
                            }}
                        />
                    </div>

                    <div className={`${styles.row} align-items-start`}>
                        <div className={styles.input}>
                            <label>Status</label>
                            {!field.default && <Select
                                options={statusList}
                                additionalClass={'primary-input-height'}
                                onChange={(selected) => onSelectChange(selected, index)}
                                placeholder={'Select status'}
                                styleType='regular'
                                value={statusList.filter((item) => item.value === field.status)[0]}
                            />}
                        </div>

                        {field.status === 'private' &&
                            <>
                                <div className={styles.input}>
                                    <label>Password</label>
                                    <Input
                                        type={field.showPassword ? 'text' : 'password'}
                                        onChange={(e) => { onInputChange(e, 'password', index) }}
                                        value={field.password}
                                        placeholder={'Password'}
                                        styleType={'regular-short'} />

                                    <OptionList data={passwordOperations}
                                        oneColumn={true}
                                        value={field.showPassword}
                                        className={styles['showBtn']}
                                        additionalClass={styles['password-li']}
                                        setValue={(value) => { showPassword(index, value) }} toggle={true} />
                                </div>
                            </>
                        }
                    </div>

                    <div className={`${styles.row} align-items-end`}>
                        <div className={styles.banner}>
                            <label>Custom Banner (Must be at least 1920 x 300)</label>
                            <div className={styles.banner_wrapper}>
                                <img src={AppImg.guestCover} />
                            </div>
                        </div>

                        <ButtonIcon
                            icon={Utilities.addAlt}
                            text='UPLOAD PHOTO'
                        />
                    </div>
                </div>
            ))}

            <ConfirmModal
                modalIsOpen={confirmDeleteModal}
                closeModal={() => { setConfirmDeleteModal(false) }}
                confirmAction={() => { deleteLink(currentDeleteId) }}
                confirmText={'Delete'}
                message={<span>This link will be deleted. People will not access to it anymore. Are you sure you want to delete this?</span>}
                closeButtonClass={styles['close-modal-btn']}
                textContentClass={styles['confirm-modal-text']}
            />

            <ShareModal
                modalIsOpen={shareModal}
                closeModal={() => { setShareModal(false) }}
                itemsAmount={0}
                shareAssets={shareLink}
                title={'Share link'}
            />

            {loading && <SpinnerOverlay />}
        </div >
    )
}

export default Links
