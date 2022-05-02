import { useState } from 'react'
import { Utilities } from '../../../assets'
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import TextArea from '../inputs/text-area'
import AssetNoteItem from './asset-note-item'
import styles from './asset-notes.module.css'

const AssetNotes = () => {

    const [internal, setInternal] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <h2>Notes</h2>
                <h3>0 Note(s)</h3>
            </div>
            <TextArea
                placeholder="Add a note"
                rows={7}
            />
            <div className={styles.radios}>
                <div className={styles['radio-wrapper']}>
                    <IconClickable
                        src={internal ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                        onClick={() => setInternal(true)} />
                    <div className={'font-12 m-l-10'}>For internal use only</div>
                </div>
                <div className={styles['radio-wrapper']}>
                    <IconClickable
                        src={!internal ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                        onClick={() => setInternal(false)} />
                    <div className={'font-12 m-l-10'}>Display internally and externally</div>
                </div>
            </div>
            <Button
                text={'Save'}
                type={'button'}
                styleType={'primary'}
            />

            <div className={styles.divider}></div>

            <AssetNoteItem
                title="Note 1"
                note="A simple text to give an example of a how note would look after they have been saved."
            />
            <AssetNoteItem
                title="Note 2"
                note="A simple text to give an example of a how note would look after they have been saved."
            />
        </div>
    )
}

export default AssetNotes