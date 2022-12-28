import { capitalCase } from 'change-case'
import styles from './confirm-with-rename-modal.module.css'

// Components
import Base from './base'
import Button from '../buttons/button'
import Input from "../inputs/input";
import {useEffect, useState} from "react";

// Used for the future
const ConfirmModal = ({ modalIsOpen, closeModal, message, secondMessage = '', confirmText, confirmAction, textContentClass = '', closeButtonClass = '', initialValue = '' }) => {
  const [renameInput, setRenameInput] = useState('')

  useEffect(() => {
    if (initialValue) {
      setRenameInput(initialValue)
    }
  }, [modalIsOpen, initialValue])

  return (
  <Base
    modalIsOpen={modalIsOpen}
    closeModal={closeModal}
  >
    <div className={`${styles.text} ${textContentClass}`}>
      <span>{message}</span>
      <Input placeholder={'Enter name'} onChange={e => setRenameInput(e.target.value)} value={renameInput} styleType={'regular-short'} />
      <span>{secondMessage}</span>
      <span className={`${styles.close} ${closeButtonClass}`} onClick={closeModal}>x</span>
    </div>
    <div className={styles.buttons}>
      <div>
        <Button
          text='Cancel'
          onClick={closeModal}
          type='button'
          styleType='secondary'
        />
      </div>
      <div>
        <Button
          text={confirmText}
          onClick={()=>{confirmAction(renameInput)}}
          type='button'
          styleType='primary'
        />
      </div>
    </div>
  </Base>
)}

export default ConfirmModal
