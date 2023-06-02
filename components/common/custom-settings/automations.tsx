import { useContext, useState } from 'react'
import { Utilities } from '../../../assets'
import IconClickable from '../buttons/icon-clickable'
import styles from './main.module.css'
import { UserContext } from '../../../context'
import teamAPI from "../../../server-api/team"
import advancedConfigParams from '../../../utils/advance-config-params'

const Automations = () => {

    const [loading, setLoading] = useState(false)
    const { advancedConfig, setAdvancedConfig } = useContext(UserContext)
    const [aiTagging, setaiTagging] = useState(false)


    const saveAdvanceConfig = async (config) => {
        setLoading(true)
        await teamAPI.saveAdvanceConfigurations({ config })

        const updatedConfig = { ...advancedConfig, ...config }
        setAdvancedConfig(updatedConfig)

        getAdvanceConfigurations(updatedConfig);
    }

    const getAdvanceConfigurations = (conf = advancedConfig) => {
        setaiTagging(conf.aiTagging)
        setLoading(false)
        return true
    }


    return (
        <div className={styles.container}>
            <h3>Automations</h3>
            <div>
                <div className={styles.row}>
                    <span className={styles.label}>AI Tagging</span>
                    <div className={styles['field-radio-wrapper']}>
                        <div className={styles.radio}>
                            <div>On</div>
                            <IconClickable
                                src={aiTagging ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ aiTagging: true })}
                            />
                        </div>
                        <div className={styles.radio}>
                            <div>Off</div>
                            <IconClickable
                                src={!aiTagging ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => saveAdvanceConfig({ aiTagging: false })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Automations