import styles from './index.module.css'
import { useState } from 'react'

// Components
import SectionButton from '../../common/buttons/section-button'
import Links from "./links";
import Requests from "./requests";
import {useRouter} from "next/router";

const GuestUpload = () => {
    const { query } = useRouter()

    const getDefaultTab = () => {
        switch (query.tab){
            case '0': {
                return 'links'
            }
            case '1': {
                return 'requests'
            }
            default: {
                return 'links'
            }
        }
    }

    const [activeList, setActiveList] = useState(getDefaultTab())

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
