import styles from './index.module.css'
import {useEffect, useState} from "react"
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

// Utils
import toastUtils from '../../../utils/toast'
import ConfirmModal from "../modals/confirm-modal";
import ShareModal from "../modals/share-modal";

// Constants
import { statusList } from "../../../constants/shared-links";
import {Waypoint} from "react-waypoint";


export default function ShareLinks(){
    const availableColors = ['pink', 'green', 'yellow', 'orange']

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

    const getFilterObject = () => {
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

    const getRandomColor = () => {
        const index =  Math.floor(Math.random() * (availableColors.length ? availableColors.length-1 : 0));
        return availableColors[index]
    }

    const getLinks  = async (filter) => {
        // Show loading
        setLoading(true)
        const promises = [sharedLinksApi.getSharedByList(), sharedLinksApi.getSharedWithList() , sharedLinksApi.getSharedLinks(filter)]

        const results = await Promise.all(promises)

        let { data } = results[2]

        setNextPage(data.next)

        setShareByList(results[0].data.map((item)=>{return {label: item, value: item}}))
        setShareWithList(results[1].data.map((item)=>{return {label: item, value: item}}))
        setLinks(data.results)

        setLoading(false)
    }

    const deleteLink = async () => {
        // Show loading
        setLoading(true)

        await sharedLinksApi.deleteLink(deleteId)

        getLinks(getFilterObject());
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
                expiredPeriod: sharedLinkData.expiredPeriod.value,
            })

            getLinks(getFilterObject());
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
            })
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
            page: 1
        })
    },[sharedBy, sharedWith, status])

    return <>
       <div className={`row ${styles['header']}`}>
            <div className={"col-10 d-flex align-items-center"}>
                Filters
            </div>
            <div className={"col-30"}>
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
            <div className={"col-30"}>
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
            <div className={"col-30"}>
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
            <div className={"col-10"}>
                Date Created
            </div>
            <div className={"col-20"}>
                Name
            </div>
            <div className={"col-20"}>
                Shared By
            </div>
            <div className={"col-20"}>
                Link
            </div>
            <div className={"col-10"}>
                Share With
            </div>
            <div className={"col-10"}>
                Expiration Date
            </div>
            <div className={"col-10"}>

            </div>
        </div>}

        {links.map((link, index)=>{
            return <div className={`row align-center ${styles['data-row']}`} key={index}>
                <div className={"col-10 d-flex align-items-center"}>
                    {moment(link.createdAt).format('MM/DD/YY')}
                </div>
                <div className={"col-20 d-flex align-items-center"}>
                    <span className={`${styles[`name-tag-${getRandomColor()}`]}`}>{link.name}</span>
                </div>
                <div className={"col-20 d-flex align-items-center"}>
                    <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                    <span className={"m-l-5"}>{link.user.name}</span>
                </div>
                <div className={"col-20 d-flex align-items-center word-break-text"}>
                    <span>{link.sharedLink}</span>
                    <IconClickable additionalClass={`${styles['action-button']} m-l-5 cursor-pointer`}
                                   src={AssetOps[`copy${''}`]}
                                   tooltipText={'Copy'}
                                   tooltipId={'Copy'}
                                   onClick={()=>{
                                       copy(link.sharedLink)
                                       toastUtils.bottomSuccess('Link copied')
                                   }}/>
                </div>
                <div className={"col-10 d-flex align-items-center"}>
                    <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                    <span className={"m-l-5 font-weight-600"}>{link.sharedCount}</span>
                </div>
                <div className={"col-10 d-flex align-items-center"}>
                    {moment(link.expiredAt).format('MM/DD/YY')}
                </div>
                <div className={"col-10 d-flex align-items-center"}>
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
