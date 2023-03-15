import styles from './move-modal.module.css'
import { useState, useEffect } from 'react'
import { Assets } from '../../../assets'
import folderApi from '../../../server-api/folder'

// Components
import Base from '../../common/modals/base'
import Button from '../../common/buttons/button'
import Input from '../../common/inputs/input'
import IconClickable from '../../common/buttons/icon-clickable'

const CopyModal = ({ modalIsOpen, closeModal, itemsAmount, moveAssets, createFolder, confirmText = 'Move' }) => {

    const [folders, setFolders] = useState([])
    const [selectedFolder, setSelectedFolder] = useState('')
    const [newFolderName, setNewFolderName] = useState('')
    const [folderInputActive, setFolderInputActive] = useState(false)

    useEffect(() => {
        if (modalIsOpen) {
            getFolders()
        }
    }, [modalIsOpen])

    const getFolders = async () => {
        try {
            const { data } = await folderApi.getFoldersSimple()
            setFolders(data)
        } catch (err) {
            console.log(err)
        }
    }

    const closemoveModal = () => {
        setSelectedFolder('')
        closeModal()
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        await createFolder(newFolderName)
        getFolders();
        setNewFolderName('')
        setFolderInputActive(false)
    }

    return (
        <Base
            modalIsOpen={modalIsOpen}
            closeModal={closemoveModal}
            confirmText={confirmText}
            headText={`${confirmText} ${itemsAmount} item(s) to...`}
            disabledConfirm={!selectedFolder}
            confirmAction={() => {
                moveAssets(selectedFolder)
                closemoveModal()
            }} >
            <ul className={styles.list}>
                {folders.map(folder => (
                    <li key={folder.id} onClick={() => setSelectedFolder(folder.id)} className={selectedFolder === folder.id && styles.selected}>
                        <IconClickable src={Assets.folder} />
                        <div className={styles.name}>
                            {folder.name}
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles['folder-wrapper']}>
                {folderInputActive ?
                    <form onSubmit={onSubmit}>
                        <div className={styles['create-new']} onClick={() => setFolderInputActive(false)}>X</div>
                        <Input
                            placeholder={'Collection name'}
                            onChange={e => setNewFolderName(e.target.value)}
                            value={newFolderName}
                            styleType={'regular-short'} />
                        <Button
                            type={'submit'}
                            text={'Create'}
                            styleType='input-height'
                            disabled={!newFolderName}
                        />
                    </form>
                    :
                    <span onClick={() => setFolderInputActive(true)} className={styles['create-new']}>+ Create New Collection</span>
                }
            </div>
        </Base >)
}

export default CopyModal
