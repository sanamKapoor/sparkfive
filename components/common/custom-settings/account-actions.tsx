import { useContext, useState } from 'react'
import { Utilities } from '../../../assets'
import IconClickable from '../buttons/icon-clickable'
import styles from './main.module.css'
import { UserContext } from '../../../context'
import teamAPI from "../../../server-api/team"

const AccountActions = () => {

    const [loading, setLoading] = useState(false)
    const { advancedConfig, setAdvancedConfig } = useContext(UserContext)
    const [subFolderAutoTag, setSubFolderAutoTag] = useState(true)
    const [duplicateCheck, setDuplicateCheck] = useState(false)
    const [searchDefault, setSearchDefault] = useState('')

    const saveAdvanceConfig = async (config) => {
        setLoading(true)
        await teamAPI.saveAdvanceConfigurations({ config })

        const updatedConfig = { ...advancedConfig, ...config }
        setAdvancedConfig(updatedConfig)

        getAdvanceConfigurations(updatedConfig);
    }

    const getAdvanceConfigurations = (conf = advancedConfig) => {
        setSubFolderAutoTag(conf.subFolderAutoTag)
        setDuplicateCheck(conf.duplicateCheck)
        setSearchDefault(conf.searchDefault)
        setLoading(false)
        return true
    }


    return (
        <div className={styles.container}>
            <h3>Account Actions</h3>

            <div>
                <div className={styles.row}>
                    <span className={styles.label}>Search Default</span>
                    <div className={styles['field-radio-wrapper']}>
                        <div className={styles.radio}>
                            <div>Subfolder as Separate Collection</div>
                            <IconClickable
                                src={searchDefault === 'all' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ searchDefault: 'all' })} />
                        </div>
                        <div className={styles.radio}>
                            <div>Subfolder as Tags (Default)</div>
                            <IconClickable
                                src={searchDefault === 'tags_only' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ searchDefault: 'tags_only' })} />
                        </div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.label}>Folder Upload Configuration</div>
                    <div className={styles['field-radio-wrapper']}>
                        <div className={styles.radio}>
                            <div>All</div>
                            <IconClickable
                                src={subFolderAutoTag ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ subFolderAutoTag: true })} />
                        </div>
                        <div className={styles.radio}>
                            <div>Tags Only</div>
                            <IconClickable
                                src={!subFolderAutoTag ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ subFolderAutoTag: false })} />
                        </div>
                    </div>
                </div>


                <div className={styles.row}>
                    <div className={styles.label}>Duplicate Management - Check Uploads</div>
                    <div className={styles['field-radio-wrapper']}>
                        <div className={styles.radio}>
                            <div>On</div>
                            <IconClickable
                                src={duplicateCheck ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ duplicateCheck: true })} />
                        </div>
                        <div className={styles.radio}>
                            <div>Off</div>
                            <IconClickable
                                src={!duplicateCheck ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ duplicateCheck: false })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountActions