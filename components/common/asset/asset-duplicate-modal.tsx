import Base from '../modals/base'
import AssetDuplicateItem from './asset-duplicate-item'
import styles from './asset-duplicate-modal.module.css'

const AssetDuplicateModal = ({modalIsOpen, closeModal, confirmAction}) => {

    return (
        <Base
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            confirmText={'Done'}
			headText={'(4) Duplicates Detected'}
			// disabledConfirm={}
			additionalClasses={['visible-block']}
			showCancel={false}
			confirmAction={confirmAction}
        >
            <div className={styles.container}>
                <p>
                    The following file(s) already exists in your account.
                    Do you want to use this uploaded version as the current version, change the filename or cancel the upload of these specific files?
                </p>
                <AssetDuplicateItem file={'ImageExample_1.png'} />
                <AssetDuplicateItem file={'ImageExample__2.png'} />
            </div>
        </Base>
    )
}

export default AssetDuplicateModal