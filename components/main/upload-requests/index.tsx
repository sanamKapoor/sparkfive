import React, { useState, useEffect, useContext, useRef } from 'react'
import moment from "moment";
import _ from "lodash"
import update from "immutability-helper";
import clsx from "clsx";

// Components
import AssetSubheader from '../../common/asset/asset-subheader'
import IconClickable from "../../common/buttons/icon-clickable";
import Base from '../../common/modals/base'
import AssetThumbail from "../../common/asset/asset-thumbail";
import RenameModal from "../../common/modals/rename-modal";
import AssetImg from "../../common/asset/asset-img";
import Input from "../../common/inputs/input";
import ConfirmModal from "../../common/modals/confirm-modal";
import Select from "../../common/inputs/select";
import CustomFieldSelector from "../../common/items/custom-field-selector";

// Styles
import styles from './index.module.css'
import assetGridStyles from "../../common/asset/asset-grid.module.css";
import detailPanelStyles from "../../common/asset/detail-side-panel.module.css";

// Contexts
import { UserContext, AssetContext, LoadingContext } from '../../../context'

// Utils
import ListItem from "../../common/asset/request-list-item";
import Button from "../../common/buttons/button";
import CreatableSelect from "../../common/inputs/creatable-select";
import TextArea from "../../common/inputs/text-area";
import { Utilities } from '../../../assets'
import toastUtils from '../../../utils/toast'

// APIs
import uploadApprovalApi from '../../../server-api/upload-approvals'
import tagApi from '../../../server-api/tag'
import approvalApi from '../../../server-api/upload-approvals'
import assetApi from '../../../server-api/asset'
import customFieldsApi from '../../../server-api/attribute'
import campaignApi from '../../../server-api/campaign'


// Hooks
import {useDebounce} from "../../../hooks/useDebounce";
import AssetPdf from "../../common/asset/asset-pdf";
import AssetIcon from "../../common/asset/asset-icon";


const filterOptions = [
    {
        label: "Approved",
        value: 2
    },
    {
        label: "Pending",
        value: 0
    },
    {
        label: "Rejected",
        value: -1
    },
]

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
    let rs = []
    list.map((field)=>{
        let value = valueList.filter(valueField => valueField.id === field.id)

        if(value.length > 0){
            rs.push(value[0])
        }else{
            let customField = { ...field }
            customField.values = []
            rs.push(customField)
        }
    })

    return rs
}

const UploadRequest = () => {

    const { user } = useContext(UserContext)

    const {
    } = useContext(AssetContext)

    const { setIsLoading } = useContext(LoadingContext);

    const [approvals, setApprovals] = useState( [])

    const [mode, setMode] = useState("list") // Available options: list, view

    const [assets, setAssets] = useState([])
    const [selectedAssets, setSelectedAssets] = useState([])

    const [activeDropdown, setActiveDropdown] = useState('')
    const [inputTags, setInputTags] = useState([])
    const [assetTags, setTags] = useState([])

    const [showRenameModal, setShowRenameModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [showDetailModal, setDetailModal] = useState(false)
    const [selectedAsset, setSelectedAsset] = useState()

    const [tempTags, setTempTags] = useState([]) // For update tag in each asset
    const [tempCustoms, setTempCustoms] = useState([]) // For update custom in each asset
    const [tempComments, setTempComments] = useState("") // For update tag in each asset

    const [currentApproval, setCurrentApproval] = useState()
    const [comments, setComments] = useState("")
    const [message, setMessage] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [approvalId, setApprovalId] = useState() // Keep this to submit things related to current selected Approval
    const [currentViewStatus, setCurrentViewStatus] = useState(0) // 0: Pending, 1: Submitted, 2: Completed, -1: Rejected

    const [needRefresh, setNeedRefresh] = useState(false) // To check if need to refresh the list or not, used after saving tag/comments

    const [batchName, setBatchName] = useState("")

    const [selectedAllAssets, setSelectedAllAssets] = useState(false)
    const [selectedAllApprovals, setSelectedAllApprovals] = useState(false)

    const [showApproveConfirm, setShowApproveConfirm] = useState(false)
    const [showRejectConfirm, setShowRejectConfirm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [tempAssets, setTempAssets] = useState([])
    const [tempApprovals, setTempApprovals] = useState([])
    const [tempCampaigns, setTempCampaigns] = useState([])

    const [filter, setFilter] = useState()
    const [approvalIndex, setApprovalIndex]  = useState()

    // Custom fields
    const [customs, setCustoms] = useState([])
    const [activeCustomField, setActiveCustomField] = useState<number>()
    const [inputCustomFields, setInputCustomFields] = useState([])
    const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, customs))


    // Campaigns
    const [inputCampaigns, setInputCampaigns] = useState([])
    const [assetCampaigns, setCampaigns] = useState([])

    const debouncedBatchName = useDebounce(batchName, 500);

    const updateName = async (value) => {
        if(approvalId){
            await approvalApi.update(approvalId, { name: value})

            // @ts-ignore
            let currentApprovalData = {...currentApproval}
            currentApprovalData.name = value;

            setCurrentApproval(currentApprovalData)

            setNeedRefresh(true)

            // let approvalList = [...approvals]
            // approvalList.map((item)=>{
            //     if(item.id === approvalId){
            //         item.name = value
            //     }
            // })
            //
            // setApprovals(approvalList)

            // toastUtils.success("Name is saved successfully")
        }
    }

    const toggleSelected = (index) => {
        let approvalList = [...approvals]
        approvalList.map((item, itemIndex)=>{
          if(itemIndex === index){
              item.isSelected = !item.isSelected
          }
        })

        setApprovals(approvalList)
    }

    const fetchApprovals = async () => {
        setIsLoading(true)
       const { data } =  await uploadApprovalApi.getUploadApprovals()
        setApprovals(data)
        setIsLoading(false)
    }

    // On view approval requests
    const onView = (index) => {
        setAssets(approvals[index] ? approvals[index].assets : [])
        setMode("view")
        setApprovalId(approvals[index].id)
        setCurrentViewStatus(approvals[index]?.status)
        setCurrentApproval(approvals[index])
        setBatchName(approvals[index].name || "")
        setApprovalIndex(index)
    }


    const onCancelView = (refresh = false) => {
        setShowConfirmModal(false)
        setSubmitted(false)
        setAssets([])
        setMode("list")
        setApprovalId(undefined)
        setCurrentViewStatus(0)
        setNeedRefresh(false)
        setBatchName("")
        setSelectedAllAssets(false)
        setTempAssets([])
        setApprovalIndex(undefined)
        setTempCustoms([])
        setTempCampaigns([])

        if(refresh === true || needRefresh){
            fetchApprovals();
        }

    }

    const onViewAsset = (index) => {
        setSelectedAsset(index)
        setDetailModal(true)

        // @ts-ignore
        setTempTags(assets[index]?.asset?.tags || [])

        // @ts-ignore
        setTempCustoms( mappingCustomFieldData(inputCustomFields, assets[index]?.asset?.customs || []))

        // @ts-ignore
        setTempCampaigns( assets[index]?.asset?.campaigns || [])

        // @ts-ignore
        setTempComments(assets[index]?.asset?.comments || "")
    }

    const goNext = () => {
        if((selectedAsset || 0) < assets.length-1){
            setTempTags([])
            setTempCustoms([])
            setTempComments("")

            const next = (selectedAsset || 0) + 1
            // @ts-ignore
            setSelectedAsset(next)

            // @ts-ignore
            setTempTags(assets[next]?.asset?.tags || [])
            // @ts-ignore
            setTempCustoms(assets[next]?.asset?.customs || [])
            // @ts-ignore
            setTempComments(assets[next]?.asset?.comments || "")

            // @ts-ignore
            setSelectedAsset(next)
        }
    }

    const goPrev = () => {
        if((selectedAsset || 0) > 0){
            setTempTags([])
            setTempCustoms([])
            setTempComments("")

            const next = (selectedAsset || 0) -1
            // @ts-ignore
            setSelectedAsset(next)

            // @ts-ignore
            setTempTags(assets[next]?.asset?.tags || [])
            // @ts-ignore
            setTempCustoms(assets[next]?.asset?.customs || [])
            // @ts-ignore
            setTempComments(assets[next]?.asset?.comments || "")

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

                for(const { asset } of assetArr){
                    let tagPromises = []
                    let removeTagPromises = []

                    // Find the new tags
                    // @ts-ignore
                    const newTags = _.differenceBy(tempTags, assets[selectedAsset]?.asset?.tags || [])
                    const removeTags = _.differenceBy(assets[selectedAsset]?.asset?.tags || [], tempTags)

                    for( const tag of newTags){
                        tagPromises.push(assetApi.addTag(asset.id, tag))

                    }

                    for( const tag of removeTags){
                        removeTagPromises.push(assetApi.removeTag(asset.id, tag.id))

                    }

                    await Promise.all(tagPromises)
                    await Promise.all(removeTagPromises)
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
            assetArrData[selectedAsset].asset.tags = tempTags
            // @ts-ignore
            assetArrData[selectedAsset].asset.comments = tempComments

            setIsLoading(false);

            setNeedRefresh(true)

            toastUtils.success(`Save successfully`)
        }

    }

    // Save bulk tag from right pannel
    const saveBulkTag = async () => {
        setIsLoading(true)

        for(const { asset, isSelected } of assets){
            let tagPromises = []
            let removeTagPromises = []

            let campaignPromises = []
            let removeCampaignPromises = []

            if(isSelected){
                const newTags = _.differenceBy(assetTags, asset?.tags || [])
                const newCampaigns = _.differenceBy(assetCampaigns, asset?.campaigns || [])

                // Online admin can add custom fields
                if(isAdmin()){
                    for (const customField of assetCustomFields){
                        // Find corresponding custom field in asset
                        const assetField = asset.customs.filter((custom)=>custom.id === customField.id)
                        const oldCustoms = assetField[0]?.values || []

                        const newCustoms = _.differenceBy(customField.values, oldCustoms || [])

                        const customPromises = []

                        for( const custom of newCustoms){
                            customPromises.push(assetApi.addCustomFields(asset.id, custom))
                        }

                        await Promise.all(customPromises)

                    }
                }

                // Save bulk by admin wont override any tag, it will add extra tags
                const removeTags = isAdmin() ? [] : _.differenceBy(asset?.tags || [], assetTags)

                // Save bulk by admin wont override any capaign, it will add extra campaigns
                const removeCampaigns = isAdmin() ? [] : _.differenceBy(asset?.campaigns || [], assetCampaigns)

                for( const tag of removeTags){
                    removeTagPromises.push(assetApi.removeTag(asset.id, tag.id))
                }

                for( const tag of newTags){
                    tagPromises.push(assetApi.addTag(asset.id, tag))
                }

                // Only admin can modify campaign
                if(isAdmin()){
                    for( const campaign of removeCampaigns){
                        removeCampaignPromises.push(assetApi.removeCampaign(asset.id, campaign.id))
                    }

                    for( const campaign of newCampaigns){
                        campaignPromises.push( assetApi.addCampaign(asset.id, campaign))
                    }
                }

            }

            await Promise.all(tagPromises)
            await Promise.all(removeTagPromises)

            // Only admin can modify campaign
            if(isAdmin()){
                await Promise.all(campaignPromises)
                await Promise.all(removeCampaignPromises)
            }

        }

        // Save tags to asset
        let assetArr = [...assets];
        assetArr.map((asset)=>{
            if(asset.isSelected){
                // Admin update does not override the tags
                if(isAdmin()){
                    const newTags = _.differenceBy(assetTags, asset.asset.tags || [])
                    asset.asset.tags = asset.asset.tags.concat(newTags)

                    const newCampaigns = _.differenceBy(assetCampaigns, asset.asset.campaigns || [])
                    asset.asset.campaigns = asset.asset.campaigns.concat(newCampaigns)
                }else{
                    asset.asset.tags = assetTags
                }

            }
        })


        toastUtils.success(`Save successfully`)

        // Reset tags
        setTags([])

        setNeedRefresh(true)

        setIsLoading(false)
    }

    // Save comment  from right panel
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
                asset.asset.comments = comments
            }
        })

        setAssets(assetArr)

        toastUtils.success(`Save successfully`)

        // Reset comments
        setComments("")

        setNeedRefresh(true)

        setIsLoading(false)
    }

    const submit = async () => {
        setIsLoading(true)
        await approvalApi.submit(approvalId, { message, name: batchName })

        setSubmitted(true)

        toastUtils.success(`Save successfully`)

        setNeedRefresh(true)

        setIsLoading(false)
    }

    const getTagsInputData = async () => {
        try {
            const tagsResponse = await tagApi.getTags()
            setInputTags(tagsResponse.data)
        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    const getCustomFieldsInputData = async () => {
        try {
            const { data } = await customFieldsApi.getCustomFields({isAll: 1, sort: 'createdAt,asc'})

            setInputCustomFields(data)

        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    const getCampaignsInputData = async () => {
        try {
            const { data } = await campaignApi.getCampaigns()

            setInputCampaigns(data)

        } catch (err) {
            // TODO: Maybe show error?
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

            // TODO: Update assets

            // Update asset list
            let currentAssets = [...assets]
            // @ts-ignore
            currentAssets[selectedAsset].asset.name = newValue
            setAssets(currentAssets)


            setNeedRefresh(true)


            setIsLoading(false)


            toastUtils.success("Asset name updated");
        } catch (err) {
            // console.log(err);
            toastUtils.error("Could not update asset name");
        }
    };

    // Check if there is any asset is selected
    const hasSelectedAssets = () => {
        if(selectedAllAssets){
            return true
        }

        const selectedArr = assets.filter((asset)=>asset.isSelected)

        return selectedArr.length > 0
    }

    // Select all assets
    const selectAllAssets = (value = true) => {
        setSelectedAllAssets(value)
        let assetList = [...assets]
        assetList.map((asset)=>{
            asset.isSelected = value
        })

        setAssets(assetList)

        // Reset temp assets
        if(value === false){
            setTempAssets([])
        }

    }

    // Toggle select assets
    const toggleSelectedAsset = (id) => {
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

    // Check if there is any approval is selected
    const hasSelectedApprovals = () => {
        if(selectedAllApprovals){
            return true
        }

        const selectedArr = approvals.filter((approval)=>approval.isSelected)

        return selectedArr.length > 0
    }

    // Select all approvals
    const selectAllApprovals = (value = true) => {
        setSelectedAllApprovals(value)
        let approvalList = [...approvals]
        approvalList.map((approval)=>{
            approval.isSelected = value
        })

        setApprovals(approvalList)

        // Reset temp assets
        if(value === false){
            setTempApprovals([])
        }

    }

    // Toggle select approval
    const toggleSelectedApproval = (id) => {
        const approvalIndex = approvals.findIndex(approvalItem => approvalItem.id === id)
        const selectedValue = !approvals[approvalIndex].isSelected
        // Toggle unselect when selected all will disable selected all
        if(!selectedValue && selectedAllApprovals){
            setSelectedAllApprovals(false)
        }
        setApprovals(update(approvals, {
            [approvalIndex]: {
                isSelected: { $set: !approvals[approvalIndex].isSelected }
            }
        }))
    }

    const TagWrapper = ({status}) => {
        const getStatusName = (status) => {
            switch (status){
                case -1: {
                    return "Rejected"
                }

                case 0: {
                    return "Pending"
                }

                case 1: {
                    return "Pending"
                }

                case 2: {
                    return "Approved"
                }

                default: {
                    return "Pending"
                }

            }
        }
        return <div className={clsx(styles['tag-wrapper'],
            {[styles['green']]: status === 2,
                [styles["yellow"]]: status === 0,
                [styles['red']]: status === -1})
        }>
            <span>{getStatusName(status)}</span>
        </div>
    }

    const hasBothTagAndComments = (asset) => {
        return asset.tags.length > 0 && asset.comments
    }

    const hasTagOrComments = (asset) => {
        return asset.tags.length > 0 || asset.comments
    }

    const isAdmin = () => {
        return user.role.id === "admin" || user.role.id === "super_admin"
    }

    const updateAssetTagsState = (updatedTags) => {
        setIsLoading(false);


        // Update these tag and comments to asset
        let assetArrData = [...assets]
        // @ts-ignore
        assetArrData[selectedAsset].asset.tags = updatedTags

        setAssets(assetArrData)

        setNeedRefresh(true)

        toastUtils.success("Update tag successfully")
    }

    const updateAssetState = (updatedData) => {
        setIsLoading(false);

        // @ts-ignore
        if (selectedAsset >= 0) {
            // @ts-ignore
            setAssets(update(assets, {[selectedAsset]: {asset: updatedData}
            }))
        }

        setActiveDropdown('')

        setNeedRefresh(true)

        toastUtils.success("Update custom fields successfully")
    }

    const approve = async(approvalId, assetIds) => {
        setIsLoading(true)

        await approvalApi.approve(approvalId, { assetIds })

        // Update status to assets list
        let assetArrData = [...assets]
        // @ts-ignore
        assetArrData.map((asset)=>{
            if(assetIds.includes(asset.asset.id)){
                asset.asset.status = 2
            }
        })

        setAssets(assetArrData)

        setNeedRefresh(true)

        setIsLoading(false)

        setDetailModal(false)

        toastUtils.success("Approve asset successfully")
    }

    const bulkApprove = async(approvalIds) => {
        setIsLoading(true)

        await approvalApi.bulkApprove({approvalIds})

        // Update status to approval list
        let approvalArrData = [...approvals]
        // @ts-ignore
        approvalArrData.map((approval)=>{
            if(approvalIds.includes(approval.id)){
                approval.status = 2
            }
        })

        setApprovals(approvalArrData)

        setIsLoading(false)

        setDetailModal(false)

        toastUtils.success("Approve asset successfully")
    }

    const reject = async(approvalId, assetIds) => {
        setIsLoading(true)

        await approvalApi.reject(approvalId, { assetIds })

        // Update status to assets list
        let assetArrData = [...assets]
        // @ts-ignore
        assetArrData.map((asset)=>{
            if(assetIds.includes(asset.asset.id)){
                asset.asset.status = -1
            }
        })

        setAssets(assetArrData)

        setNeedRefresh(true)

        setIsLoading(false)

        setDetailModal(false)

        toastUtils.success("Reject assets successfully")
    }

    const bulkReject = async(rejectIds) => {
        setIsLoading(true)

        await approvalApi.bulkReject({rejectIds})

        // Update status to approval list
        let approvalArrData = [...approvals]
        // @ts-ignore
        approvalArrData.map((approval)=>{
            if(rejectIds.includes(approval.id)){
                approval.status = -1
            }
        })

        setApprovals(approvalArrData)

        setIsLoading(false)

        setDetailModal(false)

        toastUtils.success("Reject assets successfully")
    }

    const bulkDelete = async(deleteIds) => {
        setIsLoading(true)

        await approvalApi.bulkDelete({deleteIds})

        // Update status to approval list
        let approvalArrData = [...approvals]

        approvalArrData = approvalArrData.filter((approval)=> !deleteIds.includes(approval.id))

        setApprovals(approvalArrData)

        setIsLoading(false)

        setDetailModal(false)

        toastUtils.success("Delete approval successfully")
    }

    const getSelectedAssets = () => {
        return assets.filter((asset)=>asset.isSelected).map((asset)=>asset.asset.id)
    }

    const getSelectedApprovals = () => {
        return approvals.filter((approval)=>approval.isSelected).map((approval)=>approval.id)
    }

    // On change custom fields (add/remove)
    const onChangeCustomField = (index, data) => {
        // // Show loading
        // setIsLoading(true)
        //
        // Hide select list
        setActiveCustomField(undefined)
        //
        //
        // Update asset custom field (local)
        setAssetCustomFields(update(assetCustomFields, {
            [index]: {
                values: {$set: data}
            }
        }))
        //
        // // Show loading
        // setIsLoading(false)
    }

    const onChangeTempCustomField = (index, data) => {
        // Hide select list
        setActiveCustomField(undefined)

        // Update asset custom field (local)
        setTempCustoms(update(tempCustoms, {
            [index]: {
                values: {$set: data}
            }
        }))
    }

    // On custom field select one changes
    const onChangeSelectOneCustomField = async (selected, index) => {
        // Hide select list
        setActiveCustomField(undefined)

        // Update asset custom field (local)
        setAssetCustomFields(update(assetCustomFields, {
            [index]: {
                values: {$set: [selected]}
            }
        }))
    }

    // On temp custom field select one changes
    const onChangeSelectOneTempCustomField = async (selected, index) => {

        // Show loading
        setIsLoading(true)

        // Call API to add custom fields
        await assetApi.addCustomFields(assets[selectedAsset]?.asset.id, {...selected})


        // Hide select list
        setActiveCustomField(undefined)


        // Update asset custom field (local)
        setTempCustoms(update(tempCustoms, {
            [index]: {
                values: {$set: [selected]}
            }
        }))

        // Hide loading
        setIsLoading(false)
    }

    useEffect(()=>{
        fetchApprovals();
        getTagsInputData();
        getCampaignsInputData();
        getCustomFieldsInputData();
    },[])

    useEffect(()=>{
        if(approvalIndex !== undefined){
            // @ts-ignore
            const currentData = approvals[approvalIndex] ? approvals[approvalIndex].assets : []
            if(filter && currentData.length > 0){
                // @ts-ignore
                switch (filter.value) {
                    case -1: {
                        const newAssets = [...currentData].filter(({asset})=>asset.status === -1)
                        setAssets(newAssets)
                        break;
                    }
                    case 0: {
                        const newAssets = [...currentData].filter(({asset})=>asset.status === 0)
                        setAssets(newAssets)
                        break;
                    }
                    case 2: {
                        const newAssets = [...currentData].filter(({asset})=>asset.status === 2)
                        setAssets(newAssets)
                        break;
                    }
                }
            }else{
                // @ts-ignore
                setAssets(currentData)
            }
        }



    },[filter])


    useEffect( () => {
        updateName(debouncedBatchName)
    }, [debouncedBatchName]);

    useEffect(()=>{
        if(inputCustomFields.length > 0){
            const updatedMappingCustomFieldData =  mappingCustomFieldData(inputCustomFields, customs)

            setAssetCustomFields(update(assetCustomFields, {
                $set: updatedMappingCustomFieldData
            }))

            setCustoms(updatedMappingCustomFieldData)
        }
    },[inputCustomFields])

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
        titleText={"Upload Requests"}
        showAssetAddition={false}
      />
        <div className={"row"}>
            <div className={"col-70"}>
                <main className={`${styles.container}`}>
                    {mode === "view" && <div className={`${styles['button-wrapper']}`}>
                        <div>
                            <div className={styles['main-title']}>
                                {currentApproval?.name || "Untitled"}
                            </div>
                            <div className={styles['main-subtitle']}>
                                Submitted {} on {moment(currentApproval?.createdAt).format("MMM DD, YYYY")}
                            </div>
                        </div>

                        <div className={"m-l-auto"}>
                            {assets.length > 0 && (currentViewStatus === 0 || isAdmin()) && hasSelectedAssets() && <Button type='button' text='Deselect' styleType='secondary' onClick={()=>{selectAllAssets(false)}} />}
                            {assets.length > 0 && (currentViewStatus === 0 || isAdmin()) && !selectedAllAssets && <Button type='button' text='Select All' styleType='secondary' onClick={selectAllAssets} />}
                            {assets.length > 0 && currentViewStatus === 0 &&
                                <Button
                                type='button'
                                text='Submit Batch'
                                styleType='primary'
                                onClick={()=>{
                                    if(!batchName){
                                        toastUtils.error('Please enter the batch name to submit')
                                    }else{
                                        setShowConfirmModal(true)}
                                    }

                                }
                                />
                            }
                            {assets.length > 0 && isAdmin() && hasSelectedAssets() &&
                                <Button
                                    type='button'
                                    text='Reject Selected'
                                    styleType='primary'
                                    onClick={()=>{
                                        setTempAssets(getSelectedAssets())
                                        setShowRejectConfirm(true)
                                    }

                                    }
                                />
                            }
                            {assets.length > 0 && isAdmin() && hasSelectedAssets() &&
                                <Button
                                    type='button'
                                    text='Approve Selected'
                                    styleType='primary'
                                    onClick={()=>{
                                        setTempAssets(getSelectedAssets())
                                        setShowApproveConfirm(true)
                                    }

                                    }
                                />
                            }
                            <Button type='button' text={'Back'} styleType='secondary' onClick={onCancelView} />
                        </div>

                    </div>}

                    {
                        mode === "view" && isAdmin() && <div className={styles['filter-wrapper']}>
                            <Select
                                containerClass={styles['filter-input']}
                                isClearable={true}
                                options={filterOptions}
                                onChange={(value)=>{setFilter(value)}}
                                placeholder={'Filter By Status'}
                                styleType='regular'
                                value={filter}
                            />
                        </div>
                    }

                    {mode === "list" && <div className={styles["asset-list"]}>
                        <div className={`${styles['button-wrapper']} m-b-25`}>
                            <div className={"m-l-auto"}>
                                {approvals.length > 0 && hasSelectedApprovals() && <Button type='button' text='Deselect' styleType='secondary' onClick={()=>{selectAllApprovals(false)}} />}
                                {approvals.length > 0 && !selectedAllApprovals && <Button type='button' text='Select All' styleType='secondary' onClick={selectAllApprovals} />}

                                {approvals.length > 0 && hasSelectedApprovals() &&
                                    <Button
                                        type='button'
                                        text='Delete'
                                        styleType='primary'
                                        onClick={()=>{
                                            setTempApprovals(getSelectedApprovals())
                                            setShowDeleteConfirm(true)
                                        }

                                        }
                                    />
                                }

                                {isAdmin() && approvals.length > 0 && isAdmin() && hasSelectedApprovals() &&
                                    <Button
                                        type='button'
                                        text='Reject Selected'
                                        styleType='primary'
                                        onClick={()=>{
                                            setTempApprovals(getSelectedApprovals())
                                            setShowRejectConfirm(true)
                                        }

                                        }
                                    />
                                }
                                {isAdmin() && approvals.length > 0 && isAdmin() && hasSelectedApprovals() &&
                                    <Button
                                        type='button'
                                        text='Approve Selected'
                                        styleType='primary'
                                        onClick={()=>{
                                            setTempApprovals(getSelectedApprovals())
                                            setShowApproveConfirm(true)
                                        }

                                        }
                                    />
                                }
                            </div>

                        </div>
                        <div className={`${assetGridStyles["list-wrapper"]} ${approvals.length === 0 ? "mb-32" : ""}`}>
                            <ul className={"regular-list"}>
                                {approvals.length === 0 && <p>There is no any request yet</p>}
                                {
                                    approvals.map((approval, index) => {
                                        return (
                                            <li
                                                className={assetGridStyles["regular-item"]}
                                                key={approval.id || index}
                                            >
                                                <ListItem
                                                    data={approval}
                                                    index={index}
                                                    toggleSelected={() => {
                                                        toggleSelected(index)
                                                    }}
                                                    onView={onView}
                                                    isAdmin={isAdmin()}
                                                />
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>}

                    {mode === "view" && <div>
                        <div className={styles["asset-view-list"]}>
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
                                                            showAssetOption={false}
                                                            isShare={false}
                                                            type={""}
                                                            toggleSelected={() =>{
                                                                toggleSelectedAsset(assetItem.asset.id)
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
                                                            customComponent={<TagWrapper status={assetItem.asset.status}/>}
                                                            infoWrapperClass={styles['asset-grid-info-wrapper']}
                                                            textWrapperClass={
                                                            hasTagOrComments(assetItem.asset) ?
                                                                (hasBothTagAndComments(assetItem.asset) ? styles['asset-grid-text-wrapper-2-icon'] : styles['asset-grid-text-wrapper'] ) :
                                                                "w-100"}
                                                            customIconComponent={<div className={`${styles['icon-wrapper']} d-flex`}>
                                                                {assetItem.asset.comments && <IconClickable additionalClass={styles['edit-icon']} src={Utilities.comment} onClick={()=> {}} />}
                                                                {assetItem.asset.tags.length > 0 && <IconClickable additionalClass={styles['edit-icon']} src={Utilities.greenTag} onClick={()=> {}} />}
                                                            </div>}
                                                        />
                                                    </li>
                                                );
                                            }
                                        })}
                                </ul>
                            </div>
                        </div>
                    </div>}

                </main>
            </div>

            {
                mode === "view" &&  assets.length > 0 && <div className={`col-30 ${styles['right-panel']}`}>
                    <div className={detailPanelStyles.container}>
                        <h2 className={styles['detail-title']}>
                            {isAdmin()  ? "User Tags" : "Tagging"}
                        </h2>

                        {
                            (currentViewStatus !== 0 || isAdmin()) && <div className={detailPanelStyles['field-wrapper']} >
                                <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Message</div>
                                <p>{currentApproval?.message}</p>
                            </div>
                        }

                        {!isAdmin() && currentViewStatus == 0 && <div className={detailPanelStyles['first-section']}>
                            <div className={detailPanelStyles['field-wrapper']}>
                                <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Batch Name</div>
                                <Input
                                    onChange={(e)=>{setBatchName(e.target.value)}}
                                    placeholder={'Batch Name'}
                                    value={batchName}
                                    styleType={'regular-height-short'} />
                            </div>
                        </div>}

                        {hasSelectedAssets() && (currentViewStatus === 0 || isAdmin()) && <>
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
                                    allowEdit={currentViewStatus === 0 || isAdmin()}
                                    creatable={isAdmin()}
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
                                    ignorePermission={true}
                                />
                            </div>


                            {
                                isAdmin() && <div className={detailPanelStyles['field-wrapper']} >
                                    <CreatableSelect
                                        title='Campaigns'
                                        addText='Add to Campaign'
                                        onAddClick={() => setActiveDropdown('campaigns')}
                                        selectPlaceholder={'Enter a new campaign or select an existing one'}
                                        avilableItems={inputCampaigns}
                                        setAvailableItems={setInputCampaigns}
                                        selectedItems={assetCampaigns}
                                        setSelectedItems={setCampaigns}
                                        creatable={isAdmin()}
                                        onAddOperationFinished={(stateUpdate) => {
                                            setActiveDropdown("")

                                            // updateAssetState({
                                            //     campaigns: { $set: stateUpdate }
                                            // })
                                            // loadCampaigns()
                                        }}
                                        onRemoveOperationFinished={async (index, stateUpdate) => {
                                            // await assetApi.removeCampaign(id, assetCampaigns[index].id)
                                            // updateAssetState({
                                            //     campaigns: { $set: stateUpdate }
                                            // })
                                        }}
                                        onOperationFailedSkipped={() => setActiveDropdown('')}
                                        isShare={false}
                                        asyncCreateFn={
                                            (newItem)=>{
                                                // (newItem) => assetApi.addCampaign(id, newItem)
                                                return { data: newItem }
                                            }
                                        }
                                        dropdownIsActive={activeDropdown === 'campaigns'}
                                        altColor='yellow'
                                        ignorePermission={true}
                                    />
                                </div>
                            }


                            {isAdmin() && inputCustomFields.map((field, index)=>{
                                if(field.type === 'selectOne'){

                                    return <div className={detailPanelStyles['field-wrapper']} key={index}>
                                        <div className={`secondary-text ${styles.field}`}>{field.name}</div>
                                        <CustomFieldSelector
                                            data={assetCustomFields[index]?.values[0]?.name}
                                            options={field.values}
                                            isShare={false}
                                            onLabelClick={() => { }}
                                            handleFieldChange={(option)=>{onChangeSelectOneCustomField(option, index)}}
                                        />
                                    </div>
                                }

                                if(field.type === 'selectMultiple'){
                                    return <div className={detailPanelStyles['field-wrapper']} key={index}>
                                        <CreatableSelect
                                            creatable={false}
                                            title={field.name}
                                            addText={`Add ${field.name}`}
                                            onAddClick={() => setActiveCustomField(index)}
                                            selectPlaceholder={'Select an existing one'}
                                            avilableItems={field.values}
                                            setAvailableItems={()=>{}}
                                            selectedItems={(assetCustomFields.filter((assetField)=>assetField.id === field.id))[0]?.values || []}
                                            setSelectedItems={(data)=>{onChangeCustomField(index, data)}}
                                            onAddOperationFinished={(stateUpdate) => {
                                                // updateAssetState({
                                                //     customs: {[index]: {values: { $set: stateUpdate }}}
                                                // })
                                            }}
                                            onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                                                // setIsLoading(true);
                                                //
                                                // await assetApi.removeCustomFields(id, removeId)
                                                //
                                                // updateAssetState({
                                                //     customs: {[index]: {values: { $set: stateUpdate }}}
                                                // })
                                                //
                                                // setIsLoading(false);
                                            }}
                                            onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                                            isShare={false}
                                            asyncCreateFn={(newItem) => { // Show loading
                                                return { data: newItem }
                                                // setIsLoading(true);
                                                // return assetApi.addCustomFields(id, {...newItem, folderId: activeFolder})
                                            }}
                                            dropdownIsActive={activeCustomField === index}
                                            ignorePermission={true}
                                        />
                                    </div>
                                }
                            })}



                            <Button className={styles['add-tag-btn']} type='button' text='Bulk Add Tag' styleType='secondary' onClick={saveBulkTag} />
                            {/*{*/}
                            {/*    !isAdmin() && <>*/}
                            {/*        <div className={detailPanelStyles['field-wrapper']} >*/}
                            {/*            <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Comments</div>*/}
                            {/*            <TextArea type={"textarea"} rows={4} placeholder={'Add comments'} value={comments}*/}
                            {/*                      onChange={e => {setComments(e.target.value)}} styleType={'regular-short'} />*/}
                            {/*        </div>*/}

                            {/*        <Button className={styles['add-tag-btn']} type='button' text='Add comments' styleType='secondary' onClick={saveComment} />*/}
                            {/*    </>*/}
                            {/*}*/}

                        </>}



                    </div>
                </div>
            }
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
                    {assets[selectedAsset]?.asset.type !== "image" &&
                        assets[selectedAsset]?.asset.type !== "video" &&
                        assets[selectedAsset]?.thumbailUrl && (
                            assets[selectedAsset]?.asset.extension.toLowerCase() === "pdf" ?
                                <AssetPdf
                                    asset={assets[selectedAsset]?.asset}
                                />
                                :
                                <AssetImg
                                    name={assets[selectedAsset]?.asset.name}
                                    assetImg={assets[selectedAsset]?.realUrl}
                                />
                        )}
                    {assets[selectedAsset]?.asset.type !== "image" &&
                        assets[selectedAsset]?.asset.type !== "video" &&
                        !assets[selectedAsset]?.thumbailUrl && (
                            <AssetIcon extension={assets[selectedAsset]?.asset.extension} />
                        )}
                    {assets[selectedAsset]?.asset.type === "video" && (
                        <video controls>
                            <source
                                src={assets[selectedAsset]?.realUrl}
                                type={`video/${assets[selectedAsset]?.asset.extension}`}
                            />
                            Sorry, your browser doesn't support video playback.
                        </video>
                    )}
                    {/*<AssetImg*/}
                    {/*    imgClass={""}*/}
                    {/*    assetImg={assets[selectedAsset]?.realUrl}*/}
                    {/*    type={""}*/}
                    {/*    name={"image"}*/}
                    {/*/>*/}
                    {/*<img alt={"test"} src={assets[selectedAsset]?.realUrl} />*/}
                    <div className={styles['file-name']}>
                        <span>{assets[selectedAsset]?.asset.name}</span>
                        {(currentViewStatus === 0 || isAdmin()) && <IconClickable additionalClass={styles['edit-icon']} src={Utilities.edit} onClick={()=> {setShowRenameModal(true)}} />}
                    </div>
                    <div className={styles['date']}>{moment(assets[selectedAsset]?.asset?.createdAt).format('MMM DD, YYYY, hh:mm a')}</div>

                    {(isAdmin() || currentViewStatus !== 0) && <div className={detailPanelStyles['field-wrapper']} >
                        <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Comments</div>
                        <p>
                            {tempComments}
                        </p>
                    </div>}
                </div>
                <div className={"col-40"}>
                    <div className={`${detailPanelStyles.container} ${styles['right-form']}`}>
                        <h2 className={styles['detail-title']}>Add Attributes to Selected Assets</h2>

                        <div className={detailPanelStyles['field-wrapper']} >
                            <CreatableSelect
                                title='Tags'
                                addText='Add Tags'
                                onAddClick={() => {
                                    if(currentViewStatus === 0 || isAdmin()){
                                        setActiveDropdown('tags')}
                                    }

                            }
                                selectPlaceholder={'Enter a new tag or select an existing one'}
                                avilableItems={inputTags}
                                setAvailableItems={setInputTags}
                                selectedItems={tempTags}
                                setSelectedItems={setTempTags}
                                allowEdit={currentViewStatus === 0 || isAdmin()}
                                creatable={isAdmin()}
                                onAddOperationFinished={(stateUpdate) => {
                                    setActiveDropdown("")

                                    if(isAdmin()){
                                        updateAssetTagsState(stateUpdate)
                                    }
                                }}
                                onRemoveOperationFinished={async (index, stateUpdate) => {
                                    if(isAdmin()){
                                        setIsLoading(true)
                                        await assetApi.removeTag(assets[selectedAsset]?.asset.id, tempTags[index].id)
                                        updateAssetTagsState(stateUpdate)
                                    }

                                }}
                                onOperationFailedSkipped={() => setActiveDropdown('')}
                                isShare={false}
                                asyncCreateFn={(newItem) => {
                                    if(isAdmin()){ // Admin can edit inline, dont need to hit save button
                                        setIsLoading(true)
                                        return assetApi.addTag(assets[selectedAsset]?.asset.id, newItem)
                                    }else{
                                        return { data: newItem }
                                    }

                                }}
                                dropdownIsActive={activeDropdown === 'tags'}
                                ignorePermission={true}
                            />
                        </div>

                        {
                            isAdmin() && <div className={detailPanelStyles['field-wrapper']} >
                                <CreatableSelect
                                    title='Campaigns'
                                    addText='Add to Campaign'
                                    onAddClick={() => setActiveDropdown('campaigns')}
                                    selectPlaceholder={'Enter a new campaign or select an existing one'}
                                    avilableItems={inputCampaigns}
                                    setAvailableItems={setInputCampaigns}
                                    selectedItems={tempCampaigns}
                                    setSelectedItems={setTempCampaigns}
                                    creatable={isAdmin()}
                                    onAddOperationFinished={(stateUpdate) => {
                                        updateAssetState({
                                            campaigns: { $set: stateUpdate }
                                        })
                                        // loadCampaigns()
                                    }}
                                    onRemoveOperationFinished={async (index, stateUpdate) => {
                                        await assetApi.removeCampaign(assets[selectedAsset]?.asset.id, assetCampaigns[index].id)
                                        updateAssetState({
                                            campaigns: { $set: stateUpdate }
                                        })
                                    }}
                                    onOperationFailedSkipped={() => setActiveDropdown('')}
                                    isShare={false}
                                    asyncCreateFn={
                                        (newItem)=>{
                                            if(isAdmin()) { // Admin can edit inline, dont need to hit save button
                                                setIsLoading(true)

                                                return assetApi.addCampaign(assets[selectedAsset]?.asset.id, newItem)
                                            }else{
                                                return { data: newItem }
                                            }
                                        }
                                    }
                                    dropdownIsActive={activeDropdown === 'campaigns'}
                                    altColor='yellow'
                                    ignorePermission={true}
                                />
                            </div>
                        }


                        {isAdmin() && inputCustomFields.map((field, index)=>{
                            if(field.type === 'selectOne'){

                                return <div className={detailPanelStyles['field-wrapper']} key={index}>
                                    <div className={`secondary-text ${styles.field}`}>{field.name}</div>
                                    <CustomFieldSelector
                                        data={tempCustoms[index]?.values[0]?.name}
                                        options={field.values}
                                        isShare={false}
                                        onLabelClick={() => { }}
                                        handleFieldChange={(option)=>{onChangeSelectOneTempCustomField(option, index)}}
                                    />
                                </div>
                            }

                            if(field.type === 'selectMultiple'){
                                return <div className={detailPanelStyles['field-wrapper']} key={index}>
                                    <CreatableSelect
                                        creatable={false}
                                        title={field.name}
                                        addText={`Add ${field.name}`}
                                        onAddClick={() => setActiveCustomField(index)}
                                        selectPlaceholder={'Select an existing one'}
                                        avilableItems={field.values}
                                        setAvailableItems={()=>{}}
                                        selectedItems={(tempCustoms.filter((assetField)=>assetField.id === field.id))[0]?.values || []}
                                        setSelectedItems={(data)=>{onChangeTempCustomField(index, data)}}
                                        onAddOperationFinished={(stateUpdate) => {
                                            setActiveDropdown("")

                                            if(isAdmin()){
                                                updateAssetState({
                                                    customs: {[index]: {values: { $set: stateUpdate }}}
                                                })
                                            }

                                        }}
                                        onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                                            if(isAdmin()){
                                                setIsLoading(true)
                                                await assetApi.removeCustomFields(assets[selectedAsset]?.asset.id, removeId)

                                                updateAssetState({
                                                    customs: {[index]: {values: { $set: stateUpdate }}}
                                                })

                                                setIsLoading(false);
                                            }
                                        }}
                                        onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                                        isShare={false}
                                        asyncCreateFn={(newItem) => { // Show loading
                                            setNeedRefresh(true)
                                            if(isAdmin()){ // Admin can edit inline, dont need to hit save button
                                                setIsLoading(true)
                                                return assetApi.addCustomFields(assets[selectedAsset]?.asset.id, {...newItem})
                                            }else{
                                                return { data: newItem }
                                            }
                                        }}
                                        dropdownIsActive={activeCustomField === index}
                                        ignorePermission={true}
                                    />
                                </div>
                            }
                        })}

                        {!isAdmin() && currentViewStatus === 0 && <div className={detailPanelStyles['field-wrapper']} >
                            <div className={`secondary-text ${detailPanelStyles.field} ${styles['field-name']}`}>Comments</div>
                          <TextArea type={"textarea"} rows={4} placeholder={'Add comments'} value={tempComments}
                                      onChange={e => {setTempComments(e.target.value)}} styleType={'regular-short'} disabled={currentViewStatus !== 0}/>
                        </div>}

                        <div className={"m-b-25"}></div>
                    </div>

                    {(currentViewStatus === 0) && <Button className={`${styles['add-tag-btn']} m-l-20`} type='button' text='Save changes' styleType='primary' onClick={onSaveSingleAsset} />}


                    {(isAdmin()) && <div className={`${styles['admin-button-wrapper']} m-l-20`}>
                        <Button
                            className={styles['add-tag-btn']}
                            type='button'
                            text='Reject'
                            styleType='secondary'
                            onClick={()=>{
                                setTempAssets([assets[selectedAsset]?.asset.id])
                                setShowRejectConfirm(true)}
                            }/>

                        <Button
                            className={styles['add-tag-btn']}
                            type='button'
                            text='Approve'
                            styleType='primary'
                            onClick={()=> {
                                setTempAssets([assets[selectedAsset]?.asset.id])
                                setShowApproveConfirm(true)
                            }
                            } />
                    </div>}
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
                        <Button className={styles['keep-edit-btn']} type='button' text='Keep editing' styleType='secondary' onClick={()=>{setShowConfirmModal(false); setMessage("")}} />
                        <Button className={styles['add-tag-btn']} type='button' text='Submit' styleType='primary' onClick={submit} />
                    </>}
                    {submitted &&  <Button className={styles['add-tag-btn']} type='button' text='Back to Sparkfive' styleType='primary' onClick={()=>{onCancelView(true)}} />}

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


        <ConfirmModal
            closeModal={() => setShowApproveConfirm(false)}
            confirmAction={() => {
                if(mode === "list"){
                    bulkApprove(tempApprovals)
                    setShowApproveConfirm(false)
                }else{
                    approve(approvalId, tempAssets)
                    setShowApproveConfirm(false)
                }

            }}
            confirmText={'Approve'}
            message={'Are you sure you would like to approve this asset?'}
            modalIsOpen={showApproveConfirm}
        />

        <ConfirmModal
            closeModal={() => setShowRejectConfirm(false)}
            confirmAction={() => {
                if(mode === "list"){
                    bulkReject(tempApprovals)
                    setShowRejectConfirm(false)
                }else{
                    reject(approvalId, tempAssets)
                    setShowRejectConfirm(false)
                }

            }}
            confirmText={'Reject'}
            message={'Are you sure you would like to reject this asset?'}
            modalIsOpen={showRejectConfirm}
        />

        <ConfirmModal
            closeModal={() => setShowDeleteConfirm(false)}
            confirmAction={() => {
                bulkDelete(tempApprovals)
                setShowDeleteConfirm(false)

            }}
            confirmText={'Delete'}
            message={'Are you sure you would like to delete this batch?'}
            modalIsOpen={showDeleteConfirm}
        />

    </>
  )
}

export default UploadRequest
