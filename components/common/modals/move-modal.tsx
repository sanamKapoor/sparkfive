import styles from './move-modal.module.css'
import { useState, useEffect } from 'react'
import { Assets } from '../../../assets'
import folderApi from '../../../server-api/folder'
import { Utilities } from '../../../assets'

// Components
import Base from '../../common/modals/base'
import Button from '../../common/buttons/button'
import Input from '../../common/inputs/input'
import IconClickable from '../../common/buttons/icon-clickable'

const MoveModal = ({ modalIsOpen, closeModal, itemsAmount, moveAssets, createFolder, confirmText = 'Add' }) => {

  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState([])
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
    setSelectedFolder([])
    closeModal()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await createFolder(newFolderName)
    setNewFolderName('')
    setFolderInputActive(false)
  }

  const toggleSelected = (folderId: string, selected: boolean) => {
    if(selected){
      setSelectedFolder([...selectedFolder, folderId])
    }else{
      setSelectedFolder(selectedFolder.filter((item)=>item !== folderId))
    }

  }

  const selectedFolderName = folders.filter((folder)=>selectedFolder.includes(folder.id)).map((item)=>item.name)

  return (
    <Base
      modalIsOpen={modalIsOpen}
      closeModal={closemoveModal}
      confirmText={confirmText}
      headText={`${confirmText} ${itemsAmount} item(s) to Collection`}
      disabledConfirm={!selectedFolder}
      confirmAction={() => {
        moveAssets(selectedFolder)
        closemoveModal()
      }} >
      <ul className={styles.list}>
        {folders.map(folder => (
          <li key={folder.id} onClick={() => toggleSelected(folder.id, !selectedFolder.includes(folder.id))}>
            {selectedFolder.includes(folder.id) ?
                <IconClickable
                    src={Utilities.radioButtonEnabled}
                    additionalClass={styles['select-icon']}
                />
                :
                <IconClickable
                    src={Utilities.radioButtonNormal}
                    additionalClass={styles['select-icon']}
                     />
            }
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

export default MoveModal
