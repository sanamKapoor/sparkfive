// Styles
import styles from './index.module.css'
import {useRef, useState} from "react";

import { Assets } from '../../assets'
import IconClickable from "../common/buttons/icon-clickable";
import ContactForm from "./contact-form";
import Button from "../common/buttons/button";
import UploadItem from "./upload-item";

import { Utilities, ProjectTypes } from '../../assets'
import AssetUploadProcess from "../asset-upload-process";

const GuestUpload = () => {

    const fileBrowserRef = useRef(undefined)
    const folderBrowserRef = useRef(undefined)

    const [uploading, setUploading] = useState(true)

    const dropdownOptions = [
        {
            label: 'Upload',
            text: 'files',
            onClick: () => fileBrowserRef.current.click(),
            icon: Assets.file,
            CustomContent: null
        },
        {
            label: 'Upload',
            text: 'folder',
            onClick: () => folderBrowserRef.current.click(),
            icon: Assets.folder,
            CustomContent: null
        },
    ]

    const DropDownOptions = () => {

        const Content = (option) => {
            return (
                <li className={styles.option}
                    onClick={option.onClick}>
                    <IconClickable src={option.icon} additionalClass={styles.icon} />
                    <div className={styles['option-label']}>{option.label}</div>
                    <div className={styles['option-text']}>{option.text}</div>
                </li>
            )
        }

        return (
            <ul className={`${styles['options-list']} dropdown`}>
                {dropdownOptions.map(option => (
                    <>
                        {option.CustomContent ?
                            <option.CustomContent>
                                <Content {...option} />
                            </option.CustomContent>
                            :
                            <Content {...option} />
                        }
                    </>
                ))}
            </ul>
        )
    }

    const onFileChange = (e) => {
        setUploading(true)
        // onFilesDataGet(Array.from(e.target.files).map(originalFile => ({ originalFile })))
    }

    const files = [
        {name : 'example2.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'},
        {name : 'example3.png'}
    ]

    return (
        <section className={styles.container}>
            <input multiple={true} id="file-input-id" ref={fileBrowserRef} style={{ display: 'none' }} type='file'
                   onChange={onFileChange} />
            <input multiple={true} webkitdirectory='' webkitRelativePath='' id="file-input-id" ref={folderBrowserRef} style={{ display: 'none' }} type='file'
                   onChange={onFileChange} />

            {!uploading && <>
                <div className={`row justify-center ${styles['row']} font-weight-600`}>
                    Upload files to Client Name account in Sparkfive
                </div>

                <div className={`row justify-center ${styles['row']}`}>
                    Select from the following options:
                </div>

                <div className={`row justify-center ${styles['row']}`}>
                   <DropDownOptions />
                </div>

                <div className={`row justify-center ${styles['row']} font-12`}>
                    * 1GB min & 200 files min at once
                </div>
            </>}

            {uploading && <>
                <div className={`row justify-center m-b-10`}>
                    Your upload is ready
                </div>

                <div className={`row justify-center m-b-25`}>
                   Please complete the form below and press Submit button when ready to send your files
                </div>

                <div className={`row justify-center m-b-10`}>
                    <div className={'col-45'}>
                        <div className={styles['file-list']}>
                            {files.map((file, index)=>{
                                return <UploadItem name={file.name} key={index}/>
                            })}
                        </div>
                    </div>
                    <div className={'col-55'}>
                        <ContactForm />
                    </div>
                </div>

                <div className={`row justify-center m-t-40 m-b-40`}>
                    <Button
                        text='Save Changes'
                        type='submit'
                        styleType='input-height-primary'
                    />
                </div>
            </>}

            <div className={`row justify-center ${styles['footer']} ${styles['row']}`}>
                <p className={'font-weight-600 m-b-0'}>Sparkfive</p>
                <p className={'m-b-0'}>Store, organize & distribute your digital assets efficiently with Sparkfive</p>
                <p className={'m-t-0'}>Unlease the power of your team</p>
                <p className={'m-t-0'}>Learn More</p>
            </div>
        </section >
    )
}

export default GuestUpload
