import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'
import { useState, useCallback, useRef, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css';

import styles from './asset-img.module.css'

import { Assets } from "../../../assets"

const AssetCropImg = ({ assetImg, setWidth, setHeight, imageType, type = 'image', name, opaque = false, width = 100, height = 100 , locked = true, originalHeight = 0}) => {

	const defaultCrop = {
		unit: '%' as const,
		x: 25,
		y: 25,
		width:50,
		height: 50
	}

	const previewCanvasRef = useRef(null);
	const imgRef = useRef(null);
	const [loaded, setLoaded] = useState(false)
	const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [cropping, setCropping] = useState(false);

	let finalImg = assetImg
	if (!finalImg && type === 'video') finalImg = Assets.videoThumbnail

	if (!finalImg) finalImg = Assets.empty

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
			return;
		}

		const image = imgRef.current;
		const canvas = previewCanvasRef.current;
		const crop = completedCrop;

		const ctx = canvas.getContext('2d')

		if (!ctx) {
			throw new Error('No 2d context')
		}

		const scale = 1
		const scaleX = image.naturalWidth / image.width
		const scaleY = image.naturalHeight / image.height
		// devicePixelRatio slightly increases sharpness on retina devices
		// at the expense of slightly slower render times and needing to
		// size the image back down if you want to download/upload and be
		// true to the images natural size.
		// const pixelRatio = window.devicePixelRatio
		const pixelRatio = 1

		canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
		canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

		ctx.scale(pixelRatio, pixelRatio)
		ctx.imageSmoothingQuality = 'high'

		const cropX = crop.x * scaleX
		const cropY = crop.y * scaleY

		const centerX = image.naturalWidth / 2
		const centerY = image.naturalHeight / 2

		ctx.save()

		// Move the crop origin to the canvas origin (0,0)
		ctx.translate(-cropX, -cropY)
		// Move the origin to the center of the original position
		ctx.translate(centerX, centerY)

		// Scale the image
		ctx.scale(scale, scale)
		// Move the center of the image to the origin (0,0)
		ctx.translate(-centerX, -centerY)
		ctx.drawImage(
			image,
			0,
			0,
			image.naturalWidth,
			image.naturalHeight,
			0,
			0,
			image.naturalWidth,
			image.naturalHeight,
		)

		ctx.restore()

	}, [completedCrop, imgRef.current]);

	const convertImageType = (type) => {
		if(type === 'jpg'){
			return 'jpeg'
		}else{
			return type
		}
	}


	const generateDownload = (canvas, crop) => {
		if (!crop || !canvas) {
			return;
		}

		// console.log(`image/${convertImageType(imageType)}`)

		canvas.toBlob(
			(blob) => {
				console.warn(`Export image under image/${imageType} type`)
				const previewUrl = window.URL.createObjectURL(blob);

				const anchor = document.createElement('a');
				anchor.download = `${name.substring(0, name.lastIndexOf('.'))}.${imageType}`;
				anchor.href = URL.createObjectURL(blob);
				anchor.click();

				window.URL.revokeObjectURL(previewUrl);
			},
			`image/${convertImageType(imageType)}`,
			1
		);
	}

	// useEffect(()=>{

	// 	if(imgRef.current){

	// 		if(!cropping){
	// 			// Center crop box
	// 			const image = imgRef.current;

	// 			const scaleX = image.naturalWidth / image.width;
	// 			const scaleY = image.naturalHeight / image.height;

	// 			setCrop({
	// 				unit: 'px',
	// 				width: width/scaleX,
	// 				height: height/scaleY,
	// 				x: (image.width/2 - (width/scaleX)/2),
	// 				y: (image.height/2 - (height)/scaleY/2),
	// 			});

	// 			setCompletedCrop({
	// 				unit: 'px',
	// 				width: width/scaleX,
	// 				height: height/scaleY,
	// 				x: (image.width/2 - (width/scaleX)/2),
	// 				y: (image.height/2 - (height)/scaleY/2),
	// 			})
	// 		}
	// 	}else{
	// 		if(!cropping){
	// 			setCrop(defaultCrop);
	// 		}
	// 	}
	// },[width, height])

	const onCropMoveComplete = (c) => {
		setCropping(false)
		c.width = Math.round(c.width)
		c.height = Math.round(c.height)
		setCompletedCrop(c)
	}
	

	return (
		<>
			{!loaded && <img src={Assets.empty} alt={'blank'} style={{position: 'absolute'}} />}
			<ReactCrop
				crop={crop}
				locked={locked}
				ruleOfThirds={true}
				className={`${styles['react-crop']}`}
				onChange={setCrop}
				onComplete={(c) => onCropMoveComplete(c)}
				keepSelection={true}
			>
			<img
				id={'crop-image'}
				crossOrigin={'anonymous'}
				src={finalImg}
				alt={name}
				className={`${styles.asset} ${opaque && styles.opaque}`}
				onLoad={(e) => {
					imgRef.current = e.target;

					setLoaded(true)

					e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));

					setCrop(defaultCrop);

					// setTimeout(()=>{
					// 	const currentLoadedImage = document.getElementById('crop-image')


					// 	const scaleX = currentLoadedImage.naturalWidth / currentLoadedImage.width;
					// 	const scaleY = currentLoadedImage.naturalHeight / currentLoadedImage.height;

					// 	setCompletedCrop({
					// 		unit: 'px',
					// 		width: width/scaleX,
					// 		height: height/scaleY,
					// 		x: (currentLoadedImage.width/2 - (width/scaleX)/2),
					// 		y: (currentLoadedImage.height/2 - (height)/scaleY/2),
					// 	})
					// },100)

				}}
				style={loaded ? {} : {
					opacity: 0,
					overflow: 'hidden',
					height: 0,
					width: 0,
					margin: 0,
					padding: 0,
					border: 'none'
			}} />
			</ReactCrop>
			<div className={'position-absolute visibility-hidden'}>
				{completedCrop && <canvas
					ref={previewCanvasRef}
					// Rounding is important so the canvas width and height matches/is a multiple for sharpness.
					style={{
						width: Math.round(completedCrop?.width ?? 0),
						height: Math.round(completedCrop?.height ?? 0),
            objectFit: 'contain'
					}}
				/>}
			</div>

			<button
				id={'download-crop-image'}
				className={'position-absolute visibility-hidden'}
				type="button"
				onClick={() =>
					generateDownload(previewCanvasRef.current, completedCrop)
				}
			>
				Download cropped image
			</button>
		</>
	)
}

export default AssetCropImg
