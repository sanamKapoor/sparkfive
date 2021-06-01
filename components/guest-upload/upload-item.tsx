import styles from './upload-item.module.css'

import { Utilities, ProjectTypes } from '../../assets'

import IconClickable from "../common/buttons/icon-clickable";

export default function UploadItem({ name, key }: Props){
    return <div className={`row ${styles['file-upload-row']}`} key={key}>
        <IconClickable
            src={ProjectTypes.campaign}
            additionalClass={styles['file-icon']}
            onClick={()=>{}} />
        {name}
        <IconClickable
            src={Utilities.radioButtonEnabled}
            additionalClass={styles['check-icon']}
            onClick={()=>{}} />
    </div>
}

interface Props{
    name: string;
    key?: number;
}
