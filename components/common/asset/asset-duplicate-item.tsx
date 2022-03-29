import IconClickable from '../buttons/icon-clickable'
import styles from './asset-duplicate-item.module.css'
import { AssetOps, Utilities } from '../../../assets'
import { useState } from 'react'
import Input from '../inputs/input'
import Button from '../buttons/button'

const AssetDuplicateItem = ({ file }) => {

    const [cancel, setCancel] = useState(false)
    const [current, setCurrent] = useState(false)
    const [changeFileName, setChangeFileName] = useState(false)
    const [savedFileName, setSavedFileName] = useState(false)
    const [fileName, setFileName] = useState(file)

    return (
        <div className={styles.wrapper}>
            <div className={styles.file}>
                {savedFileName ? fileName : file}
            </div>
            <div className={styles.actions}>

                {!current && !changeFileName &&
                    <span onClick={() => setCancel(true)}>
                        <IconClickable
                            tooltipText={'Cancel'}
                            tooltipId={'Cancel'}
                            src={cancel ? Utilities['xMark'] : AssetOps['delete']}
                        />
                        Cancel{cancel && 'ed'} upload
                    </span>
                }

                {!cancel && !changeFileName &&
                    <span onClick={() => setCurrent(true)}>
                        <IconClickable
                            tooltipText={'Save'}
                            tooltipId={'Save'}
                            src={current ? Utilities['check'] : AssetOps[`move`]}
                        />
                        Save{current && 'd'} as current version
                    </span>
                }

                {!cancel && !current &&
                    changeFileName && !savedFileName ? (
                        <div className={styles.input}>
                            <Input
                                styleType={'regular-height-short'}
                                placeholder={'Enter new filename'}
                                value={fileName}
                                onChange={e => setFileName(e.target.value)}
                            />
                            <Button
                                styleTypes={['exclude-min-height']}
                                text="Save"
                                styleType='primary'
                                onClick={() => setSavedFileName(true)}
                            />
                        </div>

                    ) : (
                        !cancel && !current &&
                            <span onClick={() => setChangeFileName(true)}>
                                <IconClickable
                                    tooltipText={'Edit'}
                                    tooltipId={'Edit'}
                                    src={savedFileName ? Utilities['check'] : AssetOps[`edit`]}
                                />
                                Change{savedFileName && 'd'} filename
                            </span>
                    )
                }
            </div>
        </div>
    )
}

export default AssetDuplicateItem