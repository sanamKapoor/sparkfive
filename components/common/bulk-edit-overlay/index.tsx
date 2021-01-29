import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'

// Components
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import SidePanelBulk from './side-panel-bulk'

const BulkEditOverlay = () => {
    return (
        <div className={`app-overlay ${styles.container}`}>
            <section className={styles.content}>
                <div className={styles['top-wrapper']}>
                    <div className={styles.back} >
                        <IconClickable src={Utilities.back} />
                        <span>Back</span>
                    </div>
                    <div className={styles.name}>
                        <h3>Edit Assets</h3>
                        <div className={styles['asset-actions']}>
                            <Button text={'Select All'} type={'button'} styleType={'secondary'} />
                            <Button text={'( ) Selected'} type={'button'} styleType={'primary'} />
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.side}>
                <SidePanelBulk />
            </section>
            <section className={styles.menu}>
                <IconClickable src={Utilities.closePanelLight} 
                    additionalClass={`${styles['menu-icon']}`} />
            </section>
        </div >
    )
}

export default BulkEditOverlay