import { useState } from 'react'
import Link from 'next/link'

import styles from './advanced-options.module.css'

// Components
import SpinnerOverlay from "../spinners/spinner-overlay";

const AdvancedOptions = () => {
    const [loading, setLoading] = useState(false)

    return (
        <div className={styles['main-wrapper']}>
            <div className={`${styles['row']} ${styles['field-block']}`}>
                <div className={`${styles['col-100']}`}>
                    <div className={`${styles['row']} p-l-r-10`}>
                        <div className={`${styles['deleted-assets']}`}>
                            <span className={'font-weight-500'}>Deleted Assets</span>
                            <div className={`${styles['p-l-100']}`}></div>
                            <Link href={'/main/user-settings/deleted-assets-list'}>Manage Deleted Assets</Link>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <SpinnerOverlay />}
        </div>
    )
}

export default AdvancedOptions
