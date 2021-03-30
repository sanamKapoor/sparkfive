import {useContext, useEffect, useState} from 'react'
import { AssetContext, SocketContext } from '../context'

import { convertTimeFromSeconds } from "../utils/upload"

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
    const { socket } = useContext(SocketContext);

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
    const [uploadRemainingTime, setUploadRemainingTime] = useState<string>(convertTimeFromSeconds(0)) // Remaining time

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

    const setFolderItems = (inputFolders, replace = true) => {
        const { results, next, total } = inputFolders
        if (results) inputFolders = results
        if (next) setNextPage(next)
        if (total) setTotalAssets(total)

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
        setUploadingPercent(0)
        setUploadRemainingTime(convertTimeFromSeconds(0))
    }

    // Set upload assets
    const setUploadingAssetItems = (inputAssets) => {
        setUploadingAssets(inputAssets)
    }

    // Init socket listener
    useEffect(()=>{
        if(socket){
            console.log(`Register listener...`)
            // Listen upload file process event
            socket.on('uploadFilesProgress', function(data){
                console.log(`uploadFilesProgress...`)
                console.log(data)
                setUploadingPercent(data.percent)
                setUploadRemainingTime(convertTimeFromSeconds(data.timeLeft))
            })
        }
    },[socket])

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

    }
    return (
        <AssetContext.Provider value={assetsValue}>
            {children}
        </AssetContext.Provider>
    )
}
