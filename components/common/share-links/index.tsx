import styles from './index.module.css'
import {useEffect, useState} from "react"
import moment from "moment"

import GuestUploadApprovalOverlay from "../guest-upload-approval-overlay";
import SpinnerOverlay from "../spinners/spinner-overlay";

// APIs
import guestUploadApi from '../../../server-api/guest-upload'
import Select from "../inputs/select";
import copy from "copy-to-clipboard";
import IconClickable from "../buttons/icon-clickable";

import { AssetOps } from '../../../assets'
import UserPhoto from "../user/user-photo";


export default function ShareLinks(){
    const [requests, setRequests] = useState([])
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [loading, setLoading] = useState(true)

    const [loadingAssets, setLoadingAssets] = useState(false)
    const [assets, setAssets] = useState([])
    const [requestInfo, setRequestInfo] = useState('')

    const getRequests  = async () => {
        // Show loading
        setLoading(true)

        let { data } = await guestUploadApi.getRequests({isAll: 1, sort: 'createdAt,asc'})

        setRequests(data)

        setLoading(false)
    }

    const getRequestAssets = async (id, requestInfo) => {
        setRequestInfo(requestInfo)

        setLoadingAssets(true)
        setShowReviewModal(true)

        // Call APi to get data
        let { data } = await guestUploadApi.getRequestAssets(id)

        // Set data
        setAssets(data)


        setLoadingAssets(false)
    }

    useEffect(()=>{
        getRequests()
    },[])

    return <>
        <div className={`row ${styles['header']}`}>
            <div className={"col-10 d-flex align-items-center"}>
                Filters
            </div>
            <div className={"col-30"}>
                <Select
                    options={[]}
                    onChange={()=>{}}
                    placeholder={'Share by'}
                    styleType='regular'
                    value={''}
                />
            </div>
            <div className={"col-30"}>
                <Select
                    options={[]}
                    onChange={()=>{}}
                    placeholder={'Share with'}
                    styleType='regular'
                    value={''}
                />
            </div>
            <div className={"col-30"}>
                <Select
                    options={[]}
                    onChange={()=>{}}
                    placeholder={'Status'}
                    styleType='regular'
                    value={''}
                />
            </div>
        </div>
        {requests.length === 0 && <div className={'row align-center justify-content-center'}>
            No data
        </div>}
        <div className={`row align-center ${styles['row-heading']} font-weight-600`}>
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
        </div>

        <div className={`row align-center ${styles['data-row']}`}>
            <div className={"col-10 d-flex align-items-center"}>
                01/14/22
            </div>
            <div className={"col-20 d-flex align-items-center"}>
                <span className={`${styles['name-tag-pink']}`}>International Custom Group</span>
            </div>
            <div className={"col-20 d-flex align-items-center"}>
                <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                <span className={"m-l-5"}>Tiffany Swift</span>
            </div>
            <div className={"col-20 d-flex align-items-center"}>
                <span>https://share.sparkfive.com?oadskfjdf</span>
                <IconClickable additionalClass={`${styles['action-button']} m-l-5 cursor-pointer`}
                               src={AssetOps[`copy${''}`]}
                               tooltipText={'Copy'}
                               tooltipId={'Copy'}
                               onClick={()=>{
                               }}/>
            </div>
            <div className={"col-10 d-flex align-items-center"}>
                <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                <span className={"m-l-5 font-weight-600"}>16</span>
            </div>
            <div className={"col-10 d-flex align-items-center"}>
                05/07/22
            </div>
            <div className={"col-10 d-flex align-items-center"}>
                <IconClickable additionalClass={styles['action-button']} src={AssetOps[`edit`]} tooltipText={'Edit'} tooltipId={'Edit'} onClick={() => {}} />
                <IconClickable additionalClass={`${styles['action-button']} m-l-10`} src={AssetOps[`delete`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => {}} />
            </div>
        </div>

        <div className={`row align-center ${styles['data-row']}`}>
            <div className={"col-10 d-flex align-items-center"}>
                01/14/22
            </div>
            <div className={"col-20 d-flex align-items-center"}>
                <span className={`${styles['name-tag-green']}`}>International Custom Group</span>
            </div>
            <div className={"col-20 d-flex align-items-center"}>
                <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                <span className={"m-l-5"}>Tiffany Swift</span>
            </div>
            <div className={"col-20 d-flex align-items-center"}>
                <span>https://share.sparkfive.com?oadskfjdf</span>
                <IconClickable additionalClass={`${styles['action-button']} m-l-5 cursor-pointer`}
                               src={AssetOps[`copy${''}`]}
                               tooltipText={'Copy'}
                               tooltipId={'Copy'}
                               onClick={()=>{
                               }}/>
            </div>
            <div className={"col-10 d-flex align-items-center"}>
                <UserPhoto photoUrl={""} extraClass={styles.profile} sizePx={18} />
                <span className={"m-l-5 font-weight-600"}>16</span>
            </div>
            <div className={"col-10 d-flex align-items-center"}>
                05/07/22
            </div>
            <div className={"col-10 d-flex align-items-center"}>
                <IconClickable additionalClass={styles['action-button']} src={AssetOps[`edit`]} tooltipText={'Edit'} tooltipId={'Edit'} onClick={() => {}} />
                <IconClickable additionalClass={`${styles['action-button']} m-l-10`} src={AssetOps[`delete`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={() => {}} />
            </div>
        </div>

        {loading && <SpinnerOverlay />}

        {showReviewModal && <GuestUploadApprovalOverlay
            handleBackButton={()=>{getRequests(); setShowReviewModal(false)}}
            selectedAssets={assets}
            loadingAssets={loadingAssets}
            requestInfo={requestInfo}
        />}

    </>
}
