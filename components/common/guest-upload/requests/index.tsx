import styles from './index.module.css'
import {useEffect, useState} from "react"
import moment from "moment"

import { requestStatus } from "../../../../constants/guest-upload";

import GuestUploadApprovalOverlay from "../../guest-upload-approval-overlay";

const requestData = [
    {
        date: new Date(),
        name: 'Meredith Demo',
        note: 'next month\'s campaign?',
        status: 0,
        expiredAt: new Date()
    },
    {
        date: new Date(),
        name: 'Meredith Demo',
        note: 'next month\'s campaign?',
        status: 1,
        expiredAt: new Date()
    },
    {
        date: new Date(),
        name: 'Meredith Demo',
        note: 'next month\'s campaign?',
        status: 2,
        expiredAt: new Date()
    }

]


export default function Requests(){
    const [requests, setRequests] = useState([])
    const [showReviewModal, setShowReviewModal] = useState(false)

    const getRequests  = async () => {
        setRequests(requestData)
    }

    useEffect(()=>{
        getRequests()
    },[])

    return <>
        {requests.map((request, index)=>{
            return <div
                className={`row ${styles['data-row']} ${index === requests.length - 1 ? '' : styles['ghost-line']}`}
                key={index}>
                <div className={`col-10 ${styles['time-col']}`}>
                    <p>{moment(request.date).format('MMM DD')}</p>
                    <p>{moment(request.date).format('LT')}</p>
                </div>
                <div className={`col-30 ${styles['name-col']}`}>
                    <p>{request.name}</p>
                    <p className={styles['description-text']}>{request.note}</p>
                </div>
                <div className={'col-10 align-center'}>
                    <span className={'underline-text pointer'} onClick={()=>{setShowReviewModal(true)}}>Review</span>
                </div>
                <div className={'col-20 align-center'}>
                    <span className={'italic-text'}>{requestStatus[request.status]}</span>
                </div>
                <div className={'col-30 align-center'}>
                    Expires {moment(request.expiredAt).format('MM/DD/YYYY')}
                </div>
            </div>
        })}

        {showReviewModal && <GuestUploadApprovalOverlay
            handleBackButton={()=>{setShowReviewModal(false)}}
            selectedAssets={[]}
        />}

    </>
}
