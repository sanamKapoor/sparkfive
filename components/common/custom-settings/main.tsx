import styles from './main.module.css'
import { useContext, useState } from 'react'

// Components
import SectionButton from '../../common/buttons/section-button'
import CustomFileSizes from "./custom-file-size"
import SizeSaPresets from "./size-sa-presets"
import { UserContext } from '../../../context'

import {
    SUPERADMIN_ACCESS
} from '../../../constants/permissions'
import AdvancedOptions from './advanced-options'
import CustomViews from './custom-views'
import AccountActions from './account-actions'
import Automations from './automations'
import Links from '../guest-upload/links'
import DeletedAssetsLibrary from './deleted-assets'

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
                {hasPermission([SUPERADMIN_ACCESS]) && <SectionButton
                    text='Size SA Presets'
                    active={activeList === 'sizeSaPresets'}
                    onClick={() => setActiveList('sizeSaPresets')}
                />}
                <SectionButton
                    text='Custom Views'
                    active={activeList === 'customViews'}
                    onClick={() => setActiveList('customViews')}
                />
                <SectionButton
                    text='Account Actions'
                    active={activeList === 'accountActions'}
                    onClick={() => setActiveList('accountActions')}
                />
                <SectionButton
                    text='Automations'
                    active={activeList === 'automations'}
                    onClick={() => setActiveList('automations')}
                />
                <SectionButton
                    text='Custom File Sizes'
                    active={activeList === 'customFileSizes'}
                    onClick={() => setActiveList('customFileSizes')}
                />
                <SectionButton
                    text='Guest Upload Links'
                    active={activeList === 'guestUpload'}
                    onClick={() => setActiveList('guestUpload')}
                />
                <SectionButton
                    text='Deleted Assets'
                    active={activeList === 'deletedAssets'}
                    onClick={() => setActiveList('deletedAssets')}
                />
            </div>

            <div className={styles.content}>
                {activeList === 'customViews' && <CustomViews />}
                {activeList === 'accountActions' && <AccountActions />}
                {activeList === 'automations' && <Automations />}
                {activeList === 'advancedOptions' && <AdvancedOptions />}
                {activeList === 'customFileSizes' && <CustomFileSizes />}
                {activeList === 'guestUpload' && <Links />}
                {activeList === 'deletedAssets' && <DeletedAssetsLibrary />}
                {activeList === 'sizeSaPresets' && hasPermission([SUPERADMIN_ACCESS]) && <SizeSaPresets />}
            </div>
        </>
    )
}

export default Main
