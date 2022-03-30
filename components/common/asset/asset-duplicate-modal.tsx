import Base from '../modals/base'
import AssetDuplicateItem from './asset-duplicate-item'
import styles from './asset-duplicate-modal.module.css'

import { useState } from 'react'

const AssetDuplicateModal = ({duplicateNames=[], modalIsOpen, closeModal, confirmAction}) => {
    const [nameHistories, setNameHistories] = useState([])

	const onFileNameUpdate = (action, oldName, newName) => {
		const namesList = [...nameHistories]
        const fileItem = namesList.find(item => item.oldName === oldName)
        if (fileItem) {
            Object.assign(fileItem, {newName, action})
        } else {
            namesList.push({oldName, newName, action})
        }
        setNameHistories(namesList)
	}

    return (
        <Base
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            confirmText={'Done'}
			headText={`(${duplicateNames.length}) Duplicates Detected`}
			// disabledConfirm={}
			additionalClasses={['visible-block']}
			showCancel={false}
			confirmAction={() => confirmAction(nameHistories)}
        >
            <div className={styles.container}>
                <p>
                    The following file(s) already exists in your account.
                    Do you want to use this uploaded version as the current version, change the filename or cancel the upload of these specific files?
                </p>
                {
                    duplicateNames.map((fileName) => {
                        return (
                            <AssetDuplicateItem file={fileName} onFileNameUpdate={onFileNameUpdate} key={fileName} />
                        )
                    })
                }
            </div>
        </Base>
    )
}

export default AssetDuplicateModal