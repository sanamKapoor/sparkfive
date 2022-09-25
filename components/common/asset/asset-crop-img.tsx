import ReactCrop, {
	Crop,
	PixelCrop,
} from 'react-image-crop'
import { useState, useRef, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css';
import styles from './asset-img.module.css'
import { Assets } from "../../../assets"
import React from 'react';

const AssetCropImg = ({ sizeOfCrop, setSizeOfCrop, assetImg, setWidth, setHeight, imageType, type = 'image', name, opaque = false, width = 100, height = 100, locked = true, detailPosSize }) => {

	const previewCanvasRef = useRef(null);
	const imgRef = useRef(null);
	const [loaded, setLoaded] = useState(false)
	const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, width: 0, height: 0, unit: 'px' })
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
	const [cropping, setCropping] = useState(false);
	const [mode, setMode] = useState('edit');
	const [scaleCrop, setScaleCrop] = useState<{ scaleWidth: number, scaleHeight: number } | null>(null)

	let finalImg = assetImg
	if (!finalImg && type === 'video') finalImg = Assets.videoThumbnail

	if (!finalImg) finalImg = Assets.empty
	useEffect(() => {
		const scaleWidth = sizeOfCrop.width / width;
		const scaleHeight = sizeOfCrop.height / height;
		const CropWidth = detailPosSize.width * scaleWidth;
		const CropHeight = detailPosSize.height * scaleHeight;
		const cropState = (prevState) => {
			return {
				...prevState,
				width: Math.round(CropWidth),
				height: Math.round(CropHeight)
			}
		}
		setCrop(prev => cropState(prev))
		setCompletedCrop(prev => cropState(prev))

	}, [sizeOfCrop, width, height, detailPosSize, scaleCrop])

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
			return;
		}

		const image = imgRef.current as HTMLImageElement;
		const canvas = previewCanvasRef.current as HTMLCanvasElement;

		const ctx = canvas.getContext('2d')

		if (!ctx) {
			throw new Error('No 2d context')
		}

		const scaleX = Math.round(image.naturalWidth / image.width)
		const scaleY = Math.round(image.naturalHeight / image.height)
		// devicePixelRatio slightly increases sharpness on retina devices
		// at the expense of slightly slower render times and needing to
		// size the image back down if you want to download/upload and be
		// true to the images natural size.
		// const pixelRatio = window.devicePixelRatio
		const pixelRatio = 1

		canvas.width = Math.floor(sizeOfCrop.width * pixelRatio)
		canvas.height = Math.floor(sizeOfCrop.height * pixelRatio)

		// ctx.scale(pixelRatio, pixelRatio)
		ctx.imageSmoothingQuality = 'high'

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			sizeOfCrop.width,
			sizeOfCrop.height,
		)

	}, [completedCrop, imgRef.current, crop]);

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
		// const pixelRatio = window.devicePixelRatio
		const pixelRatio = 1

		canvas.width = Math.floor(sizeOfCrop.width * pixelRatio)
		canvas.height = Math.floor(sizeOfCrop.height * pixelRatio)

		ctx.imageSmoothingQuality = 'high'
		
		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			sizeOfCrop.width,
			sizeOfCrop.height,
		)

		ctx.restore()
	}


	const convertImageType = (type) => {
		if (type === 'jpg') {
			return 'jpeg'
		} else {
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
		const scaleWidth = c.width / detailPosSize.width;
		const scaleHeight = c.height / detailPosSize.height;
		setSizeOfCrop({
			width: Math.round(width * scaleWidth),
			height: Math.round(height * scaleHeight)
		})
	}
	return (
		<>
			{!loaded && <img src={Assets.empty} alt={'blank'} style={{ position: 'absolute', width: width, height: height }} />}

			<ReactCrop
				crop={crop}
				// locked={locked}
				ruleOfThirds={true}
				className={`${styles['react-crop']} ${mode == 'preview' ? "display-none" : ""}`}
				onChange={(e) => {
					setCrop(e)
				}}
				onComplete={(c) => onCropMoveComplete(c)}
				keepSelection={true}
				style={{ width: detailPosSize.width, height: detailPosSize.height }}
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

						const initWidth = sizeOfCrop.width
						const initHeight = sizeOfCrop.height
						setCrop({
							unit: 'px',
							x: 0,
							y: 0,
							width: initWidth,
							height: initHeight
						});
						setSizeOfCrop({ width: initWidth, height: initHeight })
					}}
					style={loaded ? {
						objectFit:'fill'
					} : {
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
							crop,
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
