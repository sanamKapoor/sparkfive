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

const AssetCropImg = ({ assetImg, setWidth, setHeight, imageType, type = 'image', name, opaque = false, width = 100, height = 100 , locked = true}) => {

	const defaultCrop = {
		unit: '%' as const,
		x: 25,
		y: 25,
		width: 50,
		height: 50
	}

	const previewCanvasRef = useRef(null);
	const imgRef = useRef(null);
	const [loaded, setLoaded] = useState(false)
	const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [cropping, setCropping] = useState(false);
	const [mode, setMode] = useState('edit');

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

		const cropX = crop.x * scaleX;
		const cropY = crop.y * scaleY;

		const centerX = image.naturalWidth / 2;
		const centerY = image.naturalHeight / 2;

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

	const canvasPreview = (
		image: HTMLImageElement,
		canvas: HTMLCanvasElement,
		crop: PixelCrop,
		scale = 1,
		rotate = 0,
	) => {
		const ctx = canvas.getContext('2d')
	
		if (!ctx) {
			throw new Error('No 2d context')
		}
	
		const scaleX = image.naturalWidth / image.width
		const scaleY = image.naturalHeight / image.height
		// devicePixelRatio slightly increases sharpness on retina devices
		// at the expense of slightly slower render times and needing to
		// size the image back down if you want to download/upload and be
		// true to the images natural size.
		const pixelRatio = window.devicePixelRatio
		// const pixelRatio = 1
	
		canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
		canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
	
		ctx.scale(pixelRatio, pixelRatio)
		ctx.imageSmoothingQuality = 'high'
	
		const cropX = crop.x * scaleX
		const cropY = crop.y * scaleY
	
		const TO_RADIANS = Math.PI / 180
		const rotateRads = rotate * TO_RADIANS
		const centerX = image.naturalWidth / 2
		const centerY = image.naturalHeight / 2
	
		ctx.save()
	
		// 5) Move the crop origin to the canvas origin (0,0)
		ctx.translate(-cropX, -cropY)
		// 4) Move the origin to the center of the original position
		ctx.translate(centerX, centerY)
		// 3) Rotate around the origin
		ctx.rotate(rotateRads)
		// 2) Scale the image
		ctx.scale(scale, scale)
		// 1) Move the center of the image to the origin (0,0)
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
	}
	

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

	const onCropMoveComplete = (c) => {
		setCropping(false)
		c.width = Math.round(c.width)
		c.height = Math.round(c.height)
		setCompletedCrop(c)
	}
	

	return (
		<>
			{!loaded && <img src={Assets.empty} alt={'blank'} style={{position: 'absolute', width: width, height: height}} />}
			
			<ReactCrop
				crop={crop}
				// locked={locked}
				ruleOfThirds={true}
				className={`${styles['react-crop']} ${mode == 'preview' ? "display-none" : ""}`}
				onChange={setCrop}
				onComplete={(c) => onCropMoveComplete(c)}
				keepSelection={true}
				style={{width: width, height: height}}
			>
			<img
				id={'crop-image'}
				ref={imgRef}
				crossOrigin={'anonymous'}
				src={finalImg}
				alt={name}
				className={`${styles.asset} ${opaque && styles.opaque}`}
				onLoad={(e) => {
					imgRef.current = e.target;

					setLoaded(true)

					e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));

					setCrop(defaultCrop);

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

			<canvas
				ref={previewCanvasRef}
				className={mode === 'preview' ? '' : 'visibility-hidden'}
				style={{
					// border: '1px solid black',
					objectFit: 'contain',
					width: completedCrop && Math.round(completedCrop.width),
					height: completedCrop && Math.round(completedCrop.height),
				}}
			/>

			<button
				id={'download-crop-image'}
				className={'position-absolute visibility-hidden'}
				type="button"
				onClick={() =>
					generateDownload(previewCanvasRef.current, completedCrop)
				}
			>Download cropped image</button>

			<button
				id={'crop-preview'}
				className={'position-absolute visibility-hidden'}
				type="button"
				onClick={() => {
					const newMode = mode === 'edit' ? 'preview' : 'edit';
					setMode(newMode)
					if (newMode === 'preview') {
						canvasPreview(
							imgRef.current,
							previewCanvasRef.current,
							completedCrop,
							1,
							0,
						)
					}
				}
				}
			></button>
		</>
	)
}

export default AssetCropImg
