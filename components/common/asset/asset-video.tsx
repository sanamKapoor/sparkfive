import styles from './asset-video.module.css'

const AssetVideo = ({ assetImg, realUrl, asset, additionalClass, bulkSize = false, onClick }) => 
		assetImg 
			? (<img src={assetImg} className={styles.asset} crossOrigin={'anonymous'} onClick={onClick}  />)
			:(
				<div onClick={onClick} className={`${styles.wrapper} ${additionalClass} ${bulkSize && styles['bulk-size']}`}>
					<video width='300' height='auto' preload='metadata' onLoad={() => console.log('load')}>
						<source src={realUrl}
							type={`video/${asset.extension}`} />
					</video>
				</div>
			)
		


export default AssetVideo
