import IconClickable from '../buttons/icon-clickable'
import styles from './asset-duplicate-item.module.css'
import { AssetOps, Utilities } from '../../../assets'
import { useState } from 'react'
import Input from '../inputs/input'
import Button from '../buttons/button'

const AssetDuplicateItem = ({ file, onFileNameUpdate }) => {
    const [cancel, setCancel] = useState(false)
    const [current, setCurrent] = useState(false)
    const [edit, setEdit] = useState(false)
    const [changedFileName, setChangedFileName] = useState(false)
    const [fileName, setFileName] = useState(file)
    const [oldName, setOldName] = useState(file)

    const setAction = (action, flag) => {
        switch (action) {
            case 'edit':
                setEdit(flag)
                if (flag) {
                    setFileName(oldName)
                    setChangedFileName(false)
                }
                break;
            case 'change':
                setChangedFileName(flag)
                break;
            case 'current':
                setCurrent(flag)
                break;
            case 'cancel':
                setCancel(flag)
                break;
        }
        if (action !== 'edit') {
            onFileNameUpdate(action, oldName, fileName)
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.file}>
                {changedFileName ? fileName : file}
            </div>
            <div className={styles.actions}>

                {!current && !edit &&
                    <span onClick={() => setAction('cancel', !cancel)}>
                        <IconClickable
                            tooltipText={'Cancel'}
                            tooltipId={'Cancel'}
                            src={cancel ? Utilities['xMark'] : AssetOps['cancel']}
                            additionalClass={styles.cancelItem}
                        />
                        Cancel{cancel && 'ed'} upload
                    </span>
                }

                {!cancel && !edit &&
                    <span onClick={() => setAction('current', !current)}>
                        <IconClickable
                            tooltipText={'Save'}
                            tooltipId={'Save'}
                            src={current ? Utilities['check'] : AssetOps[`move`]}
                        />
                        Save{current && 'd'} as current version
                    </span>
                }

                {!cancel && !current &&
                    edit && !changedFileName ? (
                        <div className={styles.input}>
                            <Input
                                styleType={'regular-height-short'}
                                placeholder={'Enter new filename'}
                                value={fileName}
                                onChange={e => setFileName(e.target.value)}
                            />
                            <Button
                                styleTypes={['exclude-min-height']}
                                text="Set"
                                styleType='primary'
                                onClick={() => setAction('change', true)}
                            />
                            <span onClick={() => setAction('edit', false)}>Cancel</span>
                        </div>

                    ) : (
                        !cancel && !current &&
                            <span onClick={() => setAction('edit', !edit)}>
                                <IconClickable
                                    tooltipText={'Edit'}
                                    tooltipId={'Edit'}
                                    src={changedFileName ? Utilities['check'] : AssetOps[`edit`]}
                                />
                                Change{changedFileName && 'd'} filename
                            </span>
                    )
                }
            </div>
        </div>
    )
}

export default AssetDuplicateItem