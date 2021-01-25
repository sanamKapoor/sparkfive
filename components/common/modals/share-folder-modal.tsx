import styles from './share-folder-modal.module.css'
import { useEffect, useState, useContext } from 'react'
import { TeamContext } from '../../../context'
import { snakeCase } from 'change-case'
import copy from 'copy-to-clipboard'
import { Utilities } from '../../../assets'

// Components
import Base from '../../common/modals/base'
import Button from '../../common/buttons/button'
import Input from '../../common/inputs/input'
import TextArea from '../../common/inputs/text-area'
import Select from '../../common/inputs/select'
import IconClickable from '../../common/buttons/icon-clickable'

const SHARE_STATUSES = [
  {
    label: 'Disabled',
    value: 'disabled'
  },
  {
    label: 'Public (anyone with the link)',
    value: 'public'
  },
  {
    label: 'Private (password protected)',
    value: 'private'
  }
]

const ShareFolderModal = ({ modalIsOpen, closeModal, shareAssets, folder }) => {

  const { team } = useContext(TeamContext)

  const [recipients, setRecipients] = useState('')
  const [message, setMessage] = useState('')
  const [shareStatus, setShareStatus] = useState(null)
  const [sendNotification, setSendNotification] = useState(false)
  const [password, setPassword] = useState('')
  const [customUrl, setCustomUrl] = useState('')

  useEffect(() => {
    if (folder) {
      setShareStatus(SHARE_STATUSES.find(({ value }) => folder.shareStatus === value) || SHARE_STATUSES[0])
      setSendNotification(false)
      const splitShareUrl = folder.sharePath?.split('/')
      setCustomUrl(snakeCase(splitShareUrl ? splitShareUrl[splitShareUrl.length - 1] : folder.name))
    }
  }, [folder])

  const closemoveModal = () => {
    setRecipients('')
    setMessage('')
    setPassword('')
    closeModal()
  }

  const onSharestatusChange = (selected) => {
    setShareStatus(selected)
  }

  const onCustomUrlChange = (e) => {
    const inputValue = e.target.value
    const pattern = new RegExp(/^[-a-z\\d%_.~+]*$/)
    if (pattern.test(inputValue)) {
      setCustomUrl(inputValue)
    }
  }

  const idChars = folder?.id?.substring(0, 10)
  const shareUrl = `${process.env.CLIENT_BASE_URL}/collections/${team?.company ? snakeCase(team.company) : 'sparkfive'}/${idChars}/`

  const copyShareLink = () => copy(`${shareUrl}${customUrl}`)

  return (
    <Base
      modalIsOpen={modalIsOpen}
      closeModal={closemoveModal}
      confirmText={'Share'}
      headText={`Share ${folder?.name} collection`}
      disabledConfirm={!customUrl}
      confirmAction={() => {
        shareAssets({
          shareStatus: shareStatus.value,
          newPassword: password,
          customUrl,
          notificationSettings: {
            collection: folder.name,
            recipients,
            message,
            send: sendNotification
          }
        })
        closemoveModal()
      }} >
      <Select
        options={SHARE_STATUSES}
        onChange={onSharestatusChange}
        value={shareStatus}
        placeholder='Select share status'
      />
      {shareStatus?.value !== 'disabled' &&
        <>
          <div>
            <div>
              {shareUrl}
            </div>
            <Input onChange={onCustomUrlChange} styleType={'regular-short'} value={customUrl} />
          </div>
          <Button
            text='Copy Link'
            type='button'
            onClick={copyShareLink}
            styleType={'secondary'}
          />
        </>
      }
      {shareStatus?.value === 'private' &&
        <Input placeholder={'Share password'} onChange={e => setPassword(e.target.value)} styleType={'regular-short'} />
      }
      <div onClick={() => setSendNotification(!sendNotification)}>
        <IconClickable src={sendNotification ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal} />
          Send notification with link and password (if enabled)
        </div>
      {sendNotification &&
        <>
          <div className={styles['input-wrapper']}>
            <Input placeholder={'Emails separated with comma'} onChange={e => setRecipients(e.target.value)} styleType={'regular-short'} />
          </div>
          <div className={styles['input-wrapper']}>
            <TextArea placeholder={'Add a message (optional)'} rows={7} onChange={e => setMessage(e.target.value)} styleType={'regular-short'} noResize={true} />
          </div>
        </>
      }
    </Base >)
}

export default ShareFolderModal