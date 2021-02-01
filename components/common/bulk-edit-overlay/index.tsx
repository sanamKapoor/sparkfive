import styles from './index.module.css'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'

// Components
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import SidePanelBulk from './side-panel-bulk'


const BulkEditOverlay = ({handleBackButton}) => {

    const elementsSelected = ['element1', 'element2', 'element4']

    const [sideOpen, setSideOpen] = useState(true)

    const toggleSideMenu = (value = null) => {
        if (value === null)
            setSideOpen(!sideOpen)
        else
            setSideOpen(value)
    }

    return (
        <div className={`app-overlay ${styles.container}`}>
            <section className={styles.content}>
                <div className={styles['top-wrapper']}>
                    <div className={styles.back} onClick={handleBackButton}>
                        <IconClickable src={Utilities.back} />
                        <span>Back</span>
                    </div>
                    <div className={styles.name}>
                        <h3>Edit Assets</h3>
                        <div className={styles['asset-actions']}>
                            <Button text={'Select All'} type={'button'} styleType={'secondary'} />
                            <Button text={`(${elementsSelected.length}) Selected`} type={'button'} styleType={'primary'} />
                        </div>
                    </div>
                </div>
            </section>
            {sideOpen &&
                <section className={styles.side}>
                    <SidePanelBulk elementsSelected={elementsSelected} />
                </section>}
            <section className={styles.menu}>
                <IconClickable src={Utilities.closePanelLight} onClick={() => toggleSideMenu()}
                    additionalClass={`${styles['menu-icon']} ${!sideOpen && 'mirror'}`} />
            </section>
        </div >
    )
}

export default BulkEditOverlay