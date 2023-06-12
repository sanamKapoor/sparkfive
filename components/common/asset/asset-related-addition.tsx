import React, {useContext, useEffect, useRef, useState} from "react";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import _ from 'lodash'

import IconClickable from '../buttons/icon-clickable'
import styles from './asset-addition.module.css'

import "react-sweet-progress/lib/style.css";
import AssetUpload from "./asset-upload";
import {  Assets, AssetOps } from '../../../assets'
import toastUtils from '../../../utils/toast'

import assetApi from '../../../server-api/asset'

import { UserContext, AssetContext } from '../../../context'
import {getFolderKeyAndNewNameByFileName} from "../../../utils/upload";
import {validation} from "../../../constants/file-validation";
import DriveSelector from "./drive-selector";
import cookiesUtils from '../../../utils/cookies'
import AssetDuplicateModal from "./asset-duplicate-modal";
import AssetRelatedFilesSearch from "./asset-related-files-search";

import SimpleButton from '../buttons/simple-button'

import { maximumAssociateFiles} from "../../../constants/asset-associate";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import { ASSET_UPLOAD_APPROVAL } from "../../../constants/permissions";

export default function AssetRelatedAddition({ assets: assetData  = [], associateFileId, onUploadFinish = (assets) => {}, currentRelatedAssets = [], displayMode='dropdown'}){

    const { advancedConfig, hasPermission } = useContext(UserContext)
    const { uploadingPercent, setUploadingPercent } = useContext(AssetContext)

    const fileBrowserRef = useRef(undefined)

    const [assets, setAssets] = useState(assetData)
    const [uploading, setUploading] = useState(false)
    const [uploadingIndex, setUploadingIndex] = useState(0)

    // Duplicated upload handle variables
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [duplicateAssets, setDuplicateAssets] = useState([]);
    const [uploadFrom, setUploadFrom] = useState('');

    const getCreationParameters = (attachQuery?: any) => {
        let queryData: any = {associateFile: associateFileId}

        let uploadToFolders = []

        queryData.folderId = uploadToFolders.join(",")
        // Attach extra query
        if(attachQuery){
            queryData = {...queryData, ...attachQuery}
        }
        return queryData
    }

    const setUploadUpdate = (updatedAssets) => {
        setAssets(updatedAssets)
        onUploadFinish(updatedAssets)
    }

    // Upload asset
    const uploadAsset  = async (i: number, assets: any, currentDataClone: any, totalSize: number, folderId, folderGroup = {}, subFolderAutoTag = true) => {
        let folderUploadInfo
        try{
            setUploadingIndex(i)
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


                // Remove current asset from asset placeholder
                // let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


                // The final one
                if (i === assets.length - 1) {
                    return folderGroup
                } else { // Keep going
                    await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
                }
            } else {
                // Show uploading toast
                // showUploadProcess('uploading', i)

                // Set current upload file name
                // setUploadingFileName(assets[i].asset.name)


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

                let attachedQuery = {estimateTime: 1, size, totalSize}


                // Uploading inside specific folders which already existed in server
                if(folderId){
                    attachedQuery['folderId'] = folderId
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

                // Call API to upload
                let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery))

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
                // updateAssetList(assets, currentDataClone, folderUploadInfo)

                // setAddedIds(data.map(assetItem => assetItem.asset.id))

                // Update total assets
                // setTotalAssets(totalAssets + newAssets +1)

                // Mark this asset as done
                const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, status: 'done'} : asset);

                // Update uploading assets
                setUploadUpdate(updatedAssets)

                // The final one
                if(i === assets.length - 1){
                    return
                } else { // Keep going
                    await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
                }
            }
        } catch (e){
            // Violate validation, mark failure
            const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, index, status: 'fail', error: 'Processing file error'} : asset);

            // Update uploading assets
            setUploadUpdate(updatedAssets)

            // Remove current asset from asset placeholder
            // let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


            // At this point, file place holder will be removed
            // updateAssetList(newAssetPlaceholder, currentDataClone, folderUploadInfo)


            // The final one
            if (i === assets.length - 1) {
                return folderGroup
            } else { // Keep going
                await uploadAsset(i+1, updatedAssets, currentDataClone, totalSize, folderId, folderGroup, subFolderAutoTag)
            }
        }
    }

    // Upload asset
    const reUpload  = async (i: number, assets: any, currentDataClone: any, totalSize: number, folderId, folderGroup = {}, subFolderAutoTag = true) => {
        let folderUploadInfo
        try{
            setUploadingIndex(i)
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
                setUploadUpdate(updatedAssets)


                return folderGroup
            } else {
                // Show uploading toast
                // showUploadProcess('uploading', i)

                // Set current upload file name
                // setUploadingFileName(assets[i].asset.name)


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

                let attachedQuery = {estimateTime: 1, size, totalSize}


                // Uploading inside specific folders which already existed in server
                if(folderId){
                    attachedQuery['folderId'] = folderId
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

                // Call API to upload
                let { data } = await assetApi.uploadAssets(formData, getCreationParameters(attachedQuery))

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
                // updateAssetList(assets, currentDataClone, folderUploadInfo)

                // setAddedIds(data.map(assetItem => assetItem.asset.id))

                // Update total assets
                // setTotalAssets(totalAssets + newAssets +1)

                // Mark this asset as done
                const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, status: 'done'} : asset);

                // Update uploading assets
                setUploadUpdate(updatedAssets)

                return
            }
        } catch (e){
            // Violate validation, mark failure
            const updatedAssets = assets.map((asset, index)=> index === i ? {...asset, index, status: 'fail', error: 'Processing file error'} : asset);

            // Update uploading assets
            setUploadUpdate(updatedAssets)

            // Remove current asset from asset placeholder
            // let newAssetPlaceholder = updatedAssets.filter(asset => asset.status !== 'fail')


            // At this point, file place holder will be removed
            // updateAssetList(newAssetPlaceholder, currentDataClone, folderUploadInfo)


            return folderGroup
        }
    }

    const onFilesDataGet = async (files) => {
        if(maximumAssociateFiles - currentRelatedAssets.length >= files.length){
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
                // setUploadingAssets(newPlaceholders)

                // Showing assets = uploading assets + existing assets
                setAssets([...newPlaceholders, ...currentDataClone])

                console.log([...newPlaceholders, ...currentDataClone])


                // Get team advance configurations first
                const { subFolderAutoTag } =  advancedConfig;

                setUploading(true)

                // Start to upload assets

                await uploadAsset(0, newPlaceholders, currentDataClone, totalSize, undefined, undefined, subFolderAutoTag)

                setUploadingPercent(0)

                // Finish uploading process
                // showUploadProcess('done')

            } catch (err) {
                // Finish uploading process
                // showUploadProcess('done')

                setAssets(currentDataClone)
                console.log(err)
                if (err.response?.status === 402) toastUtils.error(err.response.data.message)
                else toastUtils.error('Could not upload assets, please try again later.')
            }
        }else{
            toastUtils.error(`You already reached the maximum ${maximumAssociateFiles} associated files`)
        }
    }

    const reuploadAsset = async (index) => {
        // Get team advance configurations first
        const { subFolderAutoTag } =  advancedConfig;
        const updatedAssets = [...assets]
        updatedAssets[index].status === "queued";

        // Make this asset as queue
        setAssets(updatedAssets)

        await reUpload(index, updatedAssets, updatedAssets, assets[index].size, undefined, undefined, subFolderAutoTag)
    }

    const onFileChange = async (e) => {
        const files = Array.from(e.target.files).map(originalFile => ({ originalFile }))
        if (advancedConfig.duplicateCheck) {
            const names = files.map(file => file.originalFile['name'])
            const {data: { duplicateAssets }} = await assetApi.checkDuplicates(names)
            if (duplicateAssets.length) {
                setSelectedFiles(files)
                setDuplicateAssets(duplicateAssets)
                setDuplicateModalOpen(true)
                setUploadFrom('browser')
                if (fileBrowserRef.current.value) {
                    fileBrowserRef.current.value = ''
                }
            } else {
                onFilesDataGet(files)
            }
        } else {
            onFilesDataGet(files)
        }
    }


    const onGdriveFilesGet = async (files) => {
        if(maximumAssociateFiles - currentRelatedAssets.length >= files.length){
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
                        status: 'queued',
                        isUploading: true
                    })
                })

                setAssets([...newPlaceholders, ...currentDataClone])

                setUploading(true)


                // setUploadSourceType('dropbox')

                // Check if there is 1 folder in upload links
                // const containFolderUrl = files.filter(file => file.type === 'folder')

                // setFolderImport(containFolderUrl.length > 0)

                const { data } = await assetApi.importAssets('drive', files.map(file => ({
                    googleAuthToken,
                    id: file.id,
                    name: file.name,
                    size: file.sizeBytes,
                    mimeType: file.mimeType,
                    type: file.type,
                    versionGroup: file.versionGroup,
                    changedName: file.changedName
                })), getCreationParameters({estimateTime: 1, totalSize}))

                setUploadingPercent(0)


                // Mark done
                const updatedAssets = data.map(asset => { return {...asset, status: 'done'}});

                // Update uploading assets
                setUploadUpdate(updatedAssets)

                // toastUtils.success('Assets imported.')
            } catch (err) {
                setAssets(currentDataClone)

                console.log(err)
                if (err.response?.status === 402) toastUtils.error(err.response.data.message)
                else toastUtils.error('Could not import assets, please try again later.')
            }
        }else{
            toastUtils.error(`You already reached the maximum ${maximumAssociateFiles} associated files`)
        }
    }

    const onDropboxFilesGet = async (files) => {
        if(maximumAssociateFiles - currentRelatedAssets.length >= files.length){
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
                        status: 'queued',
                        isUploading: true
                    })
                })

                setAssets([...newPlaceholders, ...currentDataClone])

                setUploading(true)


                const { data } = await assetApi.importAssets('dropbox', files.map(file => ({
                        link: file.link,
                        isDir: file.isDir,
                        name: file.name,
                        size: file.bytes,
                        versionGroup: (file.versionGroup),
                        changedName: file.changedName
                    })),
                    getCreationParameters({estimateTime: 1, totalSize}))


                // Mark done
                const updatedAssets = data.map(asset => { return {...asset, status: 'done'}});

                // Update uploading assets
                setUploadUpdate(updatedAssets)

            } catch (err) {
                setAssets(currentDataClone)

                setAssets(currentDataClone)
                console.log(err)
                if (err.response?.status === 402) toastUtils.error(err.response.data.message)
                else toastUtils.error('Could not import assets, please try again later.')
            }
        }else{
            toastUtils.error(`You already reached the maximum ${maximumAssociateFiles} associated files`)
        }
    }

    const onDriveFilesSelection = async (files) => {
        onGdriveFilesGet(files)
    }

    const onDropboxFilesSelection = async (files) => {
        onDropboxFilesGet(files)
    }

    const openDropboxSelector = () => {
        const options = {
            success: onDropboxFilesSelection,
            linkType: 'preview',
            multiselect: true,
            folderselect: true,
            sizeLimit: 1000 * 1024 * 1024 * 2
        }
        // Ignore this annoying warning
        Dropbox.choose(options)
    }

    const onConfirmDuplicates = (nameHistories) => {
        setDuplicateModalOpen(false)
        let files = [...selectedFiles]
        if (uploadFrom === 'browser') {
            files = files.map(file => {
                file.name = file.originalFile.name
                return file
            })
        }
        const mappedDuplicates = _.keyBy(duplicateAssets, 'name')

        // eliminate canceled
        files = files.filter(file => {
            const cancelledItem = nameHistories.find(item => item.oldName === file.name && item.action === 'cancel')
            return !cancelledItem
        })

        files = files.map(file => {
            const handledItem = nameHistories.find(histItem => histItem.oldName === file.name)
            if (handledItem) {
                if (handledItem.action === 'change') {
                    file.changedName = handledItem.newName
                }
                if (handledItem.action === 'current') {
                    file.versionGroup = mappedDuplicates[file.name].versionGroup
                }
            }
            return file
        })

        if (files.length) {
            switch (uploadFrom) {
                case 'browser':
                    onFilesDataGet(files)
                    break;
                case 'dropbox':
                    onDropboxFilesGet(files)
                    break;
                case 'gdrive':
                    onGdriveFilesGet(files)
                    break;
            }

        }
    }


	let dropdownOptions = [
		{
			id: 'file',
			label: 'Upload From Computer',
			text: 'png, jpg, mp4 and more',
			onClick: () => fileBrowserRef.current.click(),
			icon: AssetOps.newCollection
		},
		{
			id: 'dropbox',
			label: 'Upload from Dropbox',
			text: 'Import files',
			onClick: openDropboxSelector,
			icon: Assets.dropbox
		},
		{
			id: 'gdrive',
			label: 'Upload from Drive',
			text: 'Import files',
			onClick: () => { },
			icon: Assets.gdrive,
		}
	]


	const SimpleButtonWrapper = ({ children }) => (
		<div className={`${styles['button-wrapper']} asset-addition`}>
			{/* {hasPermission([ASSET_UPLOAD_APPROVAL]) && <span className={styles['approval-text']}>Upload for approval</span>} */}
			{!hasPermission([ASSET_UPLOAD_APPROVAL]) && <SimpleButton text='+' />}
			{children}
		</div>
	)

	const DropDownOptions = () => {

		const Content = (option) => {
			return (
				<span className={styles.option}
					onClick={option.onClick}>
					<IconClickable src={option.icon} additionalClass={styles.icon} />
					<div className={styles['option-label']}>{option.label}</div>
				</span>
			)
		}

		return (
			<ul className={`${styles['options-list']} ${styles[displayMode]}`}>
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


		return <>
		<input multiple={true} id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
			onChange={onFileChange} />
			<ToggleableAbsoluteWrapper
					Wrapper={SimpleButtonWrapper}
					Content={DropDownOptions}
					uploadApproval={true}
				/>
		{duplicateAssets?.length > 0 &&
		<AssetDuplicateModal
			duplicateNames={duplicateAssets.map(asset => asset.name)}
			modalIsOpen={duplicateModalOpen}
			closeModal={() => setDuplicateModalOpen(false)}
			confirmAction={onConfirmDuplicates}
		/>
		}
	</>
}
