import { useState } from 'react'
import { AssetOps, Utilities } from '../../../assets'
import IconClickable from '../buttons/icon-clickable'
import Dropdown from '../inputs/dropdown'
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import ConfirmModal from '../modals/confirm-modal'
import AssetAddition from './asset-addition'
import styles from './asset-related-files-list.module.css'
import { format } from 'date-fns'
import fileSize from 'filesize'
import AssetIcon from './asset-icon'

const AssetRelatedFilesList = ({relatedAssets}) => {
    const [deleteModaOpen, setDeleteModalOpen] = useState(false)

    const options = [
        { label: 'Download', onClick: () => alert('download') },
        { label: 'Dissociate', onClick: () => alert('dissociate') },
        { label: 'Delete', onClick: () => setDeleteModalOpen(true) }
    ]

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <h2>Related Files</h2>
                <div className={styles.actions}>
                    <IconClickable src={AssetOps.download} />
                    <IconClickable src={AssetOps.share} />
                    <AssetAddition />
                </div>
            </div>

            <ul>
                {relatedAssets?.map((asset, i) => (
                    <li className={styles.item} key={i}>
                        <div className={styles['item-wrapper']}>
                            <div className={styles.thumbnail}>
                                {asset.thumbailUrl && <img src={asset.thumbailUrl || Assets.unknown} alt={name} />}
                                {!asset.thumbailUrl && <AssetIcon extension={asset.extension} onList={true} />}
                            </div>
                            <div className={styles['info-wrapper']}>
                                <div>
                                    <div className={styles.name}>{asset.name}</div>
                                    <div className={styles.dimension}>{asset.dimension}</div>
                                    <div className={styles.info}>{asset.createdAt}<span></span>{asset.size}</div>
                                </div>

                                <>
                                    <ToggleableAbsoluteWrapper
                                        contentClass={styles['item-actions']}
                                        wrapperClass={styles['item-actions-wrapper']}
                                        Wrapper={({ children }) => (
                                            <>
                                                <IconClickable src={Utilities.moreLight} />
                                                {children}
                                            </>
                                        )}
                                        Content={() => (
                                            <div className={styles.more} >
                                                <Dropdown
                                                    options={options}
                                                />
                                            </div>
                                        )}
                                    />

                                    <ConfirmModal
                                        closeModal={() => setDeleteModalOpen(false)}
                                        confirmAction={() => alert('confirm')}
                                        confirmText={'Yes'}
                                        message={
                                            <span>
                                                Are you sure you want to Delete?
                                            </span>
                                        }
                                        modalIsOpen={deleteModaOpen}
                                    />
                                </>



                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AssetRelatedFilesList