import ReactModal from 'react-modal'
import styles from './change-thumnail-modal.module.css'
import toastUtils from '../../../utils/toast'
import assetApi from '../../../server-api/asset'
import folderApi from '../../../server-api/folder'

import { useContext, useEffect, useRef, useState } from 'react'

// Components
import Button from '../buttons/button'
import React from 'react'
import Input from '../inputs/input'
import { LoadingContext, AssetContext } from '../../../context'
import { AssetOps } from '../../../assets'
import Axios from 'axios'

ReactModal.defaultStyles = {}

// Used for the upload thumbnail for collection
const ChangeThumbnail = ({
  modalIsOpen,
  modalData,
  closeModal,
  confirmAction = () => { },
  textWidth = false,
  noHeightMax = false,
  additionalClasses = [''],
  closeButtonOnly = false
}) => {
  const fileBrowserRef = useRef(undefined);
  const [IsUploading, setIsUploading] = useState(false)
  const [imagePath, setImagePath] = useState(null)
  const [imagePreview, setImagePreview] = useState(false);
  const [imageName, setImageName] = useState('');
  const [fileForUpload, setFileForUpload] = useState('');
  const ALLOWED_TYPES = 'image/*'
  const { setIsLoading } = useContext(LoadingContext)
  const { setFolders } = useContext(AssetContext);


  const onFileChange = async (e) => {
    await saveChanges(e.target.files[0])
  }

  const onChangeEvent = async (e) => {
    setImagePath(e.target.value)
  }

  //remove file if file not valid
  const onRemove = () => {
    setImagePreview(false);
    setImageName('');
    setFileForUpload('');
  }

//Upload image and validate
  const saveChanges = async (uploadImg) => {
    try {
      var reader = new FileReader();
      var imgtag: any = document.getElementById("myimage");
      imgtag.title = uploadImg.name;
      reader.onload = (event: any) => {
        imgtag.src = event.target.result;
        imgtag.onerror = () => {
          onRemove();
          toastUtils.error('Please upload correct image.')
        }
        imgtag.onload = () => {
          setImagePreview(true)
          setImageName(uploadImg.name);
        }
      };
      reader.readAsDataURL(uploadImg);
      setFileForUpload(uploadImg);
    } catch (err) {
      onRemove();
      toastUtils.error('Could not update photo, please try again later.')
    } finally {
      setIsUploading(false)
    }
  }

  //called by save button
  const saveClick = async () => {
    try {
      setIsLoading(true);
      setIsUploading(true)
      const formData = new FormData()
      formData.append('thumbnail', fileForUpload)
      const { data } = await assetApi.uploadThumbnail(formData)
      if (data) {
        await folderApi.updateFolder(modalData.id, { thumbnailPath: data[0].realUrl })
        getFolders();
      }
    } catch (err) {
      onRemove();
      toastUtils.error('Could not update photo, please try again later.')
    } finally {
      setIsUploading(false)
    }
  }

  //Check if image is valid or not
  const imageExists = async (image_url, cb) => {
    try {
      const request = new XMLHttpRequest();
      request.open("GET", image_url, true);
      request.send();
      request.onload = function () {
        if (request.status == 200 && request.getResponseHeader('content-type')?.includes('image/')) {
          cb(true)
        } else {
          cb(false)
        }
      }
      request.onerror = function (error) {
        cb(false)
      }
    } catch (error) {
      cb(false)
    }
  }
  //Refresh data after thumbnail changed
  const getFolders = async () => {
    let query = {
      page: 1,
      sortField: 'createdAt',
      sortOrder: 'desc'
    }
    const { data } = await folderApi.getFolders(query);
    setFolders(data, true, true);
    onRemove();
    setIsLoading(false);
    toastUtils.success(`Thumbnail updated.`)
    setIsUploading(false)
    closeModal();
  }

  //Link thumbnail URL for a collection
  const saveLinkChanges = async () => {
    try {
      if (imagePath) {
        imageExists(imagePath, async (resData) => {
          if (resData) {
            setIsLoading(true);
            setIsUploading(true)
            await folderApi.updateFolder(modalData.id, { thumbnailPath: imagePath })
            setImagePath(null);
            getFolders();
          } else {
            onRemove();
            toastUtils.error('Please enter valid Image url.')
          }
        });
      } else {
        setIsLoading(false);
        onRemove();
        toastUtils.error('Please enter file path.')
      }
    } catch (err) {
      onRemove();
      toastUtils.error('Could not update photo, please try again later.')
    } finally {
      setIsUploading(false)
    }
  }

  const openFile = async (e) => { // Open file picker
    fileBrowserRef.current.click();
  }

  return (
    <ReactModal
      isOpen={modalIsOpen}
      className={`${styles.modal} ${noHeightMax && styles['no-height-max']} ${additionalClasses.join(' ')}`}
      overlayClassName={styles.overlay}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      shouldFocusAfterRender={false}
      ariaHideApp={false}
    >
      <div className={`${styles.text} ${closeButtonOnly ? styles['no-border'] : ""} ${textWidth && styles['full-width']}`}>
        {<p className={styles['overflow-text']}>Change Thumbnail</p>}
        <span className={styles.close} onClick={closeModal}>x</span>
      </div>
      <div style={{ padding: '10px 20px' }}>
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <p>Copy and paste here the link to  the image you
            want to use as thumbnail</p>
        </div>
        <div className={styles.disaplay_box}>
          {!imagePreview && <Input placeholder={"Link to image file"} onChange={onChangeEvent} additionalClasses={`${styles.input}`} />}
          <div className={`${styles.preview} ${imagePreview ? styles.input : ''}`}>
            <img id="myimage" className={styles.img_file} style={{ display: imagePreview ? 'block' : 'none' }} />
            {imagePreview && <label>{imageName}</label>}
            {imagePreview && <img src={AssetOps.deleteRed} alt="" onClick={onRemove} className={styles.deleteIcon} />}
          </div>
          <Button
            text="Save"
            onClick={imagePreview ? saveClick : saveLinkChanges}
            type='button'
            styleType='primary'
            className={`${styles.button} ${imagePreview ? styles.margin_t : ''}`}
            disabled={IsUploading}
          />
          <input id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
            onChange={onFileChange} accept={ALLOWED_TYPES} />
        </div>
        <div className={styles.padding_div}>
          <div className={styles.div}>
            <p className={styles.paragrap}>Or upload the image you want to use as thumbnail</p>
          </div>
          <Button
            text="Upload Image"
            onClick={openFile}
            className={styles.button}
            disabled={IsUploading}
            type='button'
            styleType='primary'
          />
        </div>
      </div>
    </ReactModal>
  )
}

export default ChangeThumbnail
