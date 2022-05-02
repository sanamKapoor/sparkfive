import { useState } from 'react'
import { Utilities } from '../../../assets'
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import TextArea from '../inputs/text-area'
import styles from './asset-note-item.module.css'
import BaseModal from '../modals/base'

const AssetNoteItem = ({ title, note }) => {

    const [editMode, setEditMode] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className={styles.container}>
            <h4>{title}</h4>

            {editMode ? (
                <>
                    <TextArea
                        value={note}
                        rows={4}
                    />
                    <div className={styles.buttons}>
                        <Button
                            text={'Save changes'}
                            type={'button'}
                            styleType={'primary'}
                            onClick={() => setEditMode(false)}
                        />
                        <Button
                            text={'Cancel'}
                            type={'button'}
                            styleType={'secondary'}
                            onClick={() => setEditMode(false)}
                        />
                    </div>
                </>
            ) : (
                <div className={styles.wrapper}>
                    <p>{note}</p>
                    <div className={styles.actions}>
                        <IconClickable
                            src={Utilities.edit}
                            onClick={() => setEditMode(true)}
                        />
                        <IconClickable
                            src={Utilities.delete}
                            onClick={() => setModalOpen(true)}
                        />
                    </div>
                </div>
            )
            }
            <div className={styles.divider}></div>

            <BaseModal
                closeModal={() => setModalOpen(false)}
                additionalClasses={['visible-block']}
                modalIsOpen={modalOpen}
                headText="Are you sure you want to delete this note?"
                confirmText="Delete"
                children={undefined}
            />
        </div>
    )
}

export default AssetNoteItem