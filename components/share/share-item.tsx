import styles from './share-item.module.css'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'

// Component
import AssetImg from '../common/asset/asset-img'
import Button from '../common/buttons/button'
import DetailOverlay from '../common/asset/detail-overlay'

const ShareItem = ({
	asset,
	thumbailUrl,
	realUrl
}) => {

	const [visibleOverlay, setVisibleOVerlay] = useState(false)

	useEffect(() => {
		if (visibleOverlay) {
			document.body.classList.add('no-overflow')
		} else {
			document.body.classList.remove('no-overflow')
		}
	}, [visibleOverlay])

	return (
		<>
			<div className={styles.container}>
				<div className={styles['image-wrapper']}>
					<AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />
					<div className={styles['image-button-wrapper']}>
						<Button styleType={'primary'} text={'View Details'} type={'button'}
							onClick={() => setVisibleOVerlay(true)} />
					</div>
				</div>
				<div className={styles.info}>
					<div className='normal-text'>{asset.name}</div>
					<div className={styles['details-wrapper']}>
						<div className='secondary-text'>{format(new Date(asset.createdAt), 'MMM d, yyyy, p')}</div>
					</div>
				</div>
			</div>
			{visibleOverlay &&
				<DetailOverlay
					initiaParams={{ side: 'detail' }}
					asset={asset}
					realUrl={realUrl}
					isShare={true}
					closeOverlay={() => setVisibleOVerlay(false)} />
			}
		</>
	)
}

export default ShareItem