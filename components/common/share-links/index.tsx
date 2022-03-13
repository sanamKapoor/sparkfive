import styles from './index.module.css'
import React, {useEffect, useState} from "react"
import moment from 'moment'
import copy from 'copy-to-clipboard'

// APIs
import sharedLinksApi from '../../../server-api/shared-links'

// Components
import Select from "../inputs/select";
import IconClickable from "../buttons/icon-clickable";
import { AssetOps } from '../../../assets'
import UserPhoto from "../user/user-photo";
import SpinnerOverlay from "../spinners/spinner-overlay";
import { Assets } from '../../../assets'

// Utils
import toastUtils from '../../../utils/toast'
import ConfirmModal from "../modals/confirm-modal";
import ShareModal from "../modals/share-modal";

// Constants
import { statusList, colorList } from "../../../constants/shared-links";
import {Waypoint} from "react-waypoint";


export default function ShareLinks(){

    const [links, setLinks] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState("")
    const [showEditModal, setShowEditModal] = useState(false)
    const [currentLink, setCurrentLink] = useState()
    const [status, setStatus] = useState(null)
    const [sharedBy, setSharedBy] = useState(null)
    const [sharedWith, setSharedWith] = useState(null)
    const [shareByList, setShareByList] = useState([])
    const [shareWithList, setShareWithList] = useState([])
    const [page, setPage] = useState(0)
    const [nextPage, setNextPage] = useState(0)
    const [sortData, setSortData] = useState({
        sortField: "createdAt",
        sortType: "desc"
    })

    const getFilterObject = (page) => {
        let filters: any = {page}
        if(sharedBy){
            filters.sharedBy = sharedBy ? sharedBy.map((item)=>item.value).join(",") : ""
        }

        if(sharedWith){
            filters.sharedWith = sharedWith ? sharedWith.map((item)=>item.value).join(","): ""
        }

        if(status){
            filters.status = status ? status?.value : ""
        }

        return filters
    }

    const getRandomFromArr = (arr) => {
        const index =  Math.floor(Math.random() * (arr.length ? arr.length-1 : 0));
        return arr[index]
    }

    const formatDataColor = (data) => {
        let groups = {}

        const assignColor = () => {
            let availableColors = []
            // Check if color is already in use
            Object.keys(groups).map((key)=>{
                availableColors = colorList.filter((color)=>color !== groups[key])
            })

            // Has color to choose
            if(availableColors.length > 0){
                return getRandomFromArr(availableColors)
            }else{// Not having, do random
                return getRandomFromArr(colorList)
            }
        }

        data.map((item)=>{
            // Already have color, use it
            if(groups[item.user.name]){
                item.color = groups[item.user.name]
            }else{ // Not having yet
                item.color = assignColor();
                groups[item.user.name] = item.color
            }
        })

        return data
    }

    const getLinks  = async (filter, refresh = true) => {
        // Show loading
        setLoading(true)
        const promises = [sharedLinksApi.getSharedByList(), sharedLinksApi.getSharedWithList() , sharedLinksApi.getSharedLinks(filter)]

        const results = await Promise.all(promises)

        let { data } = results[2]

        setNextPage(data.next)

        setShareByList(results[0].data.map((item)=>{return {label: item, value: item}}))
        setShareWithList(results[1].data.map((item)=>{return {label: item, value: item}}))

        if(refresh){
            let dataWithColor = formatDataColor(data.results)
            setLinks(dataWithColor)
        }else{
            let dataWithColor = formatDataColor(links.concat(data.results))
            setLinks(dataWithColor)
        }


        setLoading(false)
    }

    const deleteLink = async () => {
        // Show loading
        setLoading(true)

        await sharedLinksApi.deleteLink(deleteId)

        getLinks(getFilterObject(1));
    }

    const updateLink = async (recipients, message, sharedLinkData) => {
        if(currentLink){
            // Show loading
            setLoading(true)

            // Delete unnecessary field
            delete sharedLinkData.shareId

            // @ts-ignore
            await sharedLinksApi.updateLink(currentLink?.id, {
                sharedEmails: recipients,
                message,
                ...sharedLinkData,
                expiredPeriod: sharedLinkData.expiredPeriod?.value,
            })

            getLinks(getFilterObject(1));
        }

    }

    const loadMore = () => {
        // still have page to load
        if(nextPage !== -1){
            setPage(page + 1)
            getLinks({
                sharedBy: sharedBy ? sharedBy.map((item)=>item.value).join(",") : "",
                sharedWith: sharedWith ? sharedWith.map((item)=>item.value).join(","): "",
                status: status ? status?.value : "",
                page: page + 1
            }, false)
        }
    }

    const sort = (field, type) => {
        const data = {...sortData}
        setSortData({
            ...data,
            sortField: field,
            sortType: type
        })
    }

    const getSortType = (field) => {
        // Sort on different field
        if(sortData.sortField !== field){
            return "desc" // DESC as default
        }else{
            if(sortData.sortType === "asc"){
                return "desc"
            }else{
                return "asc"
            }
        }
    }

    // useEffect(()=>{
    //     getLinks(getFilterObject())
    // },[])

    useEffect(()=>{
        setPage(0)
        setNextPage(-1)
        getLinks({
            sharedBy: sharedBy ? sharedBy.map((item)=>item.value).join(",") : "",
            sharedWith: sharedWith ? sharedWith.map((item)=>item.value).join(","): "",
            status: status ? status?.value : "",
            page: 1,
            ...sortData
        })
    },[sharedBy, sharedWith, status])


    // Listen sort
    useEffect(()=>{
        if(links.length > 0){
            getLinks({
                sharedBy: sharedBy ? sharedBy.map((item)=>item.value).join(",") : "",
                sharedWith: sharedWith ? sharedWith.map((item)=>item.value).join(","): "",
                status: status ? status?.value : "",
                page: 1,
                ...sortData
            })
        }
    },[sortData])

    return <>
       <div className={`row ${styles['header']}`}>
            <div className={"col-10 d-flex align-items-center"}>
                Filters
            </div>
            <div className={"col-30 col-md-100"}>
                <Select
                    options={shareByList}
                    onChange={(value)=>{setSharedBy(value)}}
                    placeholder={'Share by'}
                    styleType='regular'
                    value={sharedBy}
                    isMulti={true}
                    isClearable={true}
                />
            </div>
            <div className={"col-30 col-md-100"}>
                <Select
                    options={shareWithList}
                    onChange={(value)=>{setSharedWith(value)}}
                    placeholder={'Share with'}
                    styleType='regular'
                    value={sharedWith}
                    isMulti={true}
                    isClearable={true}
                />
            </div>
            <div className={"col-30 col-md-100"}>
                <Select
                    isClearable={true}
                    options={statusList}
                    onChange={(value)=>{setStatus(value)}}
                    placeholder={'Status'}
                    styleType='regular'
                    value={status}
                />
            </div>
        </div>
        {links.length === 0 && <div className={'row align-center justify-content-center m-t-30'}>
            No data
        </div>}
        {links.length > 0 && <div className={`row align-center ${styles['row-heading']} font-weight-600`}>
            <div className={"col-10 col-md-100 cursor-pointer d-flex align-items-center"}
                 onClick={()=>{sort("createdAt", sortData.sortType === "asc" ? "desc" : "asc")}}
            >
                <span className={"font-12"}>Date Created</span>
                <img
                    src={Assets.arrowDown}
                    className={
                        `
                          ${styles['sort-icon']} 
                          ${sortData.sortField === "createdAt" ? styles['sort-icon-active'] : ""} 
                          ${sortData.sortType === 'asc' ? '' : styles.desc}
                        `
                    }
                />
            </div>
            <div className={"col-20 col-md-100 cursor-pointer d-flex align-items-center"}
                 onClick={()=>{sort("name", getSortType("name"))}}
            >
                <span className={"font-12"}>Name</span>
                <img
                    src={Assets.arrowDown}
                    className={
                        `
                          ${styles['sort-icon']} 
                          ${sortData.sortField === "name" ? styles['sort-icon-active'] : ""} 
                          ${sortData.sortType === 'asc' ? '' : styles.desc}
                        `
                    }
                />
            </div>
            <div className={"col-15 col-md-100 cursor-pointer d-flex align-items-center"}
                 onClick={()=>{sort("user.name", getSortType("user.name"))}}
            >
                <span className={"font-12"}>Shared By</span>
                <img
                    src={Assets.arrowDown}
                    className={
                        `
                          ${styles['sort-icon']} 
                          ${sortData.sortField === "user.name" ? styles['sort-icon-active'] : ""} 
                          ${sortData.sortType === 'asc' ? '' : styles.desc}
                        `
                    }
                />
            </div>
            <div className={"col-25 col-md-100 cursor-pointer d-flex align-items-center"}
                 onClick={()=>{sort("sharedLink", getSortType("sharedLink"))}}
            >
                <span className={"font-12"}>Link</span>
                <img
                    src={Assets.arrowDown}
                    className={
                        `
                          ${styles['sort-icon']} 
                          ${sortData.sortField === "sharedLink" ? styles['sort-icon-active'] : ""} 
                          ${sortData.sortType === 'asc' ? '' : styles.desc}
                        `
                    }
                />
            </div>
            <div className={"col-10 col-md-100 cursor-pointer d-flex align-items-center"}
                 onClick={()=>{sort("sharedCount", getSortType("sharedCount"))}}
            >
                <span className={"font-12"}>Share With</span>
                <img
                    src={Assets.arrowDown}
                    className={
                        `
                          ${styles['sort-icon']} 
                          ${sortData.sortField === "sharedCount" ? styles['sort-icon-active'] : ""} 
                          ${sortData.sortType === 'asc' ? '' : styles.desc}
                        `
                    }
                />
            </div>
            <div className={"col-10 col-md-100 cursor-pointer d-flex align-items-center"}
                 onClick={()=>{sort("expiredAt", getSortType("expiredAt"))}}
            >
                <span className={"font-12"}>Expiration Date</span>
                <img
                    src={Assets.arrowDown}
                    className={
                        `
                          ${styles['sort-icon']} 
                          ${sortData.sortField === "expiredAt" ? styles['sort-icon-active'] : ""} 
                          ${sortData.sortType === 'asc' ? '' : styles.desc}
                        `
                    }
                />
            </div>
            <div className={"col-10"}>

            </div>
        </div>}

        {links.map((link, index)=>{
            return <div className={`row align-center ${styles['data-row']}`} key={index}>
                <div className={"col-10 d-flex align-items-center col-md-100"}>
                    <span className={"font-12"}>{moment(link.createdAt).format('MM/DD/YY')}</span>
                </div>
                <div className={"col-20 d-flex align-items-center col-md-100"}>
                    <span
                        style={{backgroundColor: link.color}}
                        className={`${styles['name-tag']} font-12`}>
                        {link.name}
                    </span>
                </div>
                <div className={"col-15 d-flex align-items-center col-md-100"}>
                    <UserPhoto photoUrl={link.user.profilePhoto || ""} extraClass={styles.profile} sizePx={18} />
                    <span className={"m-l-5 font-12"}>{link.user.name}</span>
                </div>
                <div className={"col-25 d-flex align-items-center word-break-text col-md-100"}>
                    <span className={"font-12"}>{link.sharedLink}</span>
                    <IconClickable additionalClass={`${styles['action-button']} m-l-5 cursor-pointer`}
                                   src={AssetOps[`copy${''}`]}
                                   tooltipText={'Copy'}
                                   tooltipId={'Copy'}
                                   onClick={()=>{
                                       copy(link.sharedLink)
                                       toastUtils.bottomSuccess('Link copied')
                                   }}/>
                </div>
                <div className={"col-10 d-flex align-items-center col-md-100"}>
                    <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                    <span className={"m-l-5 font-weight-600 font-12"}>{link.sharedCount}</span>
                </div>
                <div className={"col-10 d-flex align-items-center col-md-100"}>
                    <span className={"font-12"}>{moment(link.expiredAt).format('MM/DD/YY')}</span>
                </div>
                <div className={"col-10 d-flex align-items-center col-md-100"}>
                    <IconClickable
                        additionalClass={styles['action-button']}
                        src={AssetOps[`edit`]}
                        tooltipText={'Edit'}
                        tooltipId={'Edit'}
                        onClick={() => {
                            setCurrentLink(link)
                            setShowEditModal(true)
                        }}
                    />
                    <IconClickable
                        additionalClass={`${styles['action-button']} m-l-10`}
                        src={AssetOps[`delete`]}
                        tooltipText={'Delete'}
                        tooltipId={'Delete'}
                        onClick={() => {
                            setDeleteId(link.id)
                            setDeleteOpen(true)
                        }}
                    />
                </div>
            </div>
        })}

        {
            <Waypoint onEnter={loadMore} fireOnRapidScroll={false} />
        }

        {loading && <SpinnerOverlay />}


        <ConfirmModal
            closeModal={() => setDeleteOpen(false)}
            confirmAction={() => {
                deleteLink()
                setDeleteOpen(false)
            }}
            confirmText={'Delete'}
            message={'Are you sure you want to delete this link?'}
            modalIsOpen={deleteOpen}
        />

        <ShareModal
            modalIsOpen={showEditModal}
            closeModal={()=>{setShowEditModal(false)}}
            shareAssets={updateLink}
            getShareLink={()=>{}}
            currentShareLink={currentLink}
            title={'Update shared link'}
        />
    </>
}
