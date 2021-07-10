// External
import styles from './crop-side-panel.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'
import ReactSelect from 'react-select'
import { useEffect, useState, useContext } from 'react'
import { format } from 'date-fns'
import { capitalCase } from 'change-case'
import filesize from 'filesize'

// APIs
import tagApi from '../../../server-api/tag'
import customFieldsApi from '../../../server-api/attribute'
import assetApi from '../../../server-api/asset'
import projectApi from '../../../server-api/project'
import campaignApi from '../../../server-api/campaign'
import folderApi from '../../../server-api/folder'

// Contexts
import { AssetContext, UserContext, FilterContext, LoadingContext } from '../../../context'

// Utils
import { getParsedExtension } from '../../../utils/asset'
import { Utilities } from '../../../assets'
import channelSocialOptions from '../../../resources/data/channels-social.json'
import {
    CALENDAR_ACCESS
} from '../../../constants/permissions'

// Components
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'
import ChannelSelector from '../items/channel-selector'
import CustomFieldSelector from "../items/custom-field-selector"
import CreatableSelect from '../inputs/creatable-select'
import ProjectCreationModal from '../modals/project-creation-modal'
import ProductAddition from './product-addition'
import Input from "../inputs/input";
import SizeSelect from "../inputs/size-select";
import Button from "../buttons/button";


const CropSidePanel = ({ asset,
                           onModeChange,
                           mode,
                           downloadImageTypes,
                           imageType,
                           onImageTypeChange ,
                           presetTypes,
                           presetTypeValue,
                           sizes,
                           sizeValue,
                           onSelectChange,
                           width,
                           height
                       }) => {



    const setMode = (data) => {
        onModeChange(data)
    }

    const lockCropping = () => {
        // Only lock if user is choose specific preset
        return (sizeValue && sizeValue.value !== 'none')
    }

    return (
        <div className={styles.container}>
            <h2>Download Options</h2>

            <div className={styles['field-wrapper']} >
                <div className={`${styles.title}`}>Mode</div>
                <div className={styles['field-content']}>
                    <div className={styles['field-radio-wrapper']}>
                        <div className={'m-r-15'}>
                            <IconClickable
                                src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => setMode('resize')} />
                            <div className={'font-12'}>Resize</div>
                        </div>
                        <div>
                            <IconClickable
                                src={mode === 'crop' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => setMode('crop')} />
                            <div className={'font-12'}>Crop</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['field-wrapper']} >
                <div className={`${styles.title}`}>Type</div>
                <div className={styles['field-content']}>
                    <ul className={`${styles['item-list']}`}>
                        {downloadImageTypes.map((type, index) => {
                            const isSelected = imageType === type.value
                            return (
                                <li key={index} className={`${styles['select-item']}`}>
                                    <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
                                        {isSelected ?
                                            <IconClickable
                                                src={Utilities.radioButtonEnabled}
                                                additionalClass={styles['select-icon']}
                                            />
                                            :
                                            <IconClickable
                                                src={Utilities.radioButtonNormal}
                                                additionalClass={styles['select-icon']}
                                                onClick={()=>{onImageTypeChange(type.value)}} />
                                        }
                                    </div>
                                    <p className={styles['item-name']}>{type.label}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            <div className={styles['field-wrapper']} >
                <div className={`${styles.title}`}>Resize</div>
                <div className={styles['field-content']}>
                    <div className={'row'}>
                        <div className={'col-50 m-l-abs-15'}>
                            <label className={styles['input-label']}>
                                Width (px)
                            </label>
                            <Input
                                disabled={lockCropping()}
                                onChange={(e)=>{}}
                                placeholder={'Width'}
                                additionalClasses={'center-input'}
                                type={'number'}
                                value={width || asset.dimensionWidth}
                                styleType={'regular-height-short'} />
                        </div>
                        <div className={'col-50'}>
                            <label className={styles['input-label']}>
                                Height (px)
                            </label>
                            <Input
                                disabled={lockCropping()}
                                onChange={(e)=>{}}
                                placeholder={'Height'}
                                type={'number'}
                                value={height || asset.dimensionHeight}
                                additionalClasses={'center-input'}
                                styleType={'regular-height-short'} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['field-wrapper']} >
                <div className={`${styles.title}`}>Preset Type</div>
                <div className={styles['field-content']}>
                    <SizeSelect
                        options={presetTypes}
                        placeholder='Select preset'
                        styleType='filter'
                        onChange={(value)=>{onSelectChange('preset', value)}}
                        value={presetTypeValue}
                        isClearable={false}
                        additionalClass={'font-weight-normal m-l-0'}
                    />
                </div>
            </div>

            <div className={styles['field-wrapper']} >
                <div className={`${styles.title}`}>Size</div>
                <div className={styles['field-content']}>
                    <SizeSelect
                        options={sizes}
                        placeholder='Select size'
                        styleType='filter'
                        onChange={(value)=>{onSelectChange('size', value)}}
                        value={sizeValue}
                        isClearable={false}
                        additionalClass={'font-weight-normal m-l-0'}
                    />
                </div>
            </div>

            <div className={styles['save-changes']}>
                <Button className={'m-r-15'}
                        text='Cancel'
                        type='button'
                        styleType='secondary'
                        onClick={() => setMode('detail')} />
                <Button text={'Download'}
                        type={'button'}
                        styleType={'primary'}
                        onClick={()=>{
                            if(mode === 'crop'){
                                document.getElementById('download-crop-image').click()
                            }
                        }}
                        disabled={false}
                />
            </div>

        </div >
    )
}

export default CropSidePanel
