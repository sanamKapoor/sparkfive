import styles from './detail-overlay.module.css'
import { Utilities } from '../../../assets'
import { saveAs } from 'file-saver'
import { useState, useEffect, useContext } from 'react'
import assetApi from '../../../server-api/asset'
import customFileSizeApi from '../../../server-api/size'
import { AssetContext } from '../../../context'
import toastUtils from '../../../utils/toast'
import update from 'immutability-helper'
import downloadUtils from '../../../utils/download'
import {
  isMobile
} from "react-device-detect"

// Components
import SidePanel from './detail-side-panel'
import ConversationList from '../conversation/conversation-list'
import IconClickable from '../buttons/icon-clickable'
import Button from '../buttons/button'
import AssetImg from './asset-img'
import AssetApplication from './asset-application'
import AssetText from './asset-text'
import RenameModal from '../modals/rename-modal'
import CropSidePanel from './crop-side-panel'
import AssetCropImg from './asset-crop-img'

const DetailOverlay = ({ asset, realUrl, closeOverlay, openShareAsset = () => { }, openDeleteAsset = () => { }, isShare = false, initialParams }) => {

  const [assetDetail, setAssetDetail] = useState(undefined)

  const [renameModalOpen, setRenameModalOpen] = useState(false)

  const [activeSideComponent, setActiveSidecomponent] = useState('detail')

  const { assets, setAssets } = useContext(AssetContext)

  const [sideOpen, setSideOpen] = useState(true)

  // For resize and cropping
  const [mode, setMode] = useState('detail') // Available options: resize, crop, detail
  const [imageType, setImageType] = useState('bmp') // Available options: bmp, png, jpg, tiff

  const [presetTypes, setPresetTypes] = useState([{ label: 'None', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight}])
  const [preset, setPreset] = useState<any>(presetTypes[0])

  const [sizes, setSizes] = useState([{ label: 'Original', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight}])
  const [tempSize, setTempSizes] = useState([]) // Keep size list value when user choose preset. This will reduce number of API calls
  const [size, setSize] = useState<any>(sizes[0])

  const [width, setWidth] = useState<number>(asset.dimensionWidth)
  const [height, setHeight] = useState<number>(asset.dimensionHeight)



  const downloadImageTypes = [
    {
      value: 'bmp',
      label: 'BMP (original)'
    },
    {
      value: 'png',
      label: 'PNG'
    },
    {
      value: 'jpg',
      label: 'JPG'
    },
    {
      value: 'tiff',
      label: 'TIFF'
    }
  ]

  const getCropResizeOptions = async () => {
    const results = await Promise.all([
        customFileSizeApi.getCustomFileSizes(),
        customFileSizeApi.getSizePresetsByGroup()
    ])

    // @ts-ignore
    setSizes(sizes.concat(results[0].data))
    // @ts-ignore
    setPresetTypes(presetTypes.concat(results[1].data))
  }

  useEffect(() => {
    getCropResizeOptions()
    getDetail()
    checkInitialParams()
    if (isMobile)
      toggleSideMenu()
  }, [])

  // useEffect(() => {
  //   const modAssetIndex = assets.findIndex(assetItem => assetItem.asset.id === assetDetail?.id)
  //   if (modAssetIndex !== -1)
  //     setAssetDetail(assets[modAssetIndex].asset)
  // }, [assets])

  const checkInitialParams = () => {
    if (initialParams?.side) {
      setActiveSidecomponent(initialParams.side)
    }
  }

  const getDetail = async () => {
    try {
      if (isShare)
        setAssetDetail(asset)
      else {
        const { data } = await assetApi.getById(asset.id)
        setAssetDetail(data.asset)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const updateAsset = async (inputData) => {
    try {
      // Optimistic data set
      setAssetDetail({
        ...assetDetail,
        ...inputData.updateData
      })
      const { data } = await assetApi.updateAsset(asset.id, inputData)
      setAssetDetail(data)
    } catch (err) {
      console.log(err)
    }
  }

  const confirmAssetRename = async (newValue) => {
    try {
      const editedName = `${newValue}.${assetDetail.extension}`
      await assetApi.updateAsset(asset.id, { updateData: { name: editedName } })
      const modAssetIndex = assets.findIndex(assetItem => assetItem.asset.id === asset.id)
      setAssets(update(assets, {
        [modAssetIndex]: {
          asset: {
            name: { $set: editedName }
          }
        }
      }))
      setAssetDetail(update(assetDetail,
        {
          name: { $set: editedName }
        }))
      toastUtils.success('Asset name updated')
    } catch (err) {
      console.log(err)
      toastUtils.error('Could not update asset name')
    }
  }

  const toggleSideMenu = (value = null) => {
    if (value === null)
      setSideOpen(!sideOpen)
    else
      setSideOpen(value)
  }

  const changeActiveSide = (side) => {
    setActiveSidecomponent(side)
    setSideOpen(true)
  }

  // On Crop/Resize select change
  const onSelectChange = (type, value) => {

    if(type === 'preset'){
      setPreset(value)

      // Restore values
      if(value.value === 'none'){
        // Set width, height as their original size
        setWidth(asset.dimensionWidth)
        setHeight(asset.dimensionHeight)

        // Set default size to none
        setSize({ label: 'Original', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight})

        // Restore size back to temp size
        setSizes(tempSize)

        // Clear temp size
        setTempSizes([])
      }else{
        // Reset size value
        setSize(undefined)

        if(tempSize.length === 0){
          // Store temp sizes
          setTempSizes(sizes)
        }

        // Set size list by preset data
        setSizes(value.data)
      }

    }

    if(type === 'size'){
      setWidth(value.width)
      setHeight(value.height)

      setSize(value)
    }
  }

  // On width, height input change
  const onSizeInputChange = (name, value) => {
    if(name === 'width'){
      setWidth(value)
    }

    if(name === 'height'){
      setHeight(value)
    }
  }

  const lockCropping = () => {
    // Only lock if user is choose specific preset
    return (preset && preset.value !== 'none') || (size && size.value !== 'none')
  }

  // Subscribe mode change, if user back/enter to detail page, should reset all size value do default
  useEffect(()=>{
    if(mode === 'detail'){
      // Set default size to none
      setSizes([{ label: 'Original', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight}])
      setPresetTypes([{ label: 'None', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight}])

      setSize({ label: 'Original', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight})
      setPreset({ label: 'None', value: 'none', width: asset.dimensionWidth, height: asset.dimensionHeight})

      setWidth(asset.dimensionWidth)
      setHeight(asset.dimensionHeight)
    }
  },[mode])

  return (
    <div className={`app-overlay ${styles.container}`}>
      {assetDetail &&
        <section className={styles.content}>
          <div className={styles['top-wrapper']}>
            <div className={styles.back} onClick={closeOverlay}>
              <IconClickable src={Utilities.back} />
              <span>Back</span>
            </div>
            <div className={styles.name}>
              <h3>
                {assetDetail.name}
              </h3>
              {!isShare && <IconClickable src={Utilities.edit} onClick={() => setRenameModalOpen(true)} />}
            </div>
            <div className={styles['asset-actions']}>
              {!isShare &&
                <Button text={'Share'} type={'button'} styleType={'primary'} onClick={openShareAsset} />
              }
              {mode === 'detail' && <Button text={'Download'}
                      type={'button'}
                      styleType={'secondary'}
                      onClick={
                        () => {
                          setMode('resize')
                        }
                      } />}
            </div>
          </div>
          <div className={styles['img-wrapper']}>
            {assetDetail.type === 'image' &&
                <>
                {(mode === 'detail' || mode === 'resize') && <AssetImg name={assetDetail.name} assetImg={realUrl} />}
                {mode === 'crop' && <AssetCropImg  locked={lockCropping()} name={assetDetail.name} assetImg={realUrl} width={width} height={height} />}
                </>
            }
            {assetDetail.type === 'application' && <AssetApplication extension={assetDetail.extension} />}
            {assetDetail.type === 'text' && <AssetText extension={assetDetail.extension} />}
            {assetDetail.type === 'video' &&
              <video controls>
                <source src={realUrl}
                  type={`video/${assetDetail.extension}`} />
                  Sorry, your browser doesn't support video playback.
            </video>
            }
          </div>
        </section>
      }
      {sideOpen &&
        <section className={styles.side}>
          {assetDetail && activeSideComponent === 'detail' &&
              <>
              {mode === 'detail' && <SidePanel asset={assetDetail} updateAsset={updateAsset} setAssetDetail={setAssetDetail} isShare={isShare} />}
              {mode !== 'detail' && <CropSidePanel
                  imageType={imageType}
                  onImageTypeChange={(type)=>{
                    setImageType(type)
                  }}
                  downloadImageTypes={downloadImageTypes}
                  presetTypes={presetTypes}
                  presetTypeValue={preset}
                  sizes={sizes}
                  sizeValue={size}
                  mode={mode}
                  width={width}
                  height={height}
                  onModeChange={(mode)=>{setMode(mode)}}
                  onSelectChange={onSelectChange}
                  onSizeInputChange={onSizeInputChange}
                  asset={assetDetail}
                 />}
              </>
          }
          {!isShare && activeSideComponent === 'comments' &&
            <ConversationList itemId={asset?.id} itemType='assets' />
          }
        </section>
      }
      {!isShare &&
        <section className={styles.menu}>
          <IconClickable src={Utilities.closePanelLight} onClick={() => toggleSideMenu()}
            additionalClass={`${styles['menu-icon']} ${!sideOpen && 'mirror'} ${styles.expand}`} />
          <div className={`${styles.separator} ${styles.expand}`}></div>
          <IconClickable
            src={Utilities.delete}
            additionalClass={styles['menu-icon']}
            onClick={openDeleteAsset} />
          <div className={styles.separator}></div>
          <IconClickable
            src={Utilities.info}
            additionalClass={styles['menu-icon']}
            onClick={() => changeActiveSide('detail')} />
          <IconClickable
            src={Utilities.comment}
            additionalClass={styles['menu-icon']}
            onClick={() => changeActiveSide('comments')} />

        </section>
      }
      <RenameModal
        closeModal={() => setRenameModalOpen(false)}
        modalIsOpen={renameModalOpen}
        renameConfirm={confirmAssetRename}
        type={'Asset'}
        initialValue={assetDetail?.name.substring(0, assetDetail.name.lastIndexOf('.'))}
      />
    </div>
  )
}

export default DetailOverlay
