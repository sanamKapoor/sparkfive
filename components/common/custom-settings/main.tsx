import styles from './main.module.css'
import {useContext, useState} from 'react'

// Components
import SectionButton from '../../common/buttons/section-button'
import CustomFileSizes from "./custom-file-size"
import SizeSaPresets from "./size-sa-presets"
import { UserContext } from '../../../context'

import {
    SUPERADMIN_ACCESS
} from '../../../constants/permissions'
import AdvancedOptions from './advanced-options'

const Main = () => {
    const { hasPermission } = useContext(UserContext)
    const [activeList, setActiveList] = useState('advancedOptions')

    return (
        <>
            <div className={styles.buttons}>
                <SectionButton
                    text='Advanced Options'
                    active={activeList === 'advancedOptions'}
                    onClick={() => setActiveList('advancedOptions')}
                />
                <SectionButton
                    text='Custom File Sizes'
                    active={activeList === 'customFileSizes'}
                    onClick={() => setActiveList('customFileSizes')}
                />
                {hasPermission([SUPERADMIN_ACCESS]) && <SectionButton
                    text='Size SA Presets'
                    active={activeList === 'sizeSaPresets'}
                    onClick={() => setActiveList('sizeSaPresets')}
                />}
            </div>

            {activeList === 'advancedOptions' && <AdvancedOptions />}
            {activeList === 'customFileSizes' && <CustomFileSizes />}
            {activeList === 'sizeSaPresets' && hasPermission([SUPERADMIN_ACCESS]) && <SizeSaPresets />}
        </>
    )
}

export default Main
