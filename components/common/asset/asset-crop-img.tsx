import ReactCrop, {Crop} from 'react-image-crop';
import { useState, useCallback, useRef, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css';

import styles from './asset-img.module.css'

import { Assets } from "../../../assets"

const AssetCropImg = ({ assetImg, setWidth, setHeight, imageType, type = 'image', name, opaque = false, width = 100, height = 100 , locked = true, originalHeight = 0}) => {

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
	const [crop, setCrop] = useState<Crop>(defaultCrop);
	const [completedCrop, setCompletedCrop] = useState(null);
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

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d');
		// const pixelRatio = window.devicePixelRatio;
		const pixelRatio = 1;

		canvas.width = Math.round(crop.width * pixelRatio*scaleX);
		canvas.height = Math.round(crop.height * pixelRatio*scaleY);


		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = 'high';

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			Math.round(crop.width*scaleX),
			Math.round(crop.height*scaleY)
		);
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

	useEffect(()=>{

		if(imgRef.current){

			if(!cropping){
				// Center crop box
				const image = imgRef.current;

				const scaleX = image.naturalWidth / image.width;
				const scaleY = image.naturalHeight / image.height;

				setCrop(defaultCrop);

				setCompletedCrop({
					unit: 'px',
					width: width/scaleX,
					height: height/scaleY,
					x: (image.width/2 - (width/scaleX)/2),
					y: (image.height/2 - (height)/scaleY/2),
				})
			}
		}else{
			if(!cropping){
				setCrop(defaultCrop);
			}
		}
	},[width, height])

	const onCropChange = (c) => {
		setCropping(true)
		if(c.width > 0 && c.height > 0){
			const image = imgRef.current;

			const scaleX = image.naturalWidth / image.width;
			const scaleY = image.naturalHeight / image.height;

			setWidth(Math.round(c.width*scaleX))
			setHeight(Math.round(c.height*scaleY))
		}

		c.width = Math.round(c.width)
		c.height = Math.round(c.height)
		setCrop(c)
	}

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
				// onChange={(c) => onCropChange(c)}
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

					setTimeout(()=>{
						const currentLoadedImage = document.getElementById('crop-image')


						const scaleX = currentLoadedImage.naturalWidth / currentLoadedImage.width;
						const scaleY = currentLoadedImage.naturalHeight / currentLoadedImage.height;

						setCompletedCrop({
							unit: 'px',
							width: width/scaleX,
							height: height/scaleY,
							x: (currentLoadedImage.width/2 - (width/scaleX)/2),
							y: (currentLoadedImage.height/2 - (height)/scaleY/2),
						})
					},100)

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
				<canvas
					ref={previewCanvasRef}
					// Rounding is important so the canvas width and height matches/is a multiple for sharpness.
					style={{
						width: Math.round(completedCrop?.width ?? 0),
						height: Math.round(completedCrop?.height ?? 0)
					}}
				/>
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
