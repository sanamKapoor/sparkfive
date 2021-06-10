import { capitalCase } from 'change-case'
import { useContext } from "react";
import styles from './tag.module.css'
import {useRouter} from "next/router";

import { UserContext } from '../../../context'
import {
    SETTINGS_TEAM,
    SETTINGS_COMPANY,
} from '../../../constants/permissions'

const Tag = ({ tag, canRemove = false, removeFunction = () => { }, editFunction = () => { }, altColor = '' }) => {
    const { push } = useRouter()
    const { hasPermission } = useContext(UserContext)

    const goToTagManagement  = () => {
        // Team management can go to management page
        if(hasPermission([SETTINGS_TEAM, SETTINGS_COMPANY])){
            push("/main/user-settings/attributes")
        }
    }

    return <div className={`${styles.container} ${hasPermission([SETTINGS_TEAM, SETTINGS_COMPANY]) ? styles['pointer'] : ''} ${altColor && styles[`alt-color-${altColor}`]}`}>
        <span onDoubleClick={editFunction} onClick={goToTagManagement}>{tag}</span>
        {canRemove &&
        <span onClick={removeFunction} className={styles.remove}>x</span>
        }
    </div>
}

export default Tag
