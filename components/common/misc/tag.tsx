import { capitalCase } from 'change-case'
import { useContext, useState } from "react";
import styles from './tag.module.css'
import { useRouter } from "next/router";
import { Utilities } from '../../../assets'

import { UserContext } from '../../../context'
import {
    SETTINGS_TEAM,
    SETTINGS_COMPANY,
} from '../../../constants/permissions'
import IconClickable from '../buttons/icon-clickable';

const Tag = ({
    tag, data, type = null, canRemove = false, canEdit = true, removeFunction = () => { }, editFunction = () => { }, altColor = '' }) => {
    const { push, asPath } = useRouter()
    const { hasPermission } = useContext(UserContext)

    const [mouseOver, setMouseOver] = useState(false)

    const goToTagManagement = () => {
        // Team management can go to management page
        if (hasPermission([SETTINGS_TEAM, SETTINGS_COMPANY])) {
            if (asPath !== "/main/user-settings/attributes") {
                push("/main/user-settings/attributes")
            } else {
                type && data.numberOfFiles !== "0" && push(`/main/assets?${type}=${data.name || data.sku}`)
            }
        }
    }

    const tagRender = (type && mouseOver) ? (<span>
        {type !== "custom-fields" && canEdit && <IconClickable additionalClass={styles['tag-icon']} src={Utilities.edit} onClick={editFunction} tooltipId='Edit' tooltipText='Edit' />}
        <span onClick={type !== "custom-fields" ? goToTagManagement : null}>{data.name || data.sku}</span>
    </span>) : tag

    return <div onMouseEnter={_ => setMouseOver(true)} onMouseLeave={_ => setMouseOver(false)} className={`${styles.container} ${hasPermission([SETTINGS_TEAM, SETTINGS_COMPANY]) ? styles['pointer'] : ''} ${altColor && styles[`alt-color-${altColor}`]}`}>
        <span>{tagRender}</span>

        {canRemove &&
            <IconClickable additionalClass={styles.remove} onClick={removeFunction} src={Utilities.closeTag} />
        }
    </div>
}

export default Tag
