import {useContext, useEffect, useState} from 'react'
import { AssetContext, SocketContext } from '../context'

import {convertTimeFromSeconds, getFolderKeyAndNewNameByFileName} from "../utils/upload"

import assetApi from '../server-api/asset'

import {validation} from "../constants/file-validation";

const loadingDefaultAsset = {
    asset: {
        name: 'placeholder',
        createdAt: new Date(),
        type: 'image'
    },
    isLoading: true
}

const loadingDefaultFolder = {
    name: 'placeholder',
    length: 10,
    assets: [],
    isLoading: true,
    createdAt: new Date()
}

export default ({ children }) => {
    const { socket, connected } = useContext(SocketContext);

    const [assets, setAssets] = useState([])
    const [folders, setFolders] = useState([])

    const [operationAsset, setOperationAsset] = useState(null)
    const [operationFolder, setOperationFolder] = useState('')

    const [activeOperation, setActiveOperation] = useState('')

    const [activeFolder, setActiveFolder] = useState('')
    const [activePageMode, setActivePageMode] = useState('')

    const [nextPage, setNextPage] = useState(1)
    const [totalAssets, setTotalAssets] = useState(0)

    const [needsFetch, setNeedsFetch] = useState('')

    const [loadingAssets, setLoadingAssets] = useState(false)

    const [addedIds, setAddedIds] = useState([])

    const [selectedAllAssets, setSelectedAllAssets] = useState(false)
    const [completedAssets, setCompletedAssets] = useState([])

    // Upload process
    const [uploadingAssets, setUploadingAssets] = useState([])
    const [uploadingStatus, setUploadingStatus] = useState("none") // Allowed value: "none", "uploading", "done"
    const [uploadingPercent, setUploadingPercent] = useState(0) // Percent of uploading process: 0 - 100
    const [uploadingFile, setUploadingFile] = useState<number>() // Current uploading file index
    const [uploadingFileName, setUploadingFileName] = useState<string>() // Current uploading file name, import feature need this
    const [uploadRemainingTime, setUploadRemainingTime] = useState<string>("") // Remaining time
    const [uploadDetailOverlay, setUploadDetailOverlay] = useState(false) // Detail overlay
    const [folderGroups, setFolderGroups] = useState() // This groups contain all folder key which is need to identity which folder file need to be saved to
    const [retryListCount, setRetryListCount] = useState(0)

    // For dropbox upload process
    const [uploadSourceType, setUploadSourceType] = useState() // This maybe local or dropbox
    const [dropboxUploadingFile, setDropboxUploadingFile] = useState() // Current dropbox uploading file index, this is received from server

    // Download process
    const [totalDownloadingAssets, setTotalDownloadingAssets] = useState(0)
    const [downloadingStatus, setDownloadingStatus] = useState("none") // Allowed value: "none", "zipping", "done", "error"
    const [downloadingPercent, setDownloadingPercent] = useState(0) // Percent of uploading process: 0 - 100
    const [downloadingError, setDownloadingError] = useState('') // Percent of uploading process: 0 - 100


    const setPlaceHolders = (type, replace = true) => {
        if (type === 'asset') {
            if (replace)
                setAssets(Array(10).fill(loadingDefaultAsset))
            else
                setAssets([...assets, ...Array(10).fill(loadingDefaultAsset)])
        } else {
            if (replace)
                setFolders(Array(10).fill(loadingDefaultFolder))
            else
                setFolders([...folders, ...Array(10).fill(loadingDefaultFolder)])
        }
    }

    const setAssetItems = (inputAssets, replace = true) => {
        const { results, next, total } = inputAssets
        if (results) inputAssets = results
        if (next) setNextPage(next)
        if (total) setTotalAssets(total)

        if (replace)
            setAssets(inputAssets)
        else
            setAssets([...assets.filter(asset => !asset.isLoading), ...inputAssets])
    }

    const setCompletedAssetItems = (inputAssets, replace = true) => {
        const { results, next, total } = inputAssets
        if (results) inputAssets = results

        if (replace)
            setCompletedAssets(inputAssets)
        else
            setCompletedAssets([...completedAssets.filter(asset => !asset.isLoading), ...inputAssets])
    }

    const setFolderItems = (inputFolders, replace = true, ignoreTotalItem = false) => {
        const { results, next, total } = inputFolders
        if (results) inputFolders = results
        if (next) setNextPage(next)
        if (total && !ignoreTotalItem) setTotalAssets(total)

        if (replace)
            setFolders(inputFolders)
        else
            setFolders([...folders.filter(folder => !folder.isLoading), ...inputFolders])
    }

    // Mark assets have been selected all even assets do not exist in pagination
    const selectAllAssets = (isSelectedAll = true) => {
        setSelectedAllAssets(isSelectedAll)
    }

    // Show upload process toast
    const showUploadProcess = (value: string, fileIndex?: number) => {
        // Set uploading file index
        if(fileIndex !== undefined){
            setUploadingFile(fileIndex)
        }

        // Update uploading status
        setUploadingStatus(value)

        // Reset all value
        if(fileIndex === 0){
            setUploadingPercent(0)
        }

    }

    // Set upload assets
    const setUploadingAssetItems = (inputAssets) => {
        setUploadingAssets(inputAssets)
    }

    const openUploadDetailOverlay = (show: boolean) => {
        setUploadDetailOverlay(show)
    }

    // Get params
    const getCreationParameters = (attachQuery?: any) => {
        let queryData: any = {}

        // Attach extra query
        if(attachQuery){
            queryData = {...queryData, ...attachQuery}
        }
        return queryData
    }

    // Upload asset
    const reUploadAsset  = async (i: number, assets: any, currentDataClone: any, totalSize: number, retryList: any[], folderId, folderGroup = {}) => {
        try{
            const formData = new FormData()
            let file = retryList[i].file.originalFile
            let newAssets = 0

            let currentUploadingFolderId = null

            // Get file group info, this returns folderKey and newName of file
            let fileGroupInfo = getFolderKeyAndNewNameByFileName(file.webkitRelativePath)

            // Do validation
            if(retryList[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE){
                // Violate validation, mark failure
                const updatedAssets = assets.map((asset, index)=> index === retryList[i].index ? {...asset, status: 'fail', index,  error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE} : asset);

                // Update uploading assets
                setUploadingAssets(updatedAssets)

                // The final one
                if(i === retryList.length - 1){
                    return
                }else{ // Keep going
                    await reUploadAsset(i+1, updatedAssets, currentDataClone, totalSize, retryList, folderId, folderGroup)
                }
            }

            if(i === 0){
                setRetryListCount(retryList.length)
            }

            // Show uploading toast
            showUploadProcess('re-uploading', i)

            // Set current upload file name
            setUploadingFileName(retryList[i].asset.name)

            // If user is uploading files in folder which is not saved from server yet
            if(fileGroupInfo.folderKey && !folderId){
                // Current folder Group have the key
                if(folderGroup[fileGroupInfo.folderKey]){
                    currentUploadingFolderId = folderGroup[fileGroupInfo.folderKey]
                    // Assign new file name without splash
                    file = new File([file.slice(0, file.size, file.type)],
                        fileGroupInfo.newName
                        , { type: file.type })
                }
            }

            // Append file to form data
            formData.append('asset', file)

            let size = totalSize;
            // Calculate the rest of size
            assets.map((asset)=>{
                // Exclude done assets
                if(asset.status === 'done' || asset.status === 'fail'){
                    size -= asset.asset.size
                    newAssets+=1
                }
            })

            const attachedQuery = {estimateTime: 1, size, totalSize}

            if(folderId){
                attachedQuery['folderId'] = folderId
            }

            // Uploading the new folder
            if(currentUploadingFolderId){
                attachedQuery['folderId'] = currentUploadingFolderId
            }

            // Call API to upload
            let { data } = await assetApi.uploadAssets(formData, getCreationParameters(
                attachedQuery))

            // If user is uploading files in folder which is not saved from server yet
            if(fileGroupInfo.folderKey && !folderId){
                /// If user is uploading new folder and this one still does not have folder Id, add it to folder group
                if(!folderGroup[fileGroupInfo.folderKey]){
                    folderGroup[fileGroupInfo.folderKey] = data[0].asset.folderId
                }
            }

            // Mark asset selected
            data = data.map((item) => {
                item.isSelected = true
                return item
            })

            assets[retryList[i].index] = data[0]


            // At this point, file place holder will be removed
            setAssets([...assets, ...currentDataClone])
            setAddedIds(data.map(assetItem => assetItem.asset.id))

            // Update total assets
            setTotalAssets(totalAssets + newAssets +1)

            // Mark this asset as done
            const updatedAssets = assets.map((asset, index)=> index === retryList[i].index ? {...asset, status: 'done'} : asset);

            setUploadingAssets(updatedAssets)

            // The final one
            if(i === retryList.length - 1){
                // Finish uploading process
                showUploadProcess('done')
            }else{ // Keep going
                await reUploadAsset(i+1, updatedAssets, currentDataClone, totalSize, retryList, folderId, folderGroup)
            }
        }catch (e){
            // Violate validation, mark failure
            const updatedAssets = assets.map((asset, index)=> index === retryList[i].index ? {...asset, index, status: 'fail', error: 'Processing file error'} : asset);

            // Update uploading assets
            setUploadingAssets(updatedAssets)

            // The final one
            if(i === retryList.length - 1){
                // Finish uploading process
                showUploadProcess('done')
            }else{ // Keep going
                await reUploadAsset(i+1, updatedAssets, currentDataClone, totalSize, retryList, folderId, folderGroup)
            }
        }
    }

    const updateUploadingFileName = (name: string) => {
        setUploadingFileName(name)
    }

    const updateFolderGroups = (value) => {
        setFolderGroups(value)
    }

    const updateUploadSourceType = (value) => {
        setUploadSourceType(value)
    }

    const updateTotalAssets = (value: number) => {
        setTotalAssets(value)
    }

    const updateDownloadingStatus = (status, percent, totalDownloadingAssets, error) => {
        if(status){
            setDownloadingStatus(status)
        }

        if(!isNaN(percent)){
            setDownloadingPercent(percent)
        }

        if(!isNaN(totalDownloadingAssets)){
            setTotalDownloadingAssets(totalDownloadingAssets)
        }

        if(error){
            setDownloadingError(error)
        }
    }

    // Init socket listener
    useEffect(()=>{
        // Socket is available and connected
        if(socket && connected){
            console.log(`Register socket listener...`)
            // Listen upload file process event
            socket.on('uploadFilesProgress', function(data){
                console.log(data)
                setUploadingPercent(data.percent)
                setUploadRemainingTime(`${convertTimeFromSeconds(data.timeLeft)} remaining`)

                // setUploadingFileName("Test.png")
                if(data.fileName){
                    setUploadingFileName(data.fileName)
                }

                // setUploadingFile(0)
                if(!isNaN(data.uploadingAssets)){
                    setDropboxUploadingFile(data.uploadingAssets)
                }
            })

            socket.on('downloadFilesProgress', function(data){
                console.log(data)
                setDownloadingPercent(data.percent)
            })
        }
    },[socket, connected])

    const assetsValue = {
        assets,
        setAssets: setAssetItems,
        completedAssets,
        setCompletedAssets: setCompletedAssetItems,
        nextPage,
        totalAssets,
        folders,
        setFolders: setFolderItems,
        setPlaceHolders,
        activeOperation,
        setActiveOperation,
        operationAsset,
        setOperationAsset,
        operationFolder,
        setOperationFolder,
        activeFolder,
        setActiveFolder,
        activePageMode,
        setActivePageMode,
        needsFetch,
        setNeedsFetch,
        addedIds,
        setAddedIds,
        loadingAssets,
        setLoadingAssets,
        selectedAllAssets,
        selectAllAssets,
        uploadingStatus,
        showUploadProcess,
        uploadingFile,
        uploadRemainingTime,
        uploadingPercent,
        uploadingAssets,
        setUploadingAssets: setUploadingAssetItems,
        uploadDetailOverlay,
        setUploadDetailOverlay: openUploadDetailOverlay,
        reUploadAsset,
        uploadingFileName,
        setUploadingFileName: updateUploadingFileName,
        folderGroups,
        setFolderGroups: updateFolderGroups,
        setUploadSourceType: updateUploadSourceType,
        dropboxUploadingFile,
        uploadSourceType,
        setTotalAssets: updateTotalAssets,
        downloadingStatus,
        downloadingPercent,
        totalDownloadingAssets,
        downloadingError,
        updateDownloadingStatus,
        retryListCount


    }
    return (
        <AssetContext.Provider value={assetsValue}>
            {children}
        </AssetContext.Provider>
    )
}
