// External
import styles from './crop-side-panel.module.css'
import fileDownload from 'js-file-download';
import urlUtils from '../../../utils/url'
import ReactTooltip from "react-tooltip"

// APIs
import sizeApi from '../../../server-api/size'
import shareCollectionApi from '../../../server-api/share-collection'

import { Utilities } from '../../../assets'

// Contexts
import { AssetContext, LoadingContext } from '../../../context'

// Components
import IconClickable from '../buttons/icon-clickable'
import Input from "../inputs/input";
import SizeSelect from "../inputs/size-select";
import Button from "../buttons/button";
import { useContext, useState, useEffect } from "react";
import ConfirmModal from "../modals/confirm-with-rename-modal"

// Utils
import EventBus from "../../../utils/event-bus"


const CropSidePanel = ({ asset,
    onModeChange,
    mode,
    downloadImageTypes,
    imageType,
    onImageTypeChange,
    presetTypes,
    presetTypeValue,
    sizes,
    sizeValue,
    onSelectChange,
    onSizeInputChange,
    widthOriginal,
    heightOriginal,
    isShare,
    sharePath,
    onResetImageSize,
    sizeOfCrop,
    setSizeOfCrop,
    detailPosSize,
    onAddAssociate = (data) => {}
}) => {

    const { updateDownloadingStatus } = useContext(AssetContext)
    const { setIsLoading } = useContext(LoadingContext)

    const [resizeOption, setResizeOption] = useState('px')
    const [sizesValue, setSizesValue] = useState({
        percentWidth: Math.round(widthOriginal * 100 / asset.dimensionWidth),
        percentHeight: Math.round(heightOriginal * 100 / asset.dimensionHeight),
        width: widthOriginal,
        height: heightOriginal
    })
    const [lastSelectedSize, setLastSelectedSize] = useState(sizeValue)
    const [selectedSize, setSelectedSize] = useState(sizeValue)
    const [previewActive, setPreviewActive] = useState(false)
    const [relatedModalOpen, setRelatedModalOpen] = useState(false)

    const [renameValue, setRenameValue] = useState(asset.name)
    const [renameModalOpen, setRenameModalOpen] = useState(false);

    const setMode = (mode) => {
        onModeChange(mode);
        if (mode === 'resize') {
            setPreviewActive(false);
        }
    }

    // Check if should lock cropping
    const lockCropping = () => {
        // Only lock if user is choose specific preset
        // return (sizeValue && sizeValue.value !== 'none')
        // return mode === 'crop'
        return previewActive
    }

    const isCroppingMode = () => {
        return mode === 'crop'
    }

    const getImageType = (imageType) => {
        switch (imageType) {
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
        try {
            let payload = {
                assetIds: [asset.id],
                sizeId: (sizeValue && sizeValue.value === 'none') || dlSize === 'original' ? null : sizeValue.id,
                customSize: true,
                width: dlSize === 'original' ? asset.dimensionWidth : widthOriginal,
                height: dlSize === 'original' ? asset.dimensionHeight : heightOriginal,
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

            if (isShare) {
                // Download assets in shared collections
                if (sharePath) {
                    download = shareCollectionApi.downloadWithCustomSize
                } else { // Download assets in sharing assets
                    download = sizeApi.shareDownload
                }
            } else {
                download = sizeApi.download
            }

            // if(isShare){
            //     api = shareApi
            // }

            const { data } = await download(payload, filters)

            // Download file to storage
            const nameWords = asset.name.split('.')
            nameWords[nameWords.length - 1] = payload.format
            fileDownload(data, nameWords.join('.'));

            updateDownloadingStatus('none', 0, 0, '')
        } catch (e) {
            updateDownloadingStatus('error', 0, 0, 'Internal Server Error. Please try again.')
        }


        // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
    }

    const saveResizedImageAsAssociate = async (dlSize, renameValue) => {
        try {
            setIsLoading(true)

            let payload = {
                assetIds: [asset.id],
                sizeId: (sizeValue && sizeValue.value === 'none') || dlSize === 'original' ? null : sizeValue.id,
                customSize: true,
                width: dlSize === 'original' ? asset.dimensionWidth : widthOriginal,
                height: dlSize === 'original' ? asset.dimensionHeight : heightOriginal,
                format: getImageType(imageType),
                associateFile: asset.id,
                associateFileName: renameValue
            };

            const { shareJWT, code } = urlUtils.getQueryParameters()

            let totalDownloadingAssets = 1;
            let filters = {
                estimateTime: 1,
                shareJWT,
                code,
                sharePath
            }

            let download = null

            if (isShare) {
                // Download assets in shared collections
                if (sharePath) {
                    download = shareCollectionApi.downloadWithCustomSize
                } else { // Download assets in sharing assets
                    download = sizeApi.shareDownload
                }
            } else {
                download = sizeApi.download
            }

            const { data } = await download(payload, filters)

            onAddAssociate(data)

            setIsLoading(false)
        } catch (e) {
        }
    }

    const resetResizeOption = (option) => {
        setResizeOption(option);
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
        const width = mode === 'crop' ? sizeOfCrop.width : widthOriginal;
        const height = mode === 'crop' ? sizeOfCrop.height : heightOriginal;
        const dimensionWidth = mode === 'crop' ? widthOriginal : asset.dimensionWidth
        const dimensionHeight = mode === 'crop' ? heightOriginal : asset.dimensionHeight
        setSizesValue({
            percentWidth: Math.round(width * 100 / dimensionWidth),
            percentHeight: Math.round(height * 100 / dimensionHeight),
            width: width,
            height: height
        })
    }, [widthOriginal, heightOriginal, mode, sizeOfCrop, detailPosSize, presetTypeValue]);


    useEffect(() => {
        setSelectedSize(sizeValue)
    }, [sizeValue]);

    const onChangeResize = (value, name) => {
        if (isCroppingMode()) {

            if (resizeOption === '%') {
                value = name === 'width' ? Math.round(value * widthOriginal / 100) : Math.round(value * heightOriginal / 100)
            }
            if (name === "width" && value > widthOriginal) {
                value = widthOriginal
            }
            if (name === "height" && value > heightOriginal) {
                value = heightOriginal
            }
            setSizeOfCrop(prev => ({
                ...prev,
                [name]: Math.round(value) || 0
            }))
        } else {
            onSizeInputChange(name, value, resizeOption)
        }
    }

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
                                                onClick={() => { onImageTypeChange(type.value) }} />
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
                                    onChange={(e) => { onChangeResize(parseInt(e.target.value), 'width') }}
                                    placeholder={'Width'}
                                    additionalClasses={'center-input'}
                                    type={'number'}
                                    // defaultValue
                                    value={resizeOption === "%" ? sizesValue.percentWidth : sizesValue.width}
                                    styleType={'regular-height-short'} />
                            </div>
                            <div className={'col-50'}>
                                <label className={styles['input-label']}>
                                    Height ({resizeOption})
                                </label>
                                <Input
                                    disabled={lockCropping()}
                                    onChange={(e) => { onChangeResize(parseInt(e.target.value), 'height') }}
                                    placeholder={'Height'}
                                    type={'number'}
                                    value={resizeOption === "%" ? sizesValue.percentHeight : sizesValue.height}
                                    additionalClasses={'center-input'}
                                    styleType={'regular-height-short'} />

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
                            onChange={(value) => { onSelectChange('preset', value) }}
                            value={presetTypeValue}
                            isClearable={false}
                            additionalClass={'font-weight-normal m-l-0'}
                            disabled={lockCropping()}
                        />
                    </div>
                </div>

                <div className={`${styles['field-wrapper']} ${styles['hide-on-mobile']}`} >
                    <div className={`${styles.title}`}>Size</div>
                    <div className={styles['field-content']}>
                        <SizeSelect
                            options={sizes.map((size) => { size.label = size.label || size.name; size.value = size.value || size.name; return size })}
                            placeholder='Select size'
                            styleType='filter'
                            onChange={(value) => { onSelectChange('size', value) }}
                            value={selectedSize}
                            isClearable={false}
                            additionalClass={'font-weight-normal m-l-0'}
                            disabled={lockCropping()}
                        />
                    </div>
                </div>
            </>}

            <div className={`${styles['save-changes']} ${styles['save-preview-btn-row']}`}>
                {mode === 'crop' ?
                    <Button className={'m-r-15'}
                        text={previewActive ? 'Close Preview' : 'View Preview'}
                        type='button'
                        styleType='secondary'
                        onClick={() => togglePreview()} />
                    :
                    <Button className={'m-r-15'}
                        text='Reset Changes'
                        type='button'
                        styleType='secondary'
                        onClick={() =>
                            onResetImageSize()
                        } />
                }
                <Button text={'Download Edited'}
                    type={'button'}
                    styleType={'primary-navy'}
                    onClick={() => {
                        if (mode === 'crop') {
                            document.getElementById('download-crop-image').click()
                        } else {
                            downloadImage('resized')
                        }
                    }}
                    disabled={!widthOriginal || !heightOriginal || !sizeValue}
                />
                <Button
                    className={'m-t-40'}
                    text='Save as Related File'
                    type='button'
                    styleType='secondary'
                    onClick={
                    () => {
                        let name = asset.name.substring(0, asset.name.lastIndexOf('.')) || asset.name;
                        let extension = asset.name.substring(asset.name.lastIndexOf('.'), asset.name.length) || "";
                        setRenameValue(`${name}-crop-${new Date().getTime()}${extension}`)
                        setRelatedModalOpen(true)
                    }
                }
                />
                <ConfirmModal
                    closeModal={() => setRelatedModalOpen(false)}
                    confirmAction={(data) => {
                        if (mode === 'crop') {
                            EventBus.dispatch(EventBus.Event.SAVE_CROP_RELATED_FILE, { renameValue: data})
                            // document.getElementById('associate-crop-image').click()
                        } else {
                            saveResizedImageAsAssociate('resized', data);
                            // downloadImage('resized')
                        }
                        setRelatedModalOpen(false)
                    }}
                    confirmText={"Confirm"}
                    message={
                       "Are you sure you want to save"
                    }
                    secondMessage={" as Related File?"}
                    modalIsOpen={relatedModalOpen}
                    initialValue={renameValue}
                />
            </div>

            <div className={styles['save-changes']}>
                <Button className={'m-r-15'}
                    text='Cancel'
                    type='button'
                    styleType='secondary'
                    onClick={() => setMode('detail')} />
                <Button text={'Download Original'}
                    type={'button'}
                    styleType={'primary'}
                    onClick={() => {
                        downloadImage('original')
                    }}
                    disabled={!widthOriginal || !heightOriginal}
                />
            </div>

        </div>
    )
}

export default CropSidePanel
