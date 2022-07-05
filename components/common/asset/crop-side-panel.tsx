// External
import styles from './crop-side-panel.module.css'
import fileDownload from 'js-file-download';
import urlUtils from '../../../utils/url'

// APIs
import sizeApi from '../../../server-api/size'
import shareCollectionApi from '../../../server-api/share-collection'

import { Utilities } from '../../../assets'

// Contexts
import { AssetContext } from '../../../context'

// Components
import IconClickable from '../buttons/icon-clickable'
import Input from "../inputs/input";
import SizeSelect from "../inputs/size-select";
import Button from "../buttons/button";
import {useContext, useState, useEffect} from "react";
import ReactTooltip from "react-tooltip";


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
                           onSizeInputChange,
                           width,
                           height,
                           isShare,
                           sharePath
                       }) => {

    const { updateDownloadingStatus } = useContext(AssetContext)

    const [resizeOption, setResizeOption] = useState('px')
    const [percentWidth, setPercentWidth] = useState(Math.round(width*100/asset.dimensionWidth))
    const [percentHeight, setPercentHeight] = useState(Math.round(height*100/asset.dimensionHeight))
    const [lastSelectedSize, setLastSelectedSize] = useState(sizeValue)
    const [selectedSize, setSelectedSize] = useState(sizeValue)
    const [previewActive, setPreviewActive] = useState(false)

    const setMode = (mode) => {
        onModeChange(mode)
        if (mode === 'resize') {
            setPreviewActive(false)
        }
    }

    // Check if should lock cropping
    const lockCropping = () => {
        // Only lock if user is choose specific preset
        return (sizeValue && sizeValue.value !== 'none')
    }

    const getImageType = (imageType) => {
        switch (imageType){
            case 'jpeg': {
                return 'jpg'
            }
            case 'tif': {
                return 'tiff'
            }
            default: {
                return imageType
            }
        }
    }

    const downloadImage = async (dlSize) => {
        try{
            let payload = {
                assetIds: [asset.id],
                sizeId: (sizeValue && sizeValue.value === 'none') || dlSize === 'original' ? null : sizeValue.id,
                customSize: true,
                width: dlSize === 'original' ? asset.dimensionWidth : width,
                height: dlSize === 'original' ? asset.dimensionHeight : height,
                format: getImageType(imageType)
            };

            const { shareJWT, code } = urlUtils.getQueryParameters()

            let totalDownloadingAssets = 1;
            let filters = {
                estimateTime: 1,
                shareJWT,
                code,
                sharePath
            }

            // Add sharePath property if user is at share collection page
            // if(sharePath){
            //     filters['sharePath'] = sharePath
            // }

            // Show processing bar
            updateDownloadingStatus('preparing', 0, totalDownloadingAssets)

            let download = null

            if(isShare){
                // Download assets in shared collections
                if(sharePath){
                    download = shareCollectionApi.downloadWithCustomSize
                }else{ // Download assets in sharing assets
                    download = sizeApi.shareDownload
                }
            }else{
                download = sizeApi.download
            }

            // if(isShare){
            //     api = shareApi
            // }

            const { data } = await download(payload,filters)

            // Download file to storage
            const nameWords = asset.name.split('.')
            nameWords[nameWords.length-1] = payload.format
            fileDownload(data, nameWords.join('.'));

            updateDownloadingStatus('none', 0, 0, '')
        }catch (e){
            updateDownloadingStatus('error', 0, 0, 'Internal Server Error. Please try again.')
        }


        // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
    }

    const resetResizeOption = (option) => {
        setResizeOption(option);
    }

    const _setSelectedSize = (value) => {
        setLastSelectedSize(value);
        setSelectedSize(value);
    }

    const togglePreview = () => {
        if (mode === 'crop') {
            document.getElementById('crop-preview').click()
            setPreviewActive(!previewActive)
        } else {
            onSelectChange('size', lastSelectedSize)
        }
    }

    useEffect(() => {
        setPercentWidth(Math.round(width*100/asset.dimensionWidth));
        setPercentHeight(Math.round(height*100/asset.dimensionHeight));
    }, [width, height]);


    useEffect(() => {
        setSelectedSize(sizeValue)
    }, [sizeValue]);

console.log(sizeValue)

    return (
        <div className={styles.container}>
            <h2>Download Options</h2>

            <div className={styles['field-wrapper']}>
                <div className={`${styles.title}`}>Mode</div>
                <div className={styles['field-content']}>
                    <div className={styles['field-radio-wrapper']}>
                        <div className={`${styles['radio-button-wrapper']} m-r-15`} data-tip data-for={'resize'}>
                            <IconClickable
                                src={mode === 'resize' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                additionalClass={styles['select-icon']}
                                onClick={() => setMode('resize')} />
                            <div className={'font-12 m-l-15'}>Resize</div>
                        </div>
                        <ReactTooltip place={'bottom'} id={'resize'} delayShow={300} effect='solid'>{'Resize image at desired dimensions when ratio is maintained'}</ReactTooltip>
                        {asset.extension !== 'svg' && asset.extension !== 'tiff' && asset.extension !== 'tif' && <>
                            <div className={`${styles['radio-button-wrapper']} ${styles['hide-on-mobile']}`} data-tip data-for={'crop'}>
                                <IconClickable
                                    src={mode === 'crop' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                                    additionalClass={styles['select-icon']}
                                    onClick={() => setMode('crop')} />
                                <div className={'font-12 m-l-15'}>Crop</div>
                            </div>
                            <ReactTooltip place={'bottom'} id={'crop'} delayShow={300} effect='solid'>{'Crop image at desired ratio'}</ReactTooltip>
                        </>}
                    </div>
                </div>
            </div>

            <div className={styles['field-wrapper']} >
                <div className={`${styles.title}`}>Type</div>
                <div className={styles['field-content']}>
                    <ul className={`${styles['item-list']}`}>
                        {downloadImageTypes.map((type, index) => {
                            const isSelected = (getImageType(imageType)) === type.value
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

            {asset.extension !== 'svg' && <>
                <div className={`${styles['field-wrapper']} ${styles['hide-on-mobile']}`} >
                    <div className={`${styles.title}`}>
                        <span>Resize</span>
                        <span className={`${styles['resize-option']} ${resizeOption === "px" ? styles['selected'] : ""}`} onClick={() => resetResizeOption('px')}>px</span>
                        <span className={`${styles['resize-option']} ${resizeOption === "%" ? styles['selected'] : ""}`} onClick={() => resetResizeOption('%')}>%</span>
                    </div>
                    <div className={styles['field-content']}>
                        <div className={'row'}>
                            <div className={'col-50 m-l-abs-15'}>
                                <label className={styles['input-label']}>
                                    Width ({resizeOption})
                                </label>
                                <Input
                                    disabled={lockCropping()}
                                    onChange={(e)=>{onSizeInputChange('width', parseInt(e.target.value))}}
                                    placeholder={'Width'}
                                    additionalClasses={'center-input'}
                                    type={'number'}
                                    // defaultValue
                                    value={resizeOption === "%" ? percentWidth : width}
                                    styleType={'regular-height-short'} />
                            </div>
                            <div className={'col-50'}>
                                <label className={styles['input-label']}>
                                    Height ({resizeOption})
                                </label>
                                <Input
                                    disabled={lockCropping()}
                                    onChange={(e)=>{onSizeInputChange('height', parseInt(e.target.value))}}
                                    placeholder={'Height'}
                                    type={'number'}
                                    value={resizeOption === "%" ? percentHeight : height}
                                    additionalClasses={'center-input'}
                                    styleType={'regular-height-short'}/>
                                    
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${styles['field-wrapper']} ${styles['hide-on-mobile']}`} >
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

                <div className={`${styles['field-wrapper']} ${styles['hide-on-mobile']}`} >
                    <div className={`${styles.title}`}>Size {sizeValue && sizeValue.value !== 'none' ? 'yes' : 'no'}..</div>
                    <div className={styles['field-content']}>
                        <SizeSelect
                            options={sizes.map((size) => { size.label = size.label || size.name; size.value = size.value || size.name; return size})}
                            placeholder='Select size'
                            styleType='filter'
                            onChange={(value)=>{_setSelectedSize(value)}}
                            value={selectedSize}
                            isClearable={false}
                            additionalClass={'font-weight-normal m-l-0'}
                        />
                    </div>
                </div>
            </>}

            {selectedSize && selectedSize.value!=='none' || mode === 'crop' && 
            <div className={`${styles['save-changes']} ${styles['save-preview-btn-row']}`}>
                <Button className={'m-r-15'}
                        text={previewActive ? 'Close Preview' : 'View Preview'}
                        type='button'
                        styleType='secondary'
                        onClick={() => togglePreview()} />
                <Button text={'Download Edited'}
                        type={'button'}
                        styleType={'primary'}
                        onClick={()=>{
                            if(mode === 'crop'){
                                document.getElementById('download-crop-image').click()
                            }else{
                                downloadImage('resized')
                            }
                        }}
                        disabled={!width || !height || !sizeValue}
                />
            </div>}
            
            <div className={styles['save-changes']}>
                <Button className={'m-r-15'}
                        text='Cancel'
                        type='button'
                        styleType='secondary'
                        onClick={() => setMode('detail')} />
                <Button text={'Download Original'}
                        type={'button'}
                        styleType={'primary'}
                        onClick={()=>{
                            downloadImage('original')
                        }}
                        disabled={!width || !height}
                />
            </div>

        </div >
    )
}

export default CropSidePanel
