import styles from './share-modal.module.css'
import {useContext, useEffect, useRef, useState} from 'react'
import copy from 'copy-to-clipboard'
import moment from 'moment'
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DayPickerInput from "react-day-picker/DayPickerInput";
import {DateUtils} from "react-day-picker";

// Components
import Base from '../../common/modals/base'
import Input from '../../common/inputs/input'
import TextArea from '../../common/inputs/text-area'
import IconClickable from '../../common/buttons/icon-clickable'
import { AssetOps } from '../../../assets'
import Button from "../buttons/button";

import toastUtils from '../../../utils/toast'
import { Utilities } from '../../../assets'
import Select from "../inputs/select";

import { expireOptions} from "../../../constants/shared-links";
import Spinner from "../spinners/spinner";


import dateStyles from '../filter/date-uploaded.module.css'

// Contexts
import { LoadingContext } from '../../../context'

const getDayToCurrentDate = (day: number = 1) => {
	return new Date(moment()
		.add(day,'d')
		.toDate());
}

const FORMAT = 'MM/dd/yyyy';

const ShareModal = ({ modalIsOpen, closeModal, itemsAmount = 0, shareAssets, title = '', getShareLink = async(name, subCollection) => {}, currentShareLink = undefined, subCollectionShare = false  }) => {
	const { setIsLoading } = useContext(LoadingContext)

	const [recipients, setRecipients] = useState('')
	const [loading, setLoading] = useState(true)
	const [message, setMessage] = useState('')
	const [url, setUrl] = useState("")
	const [name, setName] = useState("")
	const [isPublic, setIsPublic] = useState(true)
	const [expired, setExpired] = useState(false)
	const [expiredPeriod, setExpiredPeriod] = useState(expireOptions[1])
	const [expiredAt, setExpiredAt] = useState(getDayToCurrentDate(expireOptions[1].value))
	const [shareJWT, setShareJWT] = useState("")
	const [hash, setHash] = useState("")
	const [sharable, setSharable] = useState(false)
	const [shareId, setShareId] = useState("")
	const [currentName, setCurrentName] = useState("") // To decide user can copy link or not
	const [basic, setBasic] = useState(true)
	const [collectionLink, setCollectionLink] = useState("")

	const [firstInit, setFirstInit] = useState(false)
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
		setBasic(true)
		setIsPublic(true)
		setExpired(false)
		setExpiredPeriod(expireOptions[1])
		setExpiredAt(getDayToCurrentDate(expireOptions[1].value))
		setShareJWT("")
		setHash("")
		setSharable(false)
		setShareId("")
		setCurrentName("")
		setCollectionLink("")
		setFirstInit(false)
		setLoading(true)
		closeModal()
	}

	const getInitialSharedLink = async (showInternalLoading = true) => {
		try{
			if(showInternalLoading){
				setLoading(true)
			}
			// @ts-ignore
			const { data } = await getShareLink(name, subCollectionShare)
			if(data.currentSharedLinks){
				setUrl(data.currentSharedLinks.sharedLink || "")
				setCollectionLink(data.currentSharedLinks.collectionLink || "")
				setShareJWT(data.currentSharedLinks.sharedJwt)
				setHash(data.currentSharedLinks.hash)
				setExpiredPeriod(expireOptions.filter(
					(item)=>item.value === parseInt(data.currentSharedLinks.expiredPeriod))[0]
				)
				if(data.currentSharedLinks.expiredAt){
					setExpiredAt(new Date(data.currentSharedLinks.expiredAt))
				}else{
					setExpiredAt(null)
				}

				setExpired(data.currentSharedLinks.expired !== undefined ? data.currentSharedLinks.expired : false) // default is false
				setName(data.currentSharedLinks.name)

				if(data.currentSharedLinks.name){
					setCurrentName(data.currentSharedLinks.name)
				}

				setRecipients(data.currentSharedLinks.sharedEmails)
				setShareId(data.currentSharedLinks.id)
				setIsPublic(data.currentSharedLinks.isPublic !== undefined ? data.currentSharedLinks.isPublic : true) // default is true

				if(subCollectionShare){
					setBasic(!data.currentSharedLinks.team.advancedCollectionShareLink) // default is true
				}

				setMessage(data.currentSharedLinks.message)
				setSharable(data.currentSharedLinks.sharable !== undefined ? data.currentSharedLinks.sharable : false) // default is false

				if(showInternalLoading){
					setLoading(false)
				}

				setIsLoading(false);

				setFirstInit(true)
			}else{
				setFirstInit(false)
				setIsLoading(false);
				if(showInternalLoading){
					setLoading(false)
				}
			}
		}catch (e){
			setUrl("")
			setCollectionLink("")
			setIsLoading(false);
			if(showInternalLoading){
				setLoading(false)
			}
		}

	}

	const loadExistedShareLink = (data) => {
		// @ts-ignore
		setUrl(data.sharedLink)
		setCollectionLink(data.collectionLink)
		setShareJWT(data.shareJwt)
		setHash(data.hash)
		if(!data.expiredPeriod){
			setExpiredPeriod(expireOptions[expireOptions.length-1])
		}else{
			setExpiredPeriod(expireOptions.filter(
				(item)=>item.value === parseInt(data.expiredPeriod))[0]
			)
		}

		if(data.expiredAt){
			setExpiredAt(new Date(data.expiredAt))
		}else{
			setExpiredAt(null)
		}

		// setExpiredAt(new Date(data.expiredAt))
		setExpired(data.expired)
		setName(data.name)
		if(data.name){
			setCurrentName(data.name)
		}
		setRecipients(data.sharedEmails)
		setShareId(data.id)
		setIsPublic(data.isPublic)
		if(subCollectionShare){
			setBasic(!data.team?.advancedCollectionShareLink) // default is true
		}

		setMessage(data.message)
		setSharable(data.sharable)

		setFirstInit(true)

		setLoading(false)
	}

	const formatDate = (date, format, locale) => {
		return dateFnsFormat(date, format, { locale });
	}

	const parseDate = (str, format, locale) => {
		const parsed = dateFnsParse(str, format, new Date(), { locale });
		if (DateUtils.isDate(parsed)) {
			return parsed;
		}
		return undefined;
	}

	// Save changes
	const saveChanges = async (field = "", isPublicValue = undefined, expiredValue = undefined, expiredPeriodValue = undefined, expiredAtValue = undefined, sharableValue = undefined) => {
		setIsLoading(true);

		// Link is not created yet due to lacking name, saving name then getting url back
		if(firstInit === false && field === "name"){
			getInitialSharedLink(false)
		}else{
			const { data } = await shareAssets(
				recipients,
				message,
				{
					sharedLink: url,
					shareJWT,
					hash,
					name,
					isPublic: isPublicValue === undefined ? isPublic : isPublicValue,
					expired: expiredValue === undefined ? expired : expiredValue,
					expiredPeriod: expiredPeriodValue === undefined ? expiredPeriod : expiredPeriodValue,
					expiredAt: expiredAtValue === undefined ? expiredAt : expiredAtValue,
					sharable: sharableValue === undefined ? sharable : sharableValue,
					shareId
				},
				false,
				false
			)

			if(field === "name"){
				if(data.name){
					setCurrentName(data.name)
				}
			}

			setIsLoading(false);
		}
	}

	const changeExpired =  (currentValue, nextValue) => {
		// Toggle
		if(currentValue!==nextValue){
			setExpired(nextValue)
			// Switch from off
			if(currentValue === false){
				// Set 60 days expired as default
				saveChanges("", undefined,nextValue, expireOptions[1], getDayToCurrentDate(expireOptions[1].value))
				setExpiredPeriod(expireOptions[1])
				setExpiredAt(getDayToCurrentDate(expireOptions[1].value))
			}else{
				saveChanges("", undefined,nextValue)
			}
		}
	}

	const changeIsPublic = (value) => {
		setIsPublic(value)

		saveChanges("", value)
	}

	const changeSharable = (value) => {
		setSharable(value)

		saveChanges("", undefined, undefined, undefined, undefined, value)
	}

	const changeExpiredAt  = (value) => {
		setExpiredAt(value)
		saveChanges("", undefined, undefined, undefined, value)
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
			setLoading(false)
		}

	},[modalIsOpen])

	// Listen radio button change to call api saving automatically
	// useEffect(()=>{
	// 	if(url && firstInit && !loading){
	// 		saveChanges();
	// 	}
	//
	// },[ expiredPeriod, expiredAt, sharable])

	return (
		<Base
			modalIsOpen={modalIsOpen}
			closeModal={closemoveModal}
			confirmText={sharable ? (currentShareLink ? 'Save Changes' : 'Send Email') : ''}
			headText={title ? title : `Share ${itemsAmount} item(s)`}
			disabledConfirm={!name}
			additionalClasses={['visible-block']}
			showCancel={false}
			confirmAction={() => {
				shareAssets(
					recipients,
					message,
					{sharedLink: url, shareJWT, hash, name, isPublic, expired, expiredPeriod, expiredAt, sharable, shareId, sendEmail: true}
					)
				closemoveModal()
			}} >

			{loading && <Spinner className={styles['spinner']}/>}
			{!loading && <>
			<div className={`${styles['input-wrapper']} d-flex align-items-center`}>
					<Input
						value={name}
						onChange={(e)=>{setName(e.target.value)}}
						additionalClasses={"w-50 m-r-15"}
						placeholder={'Name your share link'}
						styleType={'regular-short'}
					/>
					<Button
						text={"Save"}
						onClick={()=>{saveChanges("name")}}
						type='button'
						styleType='primary'
						disabled={name === ''}
					/>
					<span className={'m-l-10'}>(required)</span>
				</div>

			{basic && subCollectionShare && <div className={`${styles['input-wrapper']} d-flex align-items-center p-t-0`}>
					<Input
						additionalClasses={"w-50 m-r-15"}
						disabled={!collectionLink || !currentName}
						placeholder={''}
						value={currentName ? `${process.env.CLIENT_BASE_URL}/collections/${collectionLink}`: ""}
						styleType={'regular-short'} />
					<IconClickable additionalClass={`${styles['action-button']} m-r-5 cursor-pointer`}
								   src={AssetOps[`copy${''}`]}
								   tooltipText={'Copy'}
								   tooltipId={'Copy'}
								   onClick={()=>{
								   	if(currentName){
										copy(`${process.env.CLIENT_BASE_URL}/collections/${collectionLink}`)
										toastUtils.bottomSuccess('Link copied')
									}
								   }}/>
					<span className={"cursor-pointer"} onClick={()=>{
						if(currentName){
							copy(`${process.env.CLIENT_BASE_URL}/collections/${collectionLink}`)
							toastUtils.bottomSuccess('Link copied')
						}
					}}>Copy Link</span>
				</div>}

				{(!basic || (!subCollectionShare)) && <div className={`${styles['input-wrapper']} d-flex align-items-center p-t-0`}>
					<Input
						additionalClasses={"w-50 m-r-15"}
						disabled={!url || !currentName}
						placeholder={''}
						value={currentName ? url: ""}
						styleType={'regular-short'} />
					<IconClickable additionalClass={`${styles['action-button']} m-r-5 cursor-pointer`}
								   src={AssetOps[`copy${''}`]}
								   tooltipText={'Copy'}
								   tooltipId={'Copy'}
								   onClick={()=>{
									   if(currentName){
										   copy(url)
										   toastUtils.bottomSuccess('Link copied')
									   }
								   }}/>
					<span className={"cursor-pointer"} onClick={()=>{
						if(currentName){
							copy(url)
							toastUtils.bottomSuccess('Link copied')
						}
					}}>Copy Link</span>
				</div>}

				<div className={styles['input-wrapper']} >
					<div className={`${styles.title}`}>Permission Settings</div>
					<div className={styles['field-content']}>
						<div className={styles['field-radio-wrapper']}>
							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={isPublic ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{changeIsPublic(true)}} />
								<div className={'font-12 m-l-15'}>Anyone with link</div>
							</div>

							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={!isPublic ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{changeIsPublic(false)}} />
								<div className={'font-12 m-l-15'}>Restrict access by email address</div>
							</div>
						</div>
					</div>
				</div>

				{!isPublic && <div className={`${styles['input-wrapper']} d-flex align-items-center p-l-30`}>
					<TextArea
						value={recipients}
						placeholder={'Emails separated with comma'}
						rows={5}
						onChange={e => setRecipients(e.target.value)}
						additionalClasses={"m-r-15 m-l-30 font-12"}
						styleType={'regular-short'}
						noResize={true}
					/>
					{/*<Input*/}
					{/*	value={recipients}*/}
					{/*	placeholder={'Emails separated with comma'}*/}
					{/*	onChange={e => setRecipients(e.target.value)}*/}
					{/*	additionalClasses={"m-r-15 m-l-30"}*/}
					{/*	styleType={'regular-short'} />*/}

					<Button
						text={"Save"}
						onClick={saveChanges}
						type='button'
						styleType='primary'
						disabled={recipients === ''}
					/>
				</div>}

				<div className={styles['input-wrapper']} >
					<div className={`${styles.title}`}>Expiration Settings</div>
					<div className={styles['field-content']}>
						<div className={styles['field-radio-wrapper']}>
							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={expired ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{changeExpired(expired, true)}} />
								<div className={'font-12 m-l-15'}>On</div>
							</div>

							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={!expired ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{changeExpired(expired, false)}} />
								<div className={'font-12 m-l-15'}>Off</div>
							</div>
						</div>
					</div>
				</div>

				{expired && <div className={`${styles['input-wrapper']} d-flex align-items-center`}>
					<div className={`${styles['row-field-content']} row w-100`}>
						<div className={"col-50"}>
							<Select
								options={expireOptions}
								onChange={(value)=>{setExpiredPeriod(value); setExpiredAt(getDayToCurrentDate(value.value))}}
								placeholder={'Select expire time'}
								styleType='regular'
								value={expiredPeriod}
							/>
						</div>
						<div className={`col-50 d-flex align-items-center ${expiredPeriod?.value === 0 ? "flex-direction-column" : ""}`}>
							{expiredPeriod?.value === 0 && <div className={"row w-100 m-b-5"}>
								<DayPickerInput
									value={expiredAt}
									formatDate={formatDate}
									format={FORMAT}
									parseDate={parseDate}
									classNames={{
										container: dateStyles.input
									}}
									onDayChange={(day) => {changeExpiredAt(day)}}
									placeholder={'mm/dd/yyyy'}
									dayPickerProps={{
										className: dateStyles.calendar
									}}
								/>
							</div>}

							{/*<Input additionalClasses={"w-50 m-r-15"} disabled={!url} placeholder={'Loading share link...'} value={url} styleType={'regular-short'} />*/}
							<span className={"font-12 m-l-15 w-100"}>{expiredAt ? expiredAt.toDateString() : ""}</span>
						</div>
					</div>
				</div>}

				<div className={`${styles['input-wrapper']} ${sharable ? "" : "m-b-6rem"}`} >
					<div className={`${styles.title}`}>Share from Sparkfive</div>
					<div className={styles['field-content']}>
						<div className={styles['field-radio-wrapper']}>
							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={sharable ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{changeSharable(true)}} />
								<div className={'font-12 m-l-15'}>On</div>
							</div>

							<div className={`${styles['radio-button-wrapper']} m-r-15`}>
								<IconClickable
									src={!sharable ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
									additionalClass={styles['select-icon']}
									onClick={()=>{changeSharable(false)}} />
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
