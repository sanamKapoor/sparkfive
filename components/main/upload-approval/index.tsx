import { useState, useEffect, useContext, useRef } from 'react'
import _ from 'lodash'
import Router from "next/router"
import moment from "moment";
import update from "immutability-helper";

// Components
import AssetSubheader from '../../common/asset/asset-subheader'
import IconClickable from "../../common/buttons/icon-clickable";
import DriveSelector from "../../common/asset/drive-selector";
import Base from '../../common/modals/base'
import AssetThumbail from "../../common/asset/asset-thumbail";
import Button from "../../common/buttons/button";
import CreatableSelect from "../../common/inputs/creatable-select";
import TextArea from "../../common/inputs/text-area";
import RenameModal from "../../common/modals/rename-modal";
import Input from "../../common/inputs/input";
import AssetImg from "../../common/asset/asset-img";

//Styles
import styles from './index.module.css'
import assetGridStyles from "../../common/asset/asset-grid.module.css";
import detailPanelStyles from "../../common/asset/detail-side-panel.module.css";

import { Assets } from '../../../assets'

// Contexts
import { UserContext, AssetContext, LoadingContext } from '../../../context'


// Utils
import toastUtils from '../../../utils/toast'
import cookiesUtils from '../../../utils/cookies'
import {getFolderKeyAndNewNameByFileName} from "../../../utils/upload";
import {validation} from "../../../constants/file-validation";
import { Utilities } from '../../../assets'


// APIs
import assetApi from '../../../server-api/asset'
import tagApi from '../../../server-api/tag'
import approvalApi from '../../../server-api/upload-approvals'


import {  ASSET_UPLOAD_APPROVAL } from '../../../constants/permissions'




const UploadApproval = () => {

    const { advancedConfig, setAdvancedConfig, hasPermission } = useContext(UserContext)

    const {
        setNeedsFetch,
        setAddedIds,
        folders,
        showUploadProcess,
        setUploadingType,
        setUploadingAssets,
        setUploadingFileName,
        setUploadSourceType,
        setTotalAssets,
        totalAssets,
        setFolderImport,
    } = useContext(AssetContext)

    const { setIsLoading } = useContext(LoadingContext);

    const [assets, setAssets] = useState([])
    const [selectedAssets, setSelectedAssets] = useState([])
    const [duplicateAssets, setDuplicateAssets] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false)
    const [uploadFrom, setUploadFrom] = useState('');
    const versionGroup = ""
    const [selectedAllAssets, setSelectedAllAssets] = useState(false)

    const [activeDropdown, setActiveDropdown] = useState('')
    const [inputTags, setInputTags] = useState([])
    const [assetTags, setTags] = useState([]) // Used for right pannel to update bulk, need to reset
    const [approvalId, setApprovalId] = useState()
    const [comments, setComments] = useState("") // Used for right pannel to update bulk, need to reset
    const [message, setMessage] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const [showRenameModal, setShowRenameModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showDetailModal, setDetailModal] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState()

    const [tempTags, setTempTags] = useState([]) // For update tag in each asset
    const [tempComments, setTempComments] = useState("") // For update tag in each asset

    const [batchName, setBatchName] = useState("")

    const fileBrowserRef = useRef(undefined)

    const getCreationParameters = (attachQuery?: any) => {
        const activeFolder = "";
        const type = "";

        let queryData: any = {}

        let uploadToFolders = []

        if(activeFolder){
            uploadToFolders = [activeFolder]
        }

        if(folders.filter((folder)=>folder.isSelected).length > 0){
            uploadToFolders = folders.filter((folder)=>folder.isSelected).map((folder)=>folder.id)
        }

        queryData.folderId = uploadToFolders.join(",")

        // Attach extra query
        if(attachQuery){
            queryData = {...queryData, ...attachQuery}
        }
        return queryData
    }

    const updateAssetList = (newAssetPlaceholder, currentDataClone, folderUploadInfo) => {
        const lastAsset = newAssetPlaceholder[newAssetPlaceholder.length-1]
        if (lastAsset) {
            let allAssets = [...newAssetPlaceholder, ...currentDataClone]
            allAssets = _.uniqBy(allAssets, 'asset.versionGroup')

            setAssets(allAssets)
        }
    }

    const setUploadUpdate = (versionGroup, updatedAssets) => {
        setUploadingType(versionGroup ? 'version' : 'assets')
        setUploadingAssets(updatedAssets)
    }

    // Upload asset
    const uploadAsset  = async (i: number, assets: any, currentDataClone: any, totalSize: number, folderId, folderGroup = {}, subFolderAutoTag = true, requestId = "") => {
        let folderUploadInfo
        try{
            const formData = new FormData()
            let file = assets[i].file.originalFile
            let currentUploadingFolderId = null
            let newAssets = 0

            // Get file group info, this returns folderKey and newName of file
            let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.webkitRelativePath, subFolderAutoTag)
            folderUploadInfo = {name: fileGroupInfo.folderKey, size: totalSize}

            // Do validation
            if(assets[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE){
                // Violate validation, mark failure
                const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, status: 'fail', index, error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE} : asset);

                // Update uploading assets
                setUploadUpdate(versionGroup, updatedAssets)

                // Remove current asset from asset placeholder
                let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


                // At this point, file place holder will be removed
                updateAssetList(newAssetPlaceholder, currentDataClone, folderUploadInfo)


                // The final one
                if (i === assets.length - 1) {
                    return folderGroup
                } else { // Keep going
                    await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
                }
            } else {
                // Show uploading toast
                showUploadProcess('uploading', i)

                // Set current upload file name
                setUploadingFileName(assets[i].asset.name)


                // If user is uploading files in folder which is not saved from server yet
                if(fileGroupInfo.folderKey && !folderId){
                    // Current folder Group have the key
                    if(folderGroup[fileGroupInfo.folderKey]){
                        // Store this key to use to upload to same folder
                        currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey]
                        // Assign new file name without splash
                        // file = new File([file.slice(0, file.size, file.type)],
                        // 	fileGroupInfo.newName
                        // 	, { type: file.type, lastModified: (file.lastModifiedDate || new Date(file.lastModified)) })
                    }
                }


                // Append file to form data
                formData.append('asset', file)
                formData.append('fileModifiedAt', new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString())

                let size = totalSize;
                // Calculate the rest of size
                assets.map((asset)=>{
                    // Exclude done or fail assets
                    if(asset.status === 'done' || asset.status === 'fail'){
                        size -= asset.asset.size
                        newAssets+=1
                    }
                })

                let attachedQuery = {estimateTime: 1, size, totalSize, requireApproval: 1}


                // Uploading inside specific folders which already existed in server
                if(folderId){
                    attachedQuery['folderId'] = folderId
                }

                if (versionGroup) {
                    attachedQuery['versionGroup'] = versionGroup
                }

                // For duplicate asset upload
                if (assets[i].asset && assets[i].asset.versionGroup) {
                    attachedQuery['versionGroup'] = assets[i].asset.versionGroup
                }

                if (assets[i].asset && assets[i].asset.changedName) {
                    attachedQuery['changedName'] = assets[i].asset.changedName
                }

                // Uploading the new folder where it's folderId has been created earlier in previous API call
                if(currentUploadingFolderId){
                    attachedQuery['folderId'] = currentUploadingFolderId
                }

                if(requestId){
                    attachedQuery['approvalId'] = requestId
                }

                // Call API to upload
                let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery))

                if(!requestId){
                    setApprovalId(data[0].requestId)
                    requestId = data[0].requestId
                }


                // If user is uploading files in folder which is not saved from server yet
                // Save folders data in response to use for subsequence request so that files in same folder can be located correctly
                if(fileGroupInfo.folderKey && !folderId){
                    /// If user is uploading new folder and this one still does not have folder Id, add it to folder group
                    if(!folderGroup[fileGroupInfo.folderKey]){
                        folderGroup[fileGroupInfo.folderKey] = data[0].asset.folders[0]
                    }
                }


                data = data.map((item) => {
                    item.isSelected = true
                    return item
                })

                assets[i] = data[0]

                // At this point, file place holder will be removed
                updateAssetList(assets, currentDataClone, folderUploadInfo)

                setAddedIds(data.map(assetItem => assetItem.asset.id))

                // Update total assets
                setTotalAssets(totalAssets + newAssets +1)

                // Mark this asset as done
                const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, status: 'done'} : asset);

                // Update uploading assets
                setUploadUpdate(versionGroup, updatedAssets)

                // The final one
                if(i === assets.length - 1){
                    return
                } else { // Keep going
                    await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag, requestId)
                }
            }
        } catch (e){
            // Violate validation, mark failure
            const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, index, status: 'fail', error: 'Processing file error'} : asset);

            // Update uploading assets
            setUploadUpdate(versionGroup, updatedAssets)

            // Remove current asset from asset placeholder
            let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


            // At this point, file place holder will be removed
            updateAssetList(newAssetPlaceholder, currentDataClone, folderUploadInfo)


            // The final one
            if (i === assets.length - 1) {
                return folderGroup
            } else { // Keep going
                await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag, requestId)
            }
        }
    }

    const onDropboxFilesGet = async (files) => {
        let currentDataClone = [...assets]
        try {
            let totalSize = 0
            const newPlaceholders = []
            files.forEach(file => {
                totalSize += file.bytes
                newPlaceholders.push({
                    asset: {
                        name: file.name,
                        createdAt: new Date(),
                        size: file.bytes,
                        stage: 'draft',
                        type: 'image'
                    },
                    isUploading: true
                })
            })

            if (!versionGroup) {
                setAssets([...newPlaceholders, ...currentDataClone])

                // Update uploading assets
                setUploadingAssets(newPlaceholders)
            }

            // Show uploading process
            showUploadProcess('uploading')

            // Show message
            setUploadingFileName('Importing files from Drop Box')

            setUploadSourceType('dropbox')

            // Check if there is 1 folder in upload links
            const containFolderUrl = files.filter(file => file.isDir)

            setFolderImport(containFolderUrl.length > 0)

            const { data } = await assetApi.importAssets('dropbox', files.map(file => ({
                    link: file.link,
                    isDir: file.isDir,
                    name: file.name,
                    size: file.bytes,
                    versionGroup: (file.versionGroup || versionGroup),
                    changedName: file.changedName
                })),
                getCreationParameters({estimateTime: 1, totalSize, requireApproval: 1}))

            // clean old version for main grid
            if (versionGroup) {
                currentDataClone = currentDataClone.filter(item => {
                    return item.asset.versionGroup !== versionGroup
                })
            }

            updateAssetList(data, currentDataClone, undefined)

            setAddedIds(data.id)

            // Mark done
            const updatedAssets = data.map(asset => { return {...asset, status: 'done'}});

            // Update uploading assets
            setUploadUpdate(versionGroup, updatedAssets)

            // Mark process as done
            showUploadProcess('done')

            // Reset upload source type
            setUploadSourceType('')
            // toastUtils.success('Assets imported.')
        } catch (err) {
            // Finish uploading process
            showUploadProcess('done')

            setAssets(currentDataClone)

            setAssets(currentDataClone)
            console.log(err)
            if (err.response?.status === 402) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not import assets, please try again later.')
        }
    }

    const onDropboxFilesSelection = async (files) => {
        if (advancedConfig.duplicateCheck) {
            const names = files.map(file => file['name'])
            const {data: { duplicateAssets }} = await assetApi.checkDuplicates(names)
            if (duplicateAssets.length) {
                setSelectedFiles(files)
                setDuplicateAssets(duplicateAssets)
                setDuplicateModalOpen(true)
                setUploadFrom('dropbox')
                if (fileBrowserRef.current.value) {
                    fileBrowserRef.current.value = ''
                }
            } else {
                onDropboxFilesGet(files)
            }
        } else {
            onDropboxFilesGet(files)
        }
    }

    const onDriveFilesSelection = async (files) => {
        if (advancedConfig.duplicateCheck) {
            const names = files.map(file => file['name'])
            const {data: { duplicateAssets }} = await assetApi.checkDuplicates(names)
            if (duplicateAssets.length) {
                setSelectedFiles(files)
                setDuplicateAssets(duplicateAssets)
                setDuplicateModalOpen(true)
                setUploadFrom('gdrive')
                if (fileBrowserRef.current.value) {
                    fileBrowserRef.current.value = ''
                }
            } else {
                onGdriveFilesGet(files)
            }
        } else {
            onGdriveFilesGet(files)
        }
    }

    const onGdriveFilesGet = async (files) => {
        const googleAuthToken = cookiesUtils.get('gdriveToken')
        let currentDataClone = [...assets]
        try {
            let totalSize = 0
            const newPlaceholders = []
            files.forEach(file => {
                totalSize += file.sizeBytes
                newPlaceholders.push({
                    asset: {
                        name: file.name,
                        createdAt: new Date(),
                        size: file.sizeBytes,
                        stage: 'draft',
                        type: 'image'
                    },
                    isUploading: true
                })
            })

            if (!versionGroup) {
                setAssets([...newPlaceholders, ...currentDataClone])
                // Update uploading assets
                setUploadingAssets(newPlaceholders)
            }

            // Show uploading process
            showUploadProcess('uploading')

            // Show message
            setUploadingFileName('Importing files from Google Drive')

            setUploadSourceType('dropbox')

            // Check if there is 1 folder in upload links
            const containFolderUrl = files.filter(file => file.type === 'folder')

            setFolderImport(containFolderUrl.length > 0)

            const { data } = await assetApi.importAssets('drive', files.map(file => ({
                googleAuthToken,
                id: file.id,
                name: file.name,
                size: file.sizeBytes,
                mimeType: file.mimeType,
                type: file.type,
                versionGroup: file.versionGroup || versionGroup,
                changedName: file.changedName
            })), getCreationParameters({estimateTime: 1, totalSize, requireApproval: 1}))

            // clean old version for main grid
            if (versionGroup) {
                currentDataClone = currentDataClone.filter(item => {
                    return item.asset.versionGroup !== versionGroup
                })
            }

            updateAssetList(data, currentDataClone, undefined)

            setAddedIds(data.id)

            // Mark done
            const updatedAssets = data.map(asset => { return {...asset, status: 'done'}});

            // Update uploading assets
            setUploadUpdate(versionGroup, updatedAssets)

            // Mark process as done
            showUploadProcess('done')

            // Reset upload source type
            setUploadSourceType('')

            // toastUtils.success('Assets imported.')
        } catch (err) {
            // Finish uploading process
            showUploadProcess('done')

            setAssets(currentDataClone)

            console.log(err)
            if (err.response?.status === 402) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not import assets, please try again later.')
        }
    }

    const openDropboxSelector = (files) => {
        const options = {
            success: onDropboxFilesSelection,
            linkType: 'preview',
            multiselect: versionGroup ? false : true,
            folderselect: versionGroup ? false : true,
            sizeLimit: 1000 * 1024 * 1024 * 2
        }
        // Ignore this annoying warning
        Dropbox.choose(options)
    }

    const dropdownOptions = [
        {
            id: 'file',
            label: 'Upload',
            text: 'png, jpg, mp4 and more',
            onClick: () => fileBrowserRef.current.click(),
            icon: Assets.file
        },
        {
            id: 'dropbox',
            label: 'Dropbox',
            text: 'Import files',
            onClick: openDropboxSelector,
            icon: Assets.dropbox
        },
        {
            id: 'gdrive',
            label: 'Google Drive',
            text: 'Import files',
            onClick: () => { },
            icon: Assets.gdrive,
            CustomContent: ({ children }) => {
                return (
                    <DriveSelector
                        multiSelect={versionGroup ? false : true}
                        folderSelect={versionGroup ? false : true}
                        onFilesSelect={onDriveFilesSelection}
                    >
                        {children}
                    </DriveSelector>
                )
            }
        }
    ]

    const DropDownOptions = () => {

        const Content = (option) => {
            return (
                <span className={styles.option}
                      onClick={option.onClick}>
					<IconClickable src={option.icon} additionalClass={styles.icon} />
					<div className={styles['option-label']}>{option.label}</div>
					<div className={styles['option-text']}>{option.text}</div>
				</span>
            )
        }

        return (
            <ul className={`${styles['options-list']} ${styles["dropdown"]}`}>
                {dropdownOptions.map((option, indx) => (
                    <li key={indx.toString()}>
                        {option.CustomContent ?
                            <option.CustomContent>
                                <Content {...option} />
                            </option.CustomContent>
                            :
                            <Content {...option} />
                        }
                    </li>
                ))}
            </ul>
        )
    }

    const onFilesDataGet = async (files) => {
        const currentDataClone = [...assets]
        try {
            const newPlaceholders = []

            let totalSize = 0;
            files.forEach(file => {
                totalSize+=file.originalFile.size
                const asset = {
                    name: file.originalFile.name,
                    createdAt: new Date(),
                    size: file.originalFile.size,
                    stage: 'draft',
                    type: 'image',
                    mimeType: file.originalFile.type,
                    fileModifiedAt: file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified),
                    // from duplicate handle
                    versionGroup: file.versionGroup,
                    changedName: file.changedName
                }
                if (file.versionGroup) {
                    asset.versionGroup = file.versionGroup
                }
                if (file.changedName) {
                    asset.changedName = file.changedName
                }
                newPlaceholders.push({
                    asset,
                    file,
                    status: 'queued',
                    isUploading: true
                })
                // formData.append('asset', file.path || file.originalFile)
            })

            // Store current uploading assets for calculation
            setUploadingAssets(newPlaceholders)

            // Showing assets = uploading assets + existing assets
            setAssets([...newPlaceholders, ...currentDataClone])

            // Get team advance configurations first
            const { subFolderAutoTag } =  advancedConfig;

            // Start to upload assets
            await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, "", undefined, subFolderAutoTag)

            // Finish uploading process
            showUploadProcess('done')

            // Do not need toast here because we have already process toast
            // toastUtils.success(`${data.length} Asset(s) uploaded.`)
        } catch (err) {
            // Finish uploading process
            showUploadProcess('done')

            setAssets(currentDataClone)
            console.log(err)
            if (err.response?.status === 402) toastUtils.error(err.response.data.message)
            else toastUtils.error('Could not upload assets, please try again later.')
        }
    }

    const onFileChange = async (e) => {
        const files = Array.from(e.target.files).map(originalFile => ({ originalFile }))
        // if (advancedConfig.duplicateCheck) {
        //     const names = files.map(file => file.originalFile['name'])
        //     const {data: { duplicateAssets }} = await assetApi.checkDuplicates(names)
        //     if (duplicateAssets.length) {
        //         setSelectedFiles(files)
        //         setDuplicateAssets(duplicateAssets)
        //         setDuplicateModalOpen(true)
        //         setUploadFrom('browser')
        //         if (fileBrowserRef.current.value) {
        //             fileBrowserRef.current.value = ''
        //         }
        //     } else {
        //         onFilesDataGet(files)
        //     }
        // } else {
            onFilesDataGet(files)
        // }
    }

    const toggleSelected = (id) => {
        const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
        const selectedValue = !assets[assetIndex].isSelected
        // Toggle unselect when selected all will disable selected all
        if(!selectedValue && selectedAllAssets){
            setSelectedAllAssets(false)
        }
        setAssets(update(assets, {
            [assetIndex]: {
                isSelected: { $set: !assets[assetIndex].isSelected }
            }
        }))
    }

    // Select all assets
    const selectAllAssets = (value = true) => {
        setSelectedAllAssets(value)
        let assetList = [...assets]
        assetList.map((asset)=>{
            asset.isSelected = value
        })

        setAssets(assetList)

    }

    // Check if there is any asset is selected
    const hasSelectedAssets = () => {
        if(selectedAllAssets){
            return true
        }

        const selectedArr = assets.filter((asset)=>asset.isSelected)

        return selectedArr.length > 0
    }

    // Check if there is uploaded asset to submit
    const hasAssetToSubmit = () => {
        const selectedArr = assets.filter((asset)=>asset.realUrl)

        return selectedArr.length > 0

    }

    const getTagsInputData = async () => {
        try {
            const tagsResponse = await tagApi.getTags()
            setInputTags(tagsResponse.data)
        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    const saveBulkTag = async () => {
        setIsLoading(true)

        for(const { asset, isSelected, tags } of assets){
            let tagPromises = []
            let removeTagPromises = []

            if(isSelected){
                const newTags = _.differenceBy(assetTags, tags || [])
                const removeTags = _.differenceBy(tags || [], assetTags)

                for( const tag of removeTags){
                    removeTagPromises.push(assetApi.removeTag(asset.id, tag.id))
                }

                for( const tag of newTags){
                    tagPromises.push(assetApi.addTag(asset.id, tag))
                }
            }

            await Promise.all(tagPromises)
            await Promise.all(removeTagPromises)
        }

        // Save tags to asset
        let assetArr = [...assets];
        assetArr.map((asset)=>{
            if(asset.isSelected){
                asset.tags = assetTags
            }
        })


        toastUtils.success(`Save successfully`)

        // Reset tags
        setTags([])

        setIsLoading(false)
    }

    const saveComment = async () => {
        setIsLoading(true)

        let promises = []

        for(const { asset, isSelected } of assets){
            if(isSelected){
                promises.push(approvalApi.addComments(asset.id, { comments, approvalId}))
            }
        }

        await Promise.all(promises)

        // Save comments to asset
        let assetArr = [...assets];
        assetArr.map((asset)=>{
            if(asset.isSelected){
                asset.comments = comments
            }
        })

        setAssets(assetArr)

        toastUtils.success(`Save successfully`)

        // Reset comments
        setComments("")

        setIsLoading(false)
    }

    const submit = async () => {
        setIsLoading(true)

        await approvalApi.submit(approvalId, { message, name: batchName })

        setSubmitted(true)

        toastUtils.success(`Save successfully`)

        setIsLoading(false)
    }

    const onViewAsset = (index) => {
        setSelectedAsset(index)
        setDetailModal(true)

        // @ts-ignore
        setTempTags(assets[index]?.tags || [])
        // @ts-ignore
        setTempComments(assets[index]?.comments || "")
    }

    const goNext = () => {
        if((selectedAsset || 0) < assets.length-1){
            setTempTags([])
            setTempComments("")

            const next = (selectedAsset || 0) + 1
            // @ts-ignore
            setSelectedAsset(next)

            // @ts-ignore
            setTempTags(assets[next]?.tags || [])
            // @ts-ignore
            setTempComments(assets[next]?.comments || "")

            // @ts-ignore
            setSelectedAsset(next)
        }
    }

    const goPrev = () => {
        if((selectedAsset || 0) > 0){
            setTempTags([])
            setTempComments("")

            const next = (selectedAsset || 0) -1
            // @ts-ignore
            setSelectedAsset(next)

            // @ts-ignore
            setTempTags(assets[next]?.tags || [])
            // @ts-ignore
            setTempComments(assets[next]?.comments || "")

            // @ts-ignore
            setSelectedAsset(next)
        }
    }

    const onSaveSingleAsset = async () => {
        if(selectedAsset !== undefined){

            setIsLoading(true);

            // @ts-ignore
            const assetArr = [assets[selectedAsset]]
            const saveTag = async () => {

                let promises = []
                let removeTagPromises = []

                for(const { asset } of assetArr){
                    let tagPromises = []

                    // Find the new tags
                    // @ts-ignore
                    const newTags = _.differenceBy(tempTags, assets[selectedAsset]?.tags || [])
                    const removeTags = _.differenceBy(assets[selectedAsset]?.tags || [], tempTags)

                    for( const tag of newTags){
                        tagPromises.push(assetApi.addTag(asset.id, tag))
                    }

                    for( const tag of removeTags){
                        removeTagPromises.push(assetApi.removeTag(asset.id, tag.id))

                    }

                    await Promise.all(tagPromises)
                }

                return await Promise.all(promises)
            }

            const saveComment = async () => {
                let promises = []

                for(const { asset } of assetArr){
                    promises.push(approvalApi.addComments(asset.id, { comments: tempComments, approvalId}))
                }

                return await Promise.all(promises)
            }

            await saveTag()
            await saveComment()

            // Update these tag and comments to asset
            let assetArrData = [...assets]
            // @ts-ignore
            assetArrData[selectedAsset].tags = tempTags
            // @ts-ignore
            assetArrData[selectedAsset].comments = tempComments

            toastUtils.success(`Save successfully`)

            setIsLoading(false);
        }

    }

    // Rename asset
    const confirmAssetRename = async (newValue) => {
        try {
            setIsLoading(true)

            // @ts-ignore
            const editedName = `${newValue}.${assets[selectedAsset]?.asset.extension}`;

            // Call API to upload asset
            // @ts-ignore
            await assetApi.updateAsset(assets[selectedAsset]?.asset.id, {
                updateData: { name: editedName },
            });

            // Update asset list
            let currentAssets = [...assets]
            // @ts-ignore
            currentAssets[selectedAsset].asset.name = newValue
            setAssets(currentAssets)


            setIsLoading(false)


            toastUtils.success("Asset name updated");
        } catch (err) {
            // console.log(err);
            toastUtils.error("Could not update asset name");
        }
    };

    const checkValidUser = () => {
        if(!hasPermission([ASSET_UPLOAD_APPROVAL])){
            Router.replace("/")
        }
    }

    const hasBothTagAndComments = (asset) => {
        return asset.tags && asset.tags.length > 0 && asset.comments
    }

    const hasTagOrComments = (asset) => {
        return (asset.tags && asset.tags.length > 0 )|| asset.comments
    }

    useEffect(() => {
        checkValidUser()
        getTagsInputData()
    }, [])

  return (
    <>
      <AssetSubheader
        activeFolder={""}
        getFolders={()=>{}}
        mode={"assets"}
        amountSelected={selectedAssets.length }
        activeFolderData={null}
        backToFolders={()=>{}}
        setRenameModalOpen={()=>{}}
        activeSortFilter={{}}
        titleText={"File Upload Page"}
        showAssetAddition={false}
      />
        <div className={"row"}>
            <div className={"col-70"}>
                <main className={`${styles.container}`}>
                    { <>
                        <p className={styles.title}>Upload a file or a batch, tag or comment</p>
                        <input multiple={versionGroup ? false : true} id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
                               onChange={onFileChange} />

                        <div className={styles['operation-wrapper']}>
                            <DropDownOptions />

                            <div className={styles['button-wrapper']}>
                                {assets.length > 0 && hasSelectedAssets() && <Button type='button' text='Deselect' styleType='secondary' onClick={()=>{selectAllAssets(false)}} />}
                                {assets.length > 0 && hasAssetToSubmit() && <Button type='button' text='Select All' styleType='secondary' onClick={selectAllAssets} />}
                                {assets.length > 0 && hasAssetToSubmit() && <Button type='button' text='Submit Batch' styleType='primary' onClick={()=>{
                                    if(!batchName){
                                        toastUtils.error('Please enter the batch name to submit')
                                    }else{
                                        setShowConfirmModal(true)}
                                }

                                } />}
                            </div>


                        </div>
                    </>}





                    <div className={styles["asset-list"]}>
                        <div className={assetGridStyles["list-wrapper"]}>
                            <ul className={`${assetGridStyles["grid-list"]} ${assetGridStyles["regular"]}`}>
                                {
                                    assets.map((assetItem, index) => {
                                        if (assetItem.status !== "fail") {
                                            return (
                                                <li
                                                    className={assetGridStyles["grid-item"]}
                                                    key={assetItem.asset.id || index}
                                                >
                                                    <AssetThumbail
                                                        {...assetItem}
                                                        sharePath={""}
                                                        activeFolder={""}
                                                        isShare={false}
                                                        type={""}
                                                        showAssetOption={false}
                                                        toggleSelected={() =>{
                                                            toggleSelected(assetItem.asset.id)
                                                        }}
                                                        openArchiveAsset={() =>{
                                                            // openArchiveAsset(assetItem.asset)
                                                        }}
                                                        openDeleteAsset={() =>{
                                                            // openDeleteAsset(assetItem.asset.id)
                                                        }}
                                                        openMoveAsset={() =>{
                                                            // beginAssetOperation({ asset: assetItem }, "move")
                                                        }}
                                                        openCopyAsset={() =>{
                                                            // beginAssetOperation({ asset: assetItem }, "copy")
                                                        }}
                                                        openShareAsset={() =>{
                                                            // beginAssetOperation({ asset: assetItem }, "share")
                                                        }}
                                                        downloadAsset={() => {
                                                            // downloadAsset(assetItem)}
                                                        }}
                                                        openRemoveAsset={() =>{
                                                            // beginAssetOperation(
                                                            //     { asset: assetItem },
                                                            //     "remove_item"
                                                            // )
                                                        }}
                                                        handleVersionChange={()=>{}}
                                                        loadMore={()=>{}}
                                                        onView={()=>{onViewAsset(index)}}
                                                        infoWrapperClass={styles['asset-grid-info-wrapper']}
                                                        textWrapperClass={
                                                            hasTagOrComments(assetItem) ?
                                                                (hasBothTagAndComments(assetItem) ? styles['asset-grid-text-wrapper-2-icon'] : styles['asset-grid-text-wrapper'] ) :
                                                                "w-100"}
                                                        customIconComponent={<div className={`${styles['icon-wrapper']} d-flex`}>
                                                            {assetItem.comments && <IconClickable additionalClass={styles['edit-icon']} src={Utilities.comment} onClick={()=> {}} />}
                                                            {assetItem.tags && assetItem.tags.length > 0 && <IconClickable additionalClass={styles['edit-icon']} src={Utilities.greenTag} onClick={()=> {}} />}
                                                        </div>}
                                                    />
                                                </li>
                                            );
                                        }
                                    })}
                            </ul>
                        </div>
                    </div>

                </main>
            </div>
            {assets.length > 0 && hasAssetToSubmit() && <div className={`col-30 ${styles['right-panel']}`}>
                <div className={detailPanelStyles.container}>
                    <h2 className={styles['detail-title']}>Tagging</h2>
                    <div className={detailPanelStyles['first-section']}>
                        <div className={detailPanelStyles['field-wrapper']}>

                            <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Batch Name</div>
                            <Input
                                onChange={(e)=>{setBatchName(e.target.value)}}
                                placeholder={'Batch Name'}
                                value={batchName}
                                styleType={'regular-height-short'} />
                        </div>
                    </div>

                    {hasSelectedAssets() && <>
                        <div className={detailPanelStyles['field-wrapper']} >
                            <CreatableSelect
                                title='Tags'
                                addText='Add Tags'
                                onAddClick={() => setActiveDropdown('tags')}
                                selectPlaceholder={'Enter a new tag or select an existing one'}
                                avilableItems={inputTags}
                                setAvailableItems={setInputTags}
                                selectedItems={assetTags}
                                setSelectedItems={setTags}
                                creatable={false}
                                onAddOperationFinished={(stateUpdate) => {
                                    setActiveDropdown("")
                                    // updateAssetState({
                                    //     tags: { $set: stateUpdate }
                                    // })
                                    // loadTags()
                                }}
                                onRemoveOperationFinished={async (index, stateUpdate) => {
                                    // await assetApi.removeTag(id, assetTags[index].id)
                                    // updateAssetState({
                                    //     tags: { $set: stateUpdate }
                                    // })
                                }}
                                onOperationFailedSkipped={() => setActiveDropdown('')}
                                isShare={false}
                                asyncCreateFn={(newItem) => {
                                    return { data: newItem }
                                    // assetApi.addTag(id, newItem)
                                }}
                                dropdownIsActive={activeDropdown === 'tags'}
                            />
                        </div>

                        <Button className={styles['add-tag-btn']} type='button' text='Bulk Add Tag' styleType='secondary' onClick={saveBulkTag} />

                        <div className={detailPanelStyles['field-wrapper']} >
                            <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Comments</div>
                            <TextArea type={"textarea"} rows={4} placeholder={'Add comments'} value={comments}
                                      onChange={e => {setComments(e.target.value)}} styleType={'regular-short'} />
                        </div>

                        <Button className={styles['add-tag-btn']} type='button' text='Add comments' styleType='secondary' onClick={saveComment} />
                    </>}




                </div>
            </div>}
        </div>

        <Base
            modalIsOpen={showDetailModal}
            closeModal={()=>{setDetailModal(false)}}
            confirmText={""}
            headText={"Test"}
            closeButtonOnly={true}
            disabledConfirm={false}
            additionalClasses={['visible-block', styles['approval-detail-modal']]}
            showCancel={false}
            confirmAction={() => {
            }} >
            <div className={`row ${styles['modal-wrapper']} height-100`}>
                <div className={`col-60 ${styles["left-bar"]}`}>
                    <AssetImg
                        imgClass={""}
                        assetImg={assets[selectedAsset]?.realUrl}
                        type={""}
                        name={"image"}
                    />
                    {/*<img alt={"test"} src={assets[selectedAsset]?.realUrl} />*/}
                    <div className={styles['file-name']}>
                        <span>{assets[selectedAsset]?.asset.name}</span>
                        <IconClickable additionalClass={styles['edit-icon']} src={Utilities.edit} onClick={()=> {setShowRenameModal(true)}} />
                    </div>
                    <div className={styles['date']}>{moment(assets[selectedAsset]?.asset?.createdAt).format('MMM DD, YYYY, hh:mm a')}</div>
                </div>
                <div className={"col-40"}>
                    <div className={detailPanelStyles.container}>
                        <h2 className={styles['detail-title']}>Add Attributes to Selected Assets</h2>

                        <div className={detailPanelStyles['field-wrapper']} >
                            <CreatableSelect
                                title='Tags'
                                addText='Add Tags'
                                onAddClick={() => setActiveDropdown('tags')}
                                selectPlaceholder={'Enter a new tag or select an existing one'}
                                avilableItems={inputTags}
                                setAvailableItems={setInputTags}
                                selectedItems={tempTags}
                                setSelectedItems={setTempTags}
                                creatable={false}
                                onAddOperationFinished={(stateUpdate) => {
                                    setActiveDropdown("")
                                    // updateAssetState({
                                    //     tags: { $set: stateUpdate }
                                    // })
                                    // loadTags()
                                }}
                                onRemoveOperationFinished={async (index, stateUpdate) => {
                                    // await assetApi.removeTag(id, assetTags[index].id)
                                    // updateAssetState({
                                    //     tags: { $set: stateUpdate }
                                    // })
                                }}
                                onOperationFailedSkipped={() => setActiveDropdown('')}
                                isShare={false}
                                asyncCreateFn={(newItem) => {
                                    return { data: newItem }
                                }}
                                dropdownIsActive={activeDropdown === 'tags'}
                            />
                        </div>

                        <div className={detailPanelStyles['field-wrapper']} >
                            <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Comments</div>
                            <TextArea type={"textarea"} rows={4} placeholder={'Add comments'} value={tempComments}
                                   onChange={e => {setTempComments(e.target.value)}} styleType={'regular-short'} />
                        </div>

                        <Button className={styles['add-tag-btn']} type='button' text='Save changes' styleType='primary' onClick={onSaveSingleAsset} />


                    </div>
                </div>
            </div>
            <div className={styles["navigation-wrapper"]}>
                <span>{(selectedAsset || 0) + 1} of {assets.length} collection</span>
                <IconClickable src={Utilities.arrowPrev} onClick={() => {goPrev()}} />
                <IconClickable src={Utilities.arrowNext} onClick={() => {goNext()}} />
            </div>
        </Base>


        <Base
            modalIsOpen={showConfirmModal}
            closeModal={()=>{}}
            confirmText={""}
            headText={""}
            disabledConfirm={false}
            additionalClasses={['visible-block']}
            showCancel={false}
            confirmAction={() => {

            }} >
            <div className={styles['confirm-modal-wrapper']}>
                {!submitted && <>
                    <div className={styles['modal-field-title']}>Message for Admin</div>

                    <TextArea type={"textarea"} rows={4} placeholder={'Add message'} value={message}
                              onChange={e => {setMessage(e.target.value)}} styleType={'regular-short'} />

                    <div className={styles['modal-field-subtitle']}>Are you sure you want to submit your assets for approval?</div>
                </>}

                {submitted && <p className={styles['modal-field-title']}>
                    Thanks for submitting your  assets for approval.  The admin will be notified of your submission and
                    will be able to review it
                </p>}


                <div>
                    {!submitted && <>
                        <Button className={styles['keep-edit-btn']} type='button' text='Keep editting' styleType='secondary' onClick={()=>{setShowConfirmModal(false); setMessage("")}} />
                        <Button className={styles['add-tag-btn']} type='button' text='Submit' styleType='primary' onClick={submit} />
                    </>}
                    {submitted &&  <Button className={styles['add-tag-btn']}
                                           type='button' text='Back to Sparkfive'
                                           styleType='primary'
                                           onClick={()=>{
                                               setShowConfirmModal(false);Router.push("/main/upload-approvals")}
                                            }/>}

                </div>
            </div>
        </Base>

        <RenameModal
            closeModal={() => setShowRenameModal(false)}
            modalIsOpen={showRenameModal}
            renameConfirm={confirmAssetRename}
            type={"Asset"}
            initialValue={assets[selectedAsset]?.asset?.name?.substring(
                0,
                assets[selectedAsset]?.asset?.name.lastIndexOf(".")
            )}
        />

    </>
  )
}

export default UploadApproval
