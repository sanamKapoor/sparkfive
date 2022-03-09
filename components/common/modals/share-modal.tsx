import styles from './share-modal.module.css'
import {useEffect, useState} from 'react'
import copy from 'copy-to-clipboard'
import moment from 'moment'

// Components
import Base from '../../common/modals/base'
import Input from '../../common/inputs/input'
import TextArea from '../../common/inputs/text-area'
import IconClickable from '../../common/buttons/icon-clickable'
import { AssetOps } from '../../../assets'

import toastUtils from '../../../utils/toast'
import { Utilities } from '../../../assets'
import Select from "../inputs/select";

import { expireOptions} from "../../../constants/shared-links";
import Spinner from "../spinners/spinner";

const getDayToCurrentDate = (day: number = 1) => {
	return new Date(moment()
		.add(day,'d')
		.toDate());
}

const ShareModal = ({ modalIsOpen, closeModal, itemsAmount = 0, shareAssets, title = '', getShareLink = () => {}, currentShareLink = undefined  }) => {

	const [recipients, setRecipients] = useState('')
	const [message, setMessage] = useState('')
	const [url, setUrl] = useState("")
	const [name, setName] = useState("")
	const [isPublic, setIsPublic] = useState(true)
	const [expired, setExpired] = useState(true)
	const [expiredPeriod, setExpiredPeriod] = useState(expireOptions[1])
	const [expiredAt, setExpiredAt] = useState(getDayToCurrentDate(expireOptions[1].value))
	const [shareJWT, setShareJWT] = useState("")
	const [hash, setHash] = useState("")
	const [sharable, setSharable] = useState(false)
	const [shareId, setShareId] = useState("")
	// const [name, setName]
	//
	// recipients,
	// 	shareJWT,
	// 	message,
	// 	name,
	// 	sharedLink,
	// 	isPublic,
	// 	expired,
	// 	expiredPeriod,
	// 	expiredAt,
	// 	sharable,
	// 	status,
	// 	shareId

	const closemoveModal = () => {
		setRecipients('')
		setMessage('')
		setUrl('')
		setName('')
		setIsPublic(false)
		setExpired(true)
		setExpiredPeriod(expireOptions[1])
		setExpiredAt(getDayToCurrentDate(expireOptions[1].value))
		setShareJWT("")
		setHash("")
		setSharable(false)
		setShareId("")
		closeModal()
	}

	const getInitialSharedLink = async () => {
		try{
			// @ts-ignore
			const { data } = await getShareLink()

			// @ts-ignore
			setUrl(data.tinyUrlData.data?.tiny_url || "")
			setShareJWT(data.tinyUrlData.shareJWT)
			setHash(data.tinyUrlData.hash)
			if(data.currentSharedLinks){
				setExpiredPeriod(expireOptions.filter(
					(item)=>item.value === parseInt(data.currentSharedLinks.expiredPeriod))[0]
				)
				setExpiredAt(new Date(data.currentSharedLinks.expiredAt))
				setExpired(data.currentSharedLinks.expired)
				setName(data.currentSharedLinks.name)
				setRecipients(data.currentSharedLinks.sharedEmails)
				setShareId(data.currentSharedLinks.id)
				setIsPublic(data.currentSharedLinks.isPublic)
				setMessage(data.currentSharedLinks.message)
				setSharable(data.currentSharedLinks.sharable)
			}
		}catch (e){
			setUrl("")
		}

	}

	const loadExistedShareLink = (data) => {
		// @ts-ignore
		setUrl(data.sharedLink)
		setShareJWT(data.shareJwt)
		setHash(data.hash)
		setExpiredPeriod(expireOptions.filter(
			(item)=>item.value === parseInt(data.expiredPeriod))[0]
		)
		setExpiredAt(new Date(data.expiredAt))
		setExpired(data.expired)
		setName(data.name)
		setRecipients(data.sharedEmails)
		setShareId(data.id)
		setIsPublic(data.isPublic)
		setMessage(data.message)
		setSharable(data.sharable)
	}

	useEffect(()=>{
		if(modalIsOpen){
			// Show to edit
			if(currentShareLink){
				loadExistedShareLink(currentShareLink)
			}else{
				getInitialSharedLink()
			}
		}else{
			setUrl("")
		}

	},[modalIsOpen])

	const mode = "resize"

	return (
		<Base
			modalIsOpen={modalIsOpen}
			closeModal={closemoveModal}
			confirmText={currentShareLink ? 'Save Changes' : 'Share'}
			headText={title ? title : `Share ${itemsAmount} item(s)`}
			disabledConfirm={!name}
			additionalClasses={['visible-block']}
			confirmAction={() => {
				shareAssets(
					recipients,
					message,
					{sharedLink: url, shareJWT, hash, name, isPublic, expired, expiredPeriod, expiredAt, sharable, shareId}
					)
				closemoveModal()
			}} >

			{!url && <Spinner className={styles['spinner']}/>}
			{url && <>
				<div className={`${styles['input-wrapper']} d-flex align-items-center`}>
					<Input
						value={name}
						onChange={(e)=>{setName(e.target.value)}}
						additionalClasses={"w-50 m-r-15"}
						placeholder={'Name your share link'}
						styleType={'regular-short'}
					/>
					{/*<Button*/}
					{/*	text={"Save"}*/}
					{/*	onClick={()=>{}}*/}
					{/*	type='button'*/}
					{/*	styleType='primary'*/}
					{/*	disabled={name === ''}*/}
					{/*/>*/}
					<span className={'m-l-10'}>(required)</span>
				</div>

				<div className={`${styles['input-wrapper']} d-flex align-items-center p-t-0`}>
					<Input additionalClasses={"w-50 m-r-15"} disabled={!url} placeholder={'Loading share link...'} value={url} styleType={'regular-short'} />
					<IconClickable additionalClass={`${styles['action-button']} m-r-5 cursor-pointer`}
								   src={AssetOps[`copy${''}`]}
								   tooltipText={'Copy'}
								   tooltipId={'Copy'}
								   onClick={()=>{
									   copy(url)
									   toastUtils.bottomSuccess('Link copied')
								   }}/>
					<span className={"cursor-pointer"} onClick={()=>{
						copy(url)
						toastUtils.bottomSuccess('Link copied')
					}}>Copy Link</span>
				</div>

				<div className={styles['input-wrapper']} >
					<div className={`${styles.title}`}>Permission Settings</div>
					<div className={styles['field-content']}>
						<div className={styles['field-radio-wrapper']}>
							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={isPublic ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{setIsPublic(true)}} />
								<div className={'font-12 m-l-15'}>Anyone with link</div>
							</div>

							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={!isPublic ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{setIsPublic(false)}} />
								<div className={'font-12 m-l-15'}>Restrict access by email address</div>
							</div>
						</div>
					</div>
				</div>

				{!isPublic && <div className={styles['input-wrapper']}>
					<div className={styles['field-content']}>
						<Input value={recipients} placeholder={'Emails separated with comma'} onChange={e => setRecipients(e.target.value)} styleType={'regular-short'} />
					</div>
				</div>}

				<div className={styles['input-wrapper']} >
					<div className={`${styles.title}`}>Expiration Settings</div>
					<div className={styles['field-content']}>
						<div className={styles['field-radio-wrapper']}>
							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={expired ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{setExpired(true)}} />
								<div className={'font-12 m-l-15'}>On</div>
							</div>

							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={!expired ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{setExpired(false)}} />
								<div className={'font-12 m-l-15'}>Off</div>
							</div>
						</div>
					</div>
				</div>

				{expired && <div className={`${styles['input-wrapper']} d-flex align-items-center`}>
					<div className={`${styles['field-content']} w-50 align-center`}>
						<Select
							options={expireOptions}
							onChange={(value)=>{setExpiredPeriod(value); setExpiredAt(getDayToCurrentDate(value.value))}}
							placeholder={'Select expire time'}
							styleType='regular'
							value={expiredPeriod}
						/>
						{/*<Input additionalClasses={"w-50 m-r-15"} disabled={!url} placeholder={'Loading share link...'} value={url} styleType={'regular-short'} />*/}
						<span className={"font-12 m-l-15"}>{expiredAt.toDateString()}</span>
					</div>
				</div>}

				<div className={styles['input-wrapper']} >
					<div className={`${styles.title}`}>Share from Sparkfive</div>
					<div className={styles['field-content']}>
						<div className={styles['field-radio-wrapper']}>
							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={sharable ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{setSharable(true)}} />
								<div className={'font-12 m-l-15'}>On</div>
							</div>

							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={!sharable ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{setSharable(false)}} />
								<div className={'font-12 m-l-15'}>Off</div>
							</div>
						</div>
					</div>
				</div>

				{sharable && <div className={styles['input-wrapper']}>
					<div className={styles['field-content']}>
						<TextArea
							value={message}
							placeholder={'Add a message (optional)'}
							rows={7}
							onChange={e => setMessage(e.target.value)}
							styleType={'regular-short'}
							noResize={true}
						/>
					</div>
				</div>}
			</>}



		</Base >)
}

interface Props{
	modalIsOpen: boolean;
	closeModal: () => void;
	itemsAmount: number;
	shareAssets: (recipients: string, message: string) => void;
	title?: string;
}

export default ShareModal
