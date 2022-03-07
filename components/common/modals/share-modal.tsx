import styles from './share-modal.module.css'
import {useEffect, useState} from 'react'
import copy from 'copy-to-clipboard'

// Components
import Base from '../../common/modals/base'
import Input from '../../common/inputs/input'
import TextArea from '../../common/inputs/text-area'
import IconClickable from '../../common/buttons/icon-clickable'
import { AssetOps } from '../../../assets'

import toastUtils from '../../../utils/toast'
import Button from "../buttons/button";
import ReactTooltip from "react-tooltip";
import { Utilities } from '../../../assets'
import Select from "../inputs/select";

const ShareModal = ({ modalIsOpen, closeModal, itemsAmount, shareAssets, title, getShareLink = () => {} }) => {

	const [recipients, setRecipients] = useState('')
	const [message, setMessage] = useState('')
	const [url, setUrl] = useState("")

	const closemoveModal = () => {
		setRecipients('')
		setMessage('')
		closeModal()
	}

	const getInitialSharedLink = async () => {
		try{
			// @ts-ignore
			const { data } = await getShareLink()

			// @ts-ignore
			setUrl(data.data?.tiny_url || "")
		}catch (e){
			setUrl("")
		}

	}

	useEffect(()=>{
		if(modalIsOpen){
			getInitialSharedLink()
		}else{
			setUrl("")
		}

	},[modalIsOpen])

	const mode = "resize"

	return (
		<Base
			modalIsOpen={modalIsOpen}
			closeModal={closemoveModal}
			confirmText={'Share'}
			headText={title ? title : `Share ${itemsAmount} item(s)`}
			disabledConfirm={!recipients}
			additionalClasses={['visible-block']}
			confirmAction={() => {
				shareAssets(recipients, message)
				closemoveModal()
			}} >

			<div className={`${styles['input-wrapper']} d-flex align-items-center`}>
				<Input additionalClasses={"w-50 m-r-15"} disabled={!url} placeholder={'Name your share link'} value={""} styleType={'regular-short'} />
				<Button
					text={"Save"}
					onClick={()=>{}}
					type='button'
					styleType='primary'
					disabled={false}
				/>
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
								src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
								additionalClass={styles['select-icon']}
								onClick={()=>{}} />
							<div className={'font-12 m-l-15'}>Anyone with link</div>
						</div>

						<div className={`${styles['radio-button-wrapper']} m-r-15`}>
							<IconClickable
								src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
								additionalClass={styles['select-icon']}
								onClick={()=>{}} />
							<div className={'font-12 m-l-15'}>Restrict access by email address</div>
						</div>
					</div>
				</div>
			</div>

			<div className={styles['input-wrapper']}>
				<div className={styles['field-content']}>
					<Input placeholder={'Emails separated with comma'} onChange={e => setRecipients(e.target.value)} styleType={'regular-short'} />
				</div>
			</div>

			<div className={styles['input-wrapper']} >
				<div className={`${styles.title}`}>Expiration Settings</div>
				<div className={styles['field-content']}>
					<div className={styles['field-radio-wrapper']}>
						<div className={`${styles['radio-button-wrapper']} m-r-15`}>
							<IconClickable
								src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
								additionalClass={styles['select-icon']}
								onClick={()=>{}} />
							<div className={'font-12 m-l-15'}>On</div>
						</div>

						<div className={`${styles['radio-button-wrapper']} m-r-15`}>
							<IconClickable
								src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
								additionalClass={styles['select-icon']}
								onClick={()=>{}} />
							<div className={'font-12 m-l-15'}>Off</div>
						</div>
					</div>
				</div>
			</div>

			<div className={`${styles['input-wrapper']} d-flex align-items-center`}>
				<div className={`${styles['field-content']} w-50 align-center`}>
					<Select
						options={[]}
						onChange={()=>{}}
						placeholder={'Select expire time'}
						styleType='regular'
						value={''}
					/>
					{/*<Input additionalClasses={"w-50 m-r-15"} disabled={!url} placeholder={'Loading share link...'} value={url} styleType={'regular-short'} />*/}
					<span className={"font-12 m-l-15"}>{new Date().toDateString()}</span>
				</div>
			</div>

			<div className={styles['input-wrapper']} >
				<div className={`${styles.title}`}>Share from Sparkfive</div>
				<div className={styles['field-content']}>
					<div className={styles['field-radio-wrapper']}>
						<div className={`${styles['radio-button-wrapper']} m-r-15`}>
							<IconClickable
								src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
								additionalClass={styles['select-icon']}
								onClick={()=>{}} />
							<div className={'font-12 m-l-15'}>On</div>
						</div>

						<div className={`${styles['radio-button-wrapper']} m-r-15`}>
							<IconClickable
								src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
								additionalClass={styles['select-icon']}
								onClick={()=>{}} />
							<div className={'font-12 m-l-15'}>Off</div>
						</div>
					</div>
				</div>
			</div>

			<div className={styles['input-wrapper']}>
				<div className={styles['field-content']}>
					<TextArea placeholder={'Add a message (optional)'} rows={7} onChange={e => setMessage(e.target.value)} styleType={'regular-short'} noResize={true}/>
				</div>
			</div>
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
