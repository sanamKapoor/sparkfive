import styles from './index.module.css'
import { useState } from 'react'

// Components
import SectionButton from '../../common/buttons/section-button'
import Links from "./links";
import Requests from "./requests";

const GuestUpload = () => {
    const [activeList, setActiveList] = useState('links')

    return (
        <>
            <div className={styles.buttons}>
                <SectionButton
                    text='Links'
                    active={activeList === 'links'}
                    onClick={() => setActiveList('links')}
                />
                <SectionButton
                    text='Requests'
                    active={activeList === 'requests'}
                    onClick={() => setActiveList('requests')}
                />
            </div>

            {activeList === 'links' && <Links />}
            {activeList === 'requests' && <Requests />}
        </>
    )
}

export default GuestUpload
