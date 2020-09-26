import styles from './photo-upload.module.css'
import { useState, useEffect, useRef, useContext } from 'react'
import { UserContext } from '../../../context'
import toastUtils from '../../../utils/toast'
import userApi from '../../../server-api/user'

import { Utilities } from '../../../assets'

const ALLOWED_TYPES = 'image/png, image/jpeg'

// Components
import Button from '../buttons/button'
import ButtonIcon from '../buttons/button-icon'

const PhotoUpload = ({ userPhoto = '' }) => {
  const [currentPhoto, setCurrentPhoto] = useState(undefined)
  const [uploadedImage, setUploadedImage] = useState(undefined)

  const { setUser } = useContext(UserContext)

  const fileBrowserRef = useRef(undefined)

  useEffect(() => {
    if (userPhoto) {
      setCurrentPhoto(userPhoto)
    }
  }, [userPhoto])

  const openUpload = () => {
    fileBrowserRef.current.click()
  }

  const onFileChange = (e) => {
    setCurrentPhoto(URL.createObjectURL(e.target.files[0]))
    setUploadedImage(e.target.files[0])
    fileBrowserRef.current.value = ''
  }

  const cancelPreview = () => {
    setUploadedImage(undefined)
    setCurrentPhoto(userPhoto)
  }

  const saveChanges = async () => {
    try {
      const formData = new FormData()
      formData.append('photo', uploadedImage)
      const { data } = await userApi.uploadPhoto(formData)
      setUser(data)
      toastUtils.success(`Photo updated.`)
      setUploadedImage(undefined)
    } catch (err) {
      cancelPreview()
      console.log(err)
      toastUtils.error('Could not update photo, please try again later.')
    }
  }

  return (
    <div className={styles.container}>
      <img className={`${currentPhoto ? styles.current : styles['no-photo']}`} src={currentPhoto || Utilities.memberProfile} />
      <div>
        {uploadedImage ?
          <>
            <Button
              text='Cancel'
              type='button'
              styleType='secondary'
              onClick={cancelPreview}
            />
            <Button
              text='Save Changes'
              type='button'
              styleType='primary'
              onClick={saveChanges}
            />
          </>
          :
          <ButtonIcon
            icon={Utilities.addAlt}
            text='UPLOAD PHOTO'
            onClick={openUpload}
          />
        }
        <p className={styles.description}>Your Avatar appears in your team comments and notifications</p>
      </div>
      <input id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
        onChange={onFileChange} accept={ALLOWED_TYPES} />
    </div>
  )
}

export default PhotoUpload