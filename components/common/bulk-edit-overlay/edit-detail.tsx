import { useState } from 'react';
import styles from "./edit-detail.module.css";
import { Utilities } from "../../../assets";

import CreatableSelect from '../inputs/creatable-select'
import CustomFieldSelector from "../items/custom-field-selector";
import Button from '../buttons/button'
import IconClickable from "../buttons/icon-clickable";

const EditDetail = ({ asset }) => {

    console.log(asset);


    const [activeDropdown, setActiveDropdown] = useState('')
    const [inputTags, setInputTags] = useState([])
    const [inputFolders, setInputFolders] = useState([])
    const [inputCustomFields, setInputCustomFields] = useState([])

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.name}>{asset.fileName}</div>
                <div className={styles['image-wrapper']}>
                    <img src='https://picsum.photos/2000' />
                </div>
                <div className={styles.arrows}>
                    <span>1 of 23</span>
                    <div>
                        <span className={styles['arrow-prev']}>
                            <IconClickable src={Utilities.arrowPrev} onClick={() => alert('prev')} />
                        </span>
                        <span className={styles['arrow-next']}>
                            <IconClickable src={Utilities.arrowNext} onClick={() => alert('next')} />
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.side}>
                <h3>Add Attributes to Selected Assets</h3>
                <div className={styles['first-section']}>
                    <div className={styles['field-wrapper']}>
                        <div className={`secondary-text ${styles.field}`}>Last Updated</div>
                        <div className={`normal-text ${styles['meta-text']}`}>{asset.updatedAt}</div>
                    </div>
                    <div className={styles['field-wrapper']}>
                        <div className={`secondary-text ${styles.field}`}>Uploaded</div>
                        <div className={`normal-text ${styles['meta-text']}`}>{asset.createdAt}</div>
                    </div>
                    <div className={styles['field-wrapper']}>
                        <div className={`secondary-text ${styles.field}`}>Extension</div>
                        <div className={`normal-text ${styles['meta-text']}`}>{asset.extension}</div>
                    </div>
                    <div className={styles['field-wrapper']}>
                        <div className={`secondary-text ${styles.field}`}>Dimensions</div>
                        <div className={`normal-text ${styles['meta-text']}`}>{asset.Dimensions}</div>
                    </div>
                    <div className={styles['field-wrapper']}>
                        <div className={`secondary-text ${styles.field}`}>Size</div>
                        <div className={`normal-text ${styles['meta-text']}`}>{asset.size}</div>
                    </div>
                    <div className={styles['field-wrapper']}>
                        <div className={`secondary-text ${styles.field}`}>Resolution</div>
                        <div className={`normal-text ${styles['meta-text']}`}>{asset.dpi}</div>
                    </div>
                </div>

                <div className={styles['second-section']}>
                    <section className={styles['field-wrapper']} >
                        <CreatableSelect
                            title='Tags'
                            addText='Add Tags'
                            onAddClick={() => setActiveDropdown('tags')}
                            selectPlaceholder={'Enter a new tag or select an existing one'}
                            avilableItems={inputTags}
                            setAvailableItems={setInputTags}
                            selectedItems={asset.tags}
                            setSelectedItems={() => console.log('set tags')}
                            onAddOperationFinished={() => setActiveDropdown('')}
                            onRemoveOperationFinished={() => null}
                            onOperationFailedSkipped={() => setActiveDropdown('')}
                            asyncCreateFn={() => null}
                            dropdownIsActive={activeDropdown === 'tags'}
                            isShare={false}
                            isBulkEdit={true}
                            canAdd={true}
                        />
                    </section>

                    <section className={styles['field-wrapper']} >
                        <CreatableSelect
                            title='Collections'
                            addText='Add to Collection'
                            onAddClick={() => setActiveDropdown('collections')}
                            selectPlaceholder={'Enter a new collection or select an existing one'}
                            avilableItems={inputFolders}
                            setAvailableItems={setInputFolders}
                            selectedItems={asset.folders}
                            setSelectedItems={() => console.log('set folders')}
                            onAddOperationFinished={() => setActiveDropdown('')}
                            onRemoveOperationFinished={() => null}
                            onOperationFailedSkipped={() => setActiveDropdown('')}
                            asyncCreateFn={() => null}
                            dropdownIsActive={activeDropdown === 'collections'}
                            altColor='yellow'
                            isShare={false}
                            isBulkEdit={true}
                            canAdd={true}
                        />
                    </section>

                    {inputCustomFields.map((field, index) => {
                        if (field.type === 'selectOne' && addMode) {
                            return <section className={styles['field-wrapper']} >
                                <div className={`secondary-text ${styles.field}`}>{field.name}</div>
                                <CustomFieldSelector
                                    data={assetCustomFields[index]?.values[0]?.name}
                                    options={field.values}
                                    isShare={false}
                                    onLabelClick={() => { }}
                                    handleFieldChange={(option) => { setCustomFields(index, [option]) }}
                                />
                            </section>
                        }

                        if (field.type === 'selectMultiple') {
                            return <section className={styles['field-wrapper']} key={index}>
                                <CreatableSelect
                                    creatable={false}
                                    title={field.name}
                                    addText={`Add ${field.name}`}
                                    onAddClick={() => setActiveCustomField(index)}
                                    selectPlaceholder={'Select an existing one'}
                                    avilableItems={field.values}
                                    isShare={false}
                                    setAvailableItems={() => { }}
                                    selectedItems={(assetCustomFields.filter((assetField) => assetField.id === field.id))[0]?.values || []}
                                    setSelectedItems={(data) => {
                                        setActiveCustomField(undefined)
                                        setCustomFields(index, data)
                                    }
                                    }
                                    onAddOperationFinished={(stateUpdate) => {
                                    }}
                                    onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                                        setCustomFields(index, stateUpdate)
                                    }}
                                    onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                                    asyncCreateFn={() => null}
                                    dropdownIsActive={activeCustomField === index}
                                    isBulkEdit={true}
                                    canAdd={addMode}
                                />
                            </section>
                        }
                    })}

                    <div className={styles.save}>
                        <Button text={'Save Changes'} type={'button'} styleType={'primary'} onClick={() => console.log('save')} disabled={false} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EditDetail