import React from "react";
import styles from './Navheading.module.css'
const NavHeading = ({ title }) => {
    return(
        <div>
        <span className={styles.navigationLinkheading}>{title}</span>
        </div>

    )
}
export default NavHeading;