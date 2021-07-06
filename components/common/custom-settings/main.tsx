import styles from './main.module.css'
import { useState } from 'react'

// Components
import SectionButton from '../../common/buttons/section-button'
import CustomFileSizes from "./custom-file-size"
import SizeSaPresets from "./size-sa-presets"

const Main = () => {
    const [activeList, setActiveList] = useState('customFileSizes')

    return (
        <>
            <div className={styles.buttons}>
                <SectionButton
                    text='Custom File Sizes'
                    active={activeList === 'customFileSizes'}
                    onClick={() => setActiveList('customFileSizes')}
                />
                <SectionButton
                    text='Size SA Presets'
                    active={activeList === 'sizeSaPresets'}
                    onClick={() => setActiveList('sizeSaPresets')}
                />
            </div>

            {activeList === 'customFileSizes' && <CustomFileSizes />}
            {activeList === 'sizeSaPresets' && <SizeSaPresets />}
        </>
    )
}

export default Main
