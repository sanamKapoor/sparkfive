import styles from './image-preview-modal.module.css'
import { useState, useEffect } from 'react'

// Components
import Base from './base'
import Button from "../buttons/button";

const ImagePreviewModal = ({ modalIsOpen, closeModal, url }) => {

    return (
        <Base
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            headText={``}
            confirmAction={async () => {
                closeModal()
            }} >
            <div className={styles['modal-wrapper']}>
                <div className={`${styles.text} ${styles['close-modal-btn']}`}>
                    <p>
                    </p>
                    <span className={`${styles.close} ${styles['confirm-modal-text']}`} onClick={closeModal}>x</span>
                </div>
                <img src={url} alt={'preview-image'} />
            </div>
        </Base >
    )
}

export default ImagePreviewModal
