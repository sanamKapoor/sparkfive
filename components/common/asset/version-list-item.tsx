import styles from './version-list.module.css'
import { Assets } from '../../../assets'
import IconClickable from '../buttons/icon-clickable'
import Dropdown from '../inputs/dropdown'
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import { Utilities } from '../../../assets'
import ConfirmModal from '../modals/confirm-modal'
import { useState } from 'react'

const VersionListItem = ({
    current,
    version,
    currentAction,
    downloadAction,
    deleteAction
}) => {

    const [ currentModaOpen, setCurrentModalOpen ] = useState(false)

    const { name, src, author, date, size, versionNumber } = version

    const options = [
        { label: 'Make Current', onClick: () => setCurrentModalOpen(true) },
        { label: 'Download', onClick: downloadAction },
        { label: 'Delete', onClick: deleteAction }
    ]

    return (
        <li className={styles.item}>
            <h6>{current ? 'Current Version' : versionNumber}</h6>
            <div className={styles['item-wrapper']}>
                <div className={styles.thumbnail}>
                    <img src={src || Assets.unknown} alt={name} />
                </div>
                <div className={styles['info-wrapper']}>
                    <div>
                        <div className={styles.name}>{name}</div>
                        <div className={styles.author}>by: {author}</div>
                        <div className={styles.info}>{date}<span></span>{size}</div>
                    </div>
                    {!current &&

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
                                closeModal={() => setCurrentModalOpen(false)}
                                confirmAction={currentAction}
                                confirmText={'Yes'}
                                message={
                                    <span>
                                        Are you sure you want to make this version &nbsp;<b>Current</b>?
                                    </span>
                                }
                                modalIsOpen={currentModaOpen}
                            />
                        </>

                    }

                </div>
            </div>
        </li>
    )
}

export default VersionListItem