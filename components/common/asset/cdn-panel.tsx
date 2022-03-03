import React, { useEffect, useState } from 'react'

import Input from '../inputs/input'
import Select from '../inputs/select'

import urlUtils from '../../../utils/url'
import generalUtilns from '../../../utils/general'

import styles from './cdn-panel.module.css'

const options = {
  image: [
    { label: 'PNG', value: 'PNG' },
    { label: 'JPG', value: 'JPG'},
    { label: 'Webp', value: 'Webp'},
    { label: 'SVG', value: 'SVG'}
  ],
  video: [
    { label: 'Mp4', value: 'Mp4'},
    { label: 'MOV', value: 'MOV'},
    { label: 'Avi', value: 'Avi'}
  ]
}

const mainUrl = 'https://cdn.sparkfive.com/'

const CdnPanel = ({ assetDetail }) => {
  const [link, setLink] = useState(mainUrl)
  const [type, setType] = useState(options[assetDetail.type][0])
  const [dimension, setDimension] = useState({
    height: assetDetail.dimensionHeight,
    width: assetDetail.dimensionWidth,
    aspectRatio: assetDetail.aspectRatio
  })
  const [isLocked, setIsLocked] = useState(true)
  
  const makeLink = ({ _type, value = 0, secondValue = null, format = null}) => {
    const secondType = _type === 'height' ? 'width' : 'height'

    const qs = urlUtils.getQueryStringFromObject({
      [_type]: format ? dimension[_type] : value,
      [secondType]: !secondValue ? dimension[secondType] : secondValue,
      format: format ? format : type.value
    })

    setLink(`${mainUrl}?${qs}`)

    setDimension({
      ...dimension,
      [secondType]: !secondValue ? dimension[secondType] : secondValue,
      [_type]: format ? dimension[_type] : value
    })
  }
  
  const onInputChange = (value: number, _type: 'height' | 'width') => {
    if (!isLocked) return makeLink({_type, value})

    if (_type === 'height') return makeLink({_type, value, secondValue: Math.round(value * dimension.aspectRatio)})

    return makeLink({_type, value, secondValue: Math.round(value / dimension.aspectRatio)})
  }

  const copyToClipboard = () => {
    generalUtilns.copyToClipboard(link)
  }

  return (
    <div className={styles.container}>
      <h2>Embed Asset</h2>

      <div className={`${styles.block} ${styles.mb}`}>
        <h3 className={styles.subtitle}>CDN Link</h3>
        <div className={`${styles.input} ${styles.blockInput}`}>{link}</div>
        <button onClick={copyToClipboard} className={styles.btn}>Copy Link</button>
      </div>

      <div className={styles.block}>
        <h3 className={styles.subtitle}>Intelligent CDN</h3>

        <div className={styles.description}>
          Modify the size and/or format and the CDN link will update for various use cases
        </div>

        <div className={styles.aspectRatioContainer}>
          <div>
            <h4 className={styles.controlTitle}>Width (px)</h4>
            <Input onChange={(e) => onInputChange(Number(e.target.value), 'width')} value={dimension.width} additionalClasses={`${styles.input} ${styles.ratioInput}`} />
          </div>
          
          <div onClick={() => setIsLocked(!isLocked)} className={styles.lock}>{isLocked ? 'Locked' : 'Not Locked'}</div>

          <div>
            <h4 className={styles.controlTitle}>Height (px)</h4>
            <Input onChange={(e) => onInputChange(Number(e.target.value), 'height')} value={dimension.height} additionalClasses={`${styles.input} ${styles.ratioInput}`} />
          </div>  
        </div>

        <div>
          <h4 className={styles.controlTitle}>Type</h4>

          <Select 
            options={options[assetDetail.type]}
            value={type}
            onChange={(value) => {
              setType(value)
              makeLink({
                _type: 'width',
                format: value.value
              })
            }}
            placeholder='File Type'
            additionalClass={styles.select}
            containerClass={styles.selectContainer}
          />
        </div>

        <div className={styles.description}>
          Any time you update the asset these links will auto update to capture these changes
        </div>
      </div>
    </div>
  )
}

export default CdnPanel