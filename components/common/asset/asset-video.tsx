import styles from './asset-video.module.css'

const AssetVideo = ({ realUrl, asset, additionalClass, bulkSize = false }) => (
	<div className={`${styles.wrapper} ${additionalClass} ${bulkSize && styles['bulk-size']}`}>
		<video width='300' height='auto' preload='metadata' onLoad={() => console.log('load')}>
			<source src={realUrl}
				type={`video/${asset.extension}`} />
		</video>
	</div>
)

export default AssetVideo