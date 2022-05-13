import { useState } from 'react'
import { Utilities } from '../../../assets'
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import TextArea from '../inputs/text-area'
import styles from './asset-note-item.module.css'
import BaseModal from '../modals/base'

const AssetNoteItem = ({ title, note, saveChanges, deleteNote }) => {

    const [editMode, setEditMode] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [noteText, setNoteText] = useState(note.text)
    const [internal, setInternal] = useState(note.internal)

    const _saveChanges = async (note, text) => {
        note.internal = internal
        const success = await saveChanges(note, text)
        if (success) {
            setEditMode(false)
        }
    }

    const _deleteNote = async (note) => {
        const success = await deleteNote(note)
        if (success) {
            setModalOpen(false)
        }
    }

    return (
        <div className={styles.container}>
            <h4>{title}</h4>

            {editMode ? (
                <>
                    <TextArea
                        value={noteText}
                        rows={4}
                        onChange={(e)=> setNoteText(e.target.value)}
                    />
                    <div className={styles.radios}>
                        <div className={styles['radio-wrapper']}>
                            <IconClickable
                                src={internal ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                onClick={() => setInternal(true)} />
                            <div className={'font-12 m-l-10'}>For internal use only</div>
                        </div>
                        <div className={styles['radio-wrapper']}>
                            <IconClickable
                                src={!internal ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                onClick={() => setInternal(false)} />
                            <div className={'font-12 m-l-10'}>Display internally and externally</div>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <Button
                            text={'Save changes'}
                            type={'button'}
                            styleType={'primary'}
                            onClick={() => _saveChanges(note, noteText)}
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
                    <p>{note.text}</p>
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
                confirmAction={()=> _deleteNote(note)}
                children={undefined}
            />
        </div>
    )
}

export default AssetNoteItem