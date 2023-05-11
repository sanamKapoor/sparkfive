import styles from './upload-item.module.css'

import { Utilities, ProjectTypes, AssetOps } from '../../assets'

import IconClickable from "../common/buttons/icon-clickable";
import ReactTooltip from "react-tooltip";

export default function UploadItem({ name, key, status = '', error = '' }: Props){
    return <div className={`row ${styles['file-upload-row']}`} key={key}>
        <IconClickable
            src={AssetOps.uploadFilesGray}
            additionalClass={styles['file-icon']}
            onClick={()=>{}} />
        <span className={styles['file-name']}>{name}</span>
        {status === 'done' && <IconClickable
            src={Utilities.radioButtonEnabled}
            additionalClass={styles['check-icon']}
            onClick={()=>{}} />}
        {status === 'fail' && <IconClickable
            src={Utilities.info}
            additionalClass={styles['check-icon']}
            tooltipId={`asset-${key}`}
            tooltipText={`${error}`}
            onClick={()=>{}} />}
    </div>
}

interface Props{
    name: string;
    key?: number;
    status?: string;
    error?: string;
}
