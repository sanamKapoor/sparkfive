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

	return (
		<Base
			modalIsOpen={modalIsOpen}
			closeModal={closemoveModal}
			confirmText={'Share'}
			headText={title ? title : `Share ${itemsAmount} item(s)`}
			disabledConfirm={!recipients}
			confirmAction={() => {
				shareAssets(recipients, message)
				closemoveModal()
			}} >
			<div className={`${styles['input-wrapper']} d-flex align-items-center`}>
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
			<div className={styles['input-wrapper']}>
				<Input placeholder={'Emails separated with comma'} onChange={e => setRecipients(e.target.value)} styleType={'regular-short'} />
			</div>
			<div className={styles['input-wrapper']}>
				<TextArea placeholder={'Add a message (optional)'} rows={7} onChange={e => setMessage(e.target.value)} styleType={'regular-short'} noResize={true}/>
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
