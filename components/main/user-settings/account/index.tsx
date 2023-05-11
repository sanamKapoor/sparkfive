import { useState } from 'react';
import styles from './index.module.css'

import SectionButton from '../../../common/buttons/section-button';

const Account = () => {

    const [tab, setTab] = useState(0)

    return (
        <div className={styles.container}>

            <div className={styles.buttons}>
                <SectionButton
                    text='Profile'
                    active={tab === 0}
                    onClick={() => setTab(0)}
                />
                <SectionButton
                    text='Billing'
                    active={tab === 1}
                    onClick={() => setTab(1)}
                />
                <SectionButton
                    text='Company'
                    active={tab === 2}
                    onClick={() => setTab(2)}
                />
                <SectionButton
                    text='Security'
                    active={tab === 3}
                    onClick={() => setTab(3)}
                />
            </div>
        </div>
    )
}

export default Account