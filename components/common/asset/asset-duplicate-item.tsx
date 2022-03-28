import IconClickable from '../buttons/icon-clickable'
import styles from './asset-duplicate-item.module.css'
import { AssetOps } from '../../../assets'
import { useState } from 'react'

const AssetDuplicateItem = () => {

    const [cancel, setCancel] = useState(false)
    const [current, setCurrent] = useState(false)
    const [newFileName, setNewFileName] = useState(false)

    return (
        <div className={styles.wrapper}>
            <div className={styles.file}>
                ImageExample_1.png
            </div>
            <div className={styles.actions}>
                <span onClick={() => setCancel(true)}>
                    <IconClickable
                        tooltipText={'Cancel'}
                        tooltipId={'Cancel'}
					    src={AssetOps[`delete`]}
                    />
                    Cancel{cancel && 'ed'} upload
                </span>
                <span onClick={() => setCurrent(true)}>
                    <IconClickable
                        tooltipText={'Save'}
                        tooltipId={'Save'}
					    src={AssetOps[`move`]}
                    />
                    Save{current && 'd'} as current version
                </span>
                <span>
                    <IconClickable
                        tooltipText={'Edit'}
                        tooltipId={'Edit'}
					    src={AssetOps[`edit`]}
                    />
                    Replace filename
                </span>
            </div>
        </div>
    )
}

export default AssetDuplicateItem