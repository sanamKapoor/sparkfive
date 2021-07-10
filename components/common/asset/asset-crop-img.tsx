import ReactCrop from 'react-image-crop';
import { useState, useCallback, useRef, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css';

import styles from './asset-img.module.css'

import { Assets } from "../../../assets"

const AssetCropImg = ({ assetImg, type = 'image', name, opaque = false, width = 100, height = 100 , locked = true}) => {

	const previewCanvasRef = useRef(null);
	const imgRef = useRef(null);
	const [loaded, setLoaded] = useState(false)
	const [crop, setCrop] = useState<any>({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
	const [completedCrop, setCompletedCrop] = useState(null);

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
		const pixelRatio = window.devicePixelRatio;

		canvas.width = crop.width * pixelRatio;
		canvas.height = crop.height * pixelRatio;


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
			crop.width,
			crop.height
		);
	}, [completedCrop]);


	const generateDownload = (canvas, crop) => {
		if (!crop || !canvas) {
			return;
		}

		canvas.toBlob(
			(blob) => {
				const previewUrl = window.URL.createObjectURL(blob);

				const anchor = document.createElement('a');
				anchor.download = name;
				anchor.href = URL.createObjectURL(blob);
				anchor.click();

				window.URL.revokeObjectURL(previewUrl);
			},
			'image/png',
			1
		);
	}

	useEffect(()=>{

		if(imgRef.current){

			// Center crop box
			const image = imgRef.current;

			const scaleX = image.naturalWidth / image.width;
			const scaleY = image.naturalHeight / image.height;


			const widthPercent = width / (image.width) * scaleX * 100
			const heightPercent = height/ (image.height) * scaleY * 100

			setCrop({
				unit: '%',
				width: widthPercent,
				height: heightPercent,
				x: (100 - widthPercent)/2,
				y: (100 - heightPercent)/2,
			});
		}else{
			setCrop({
				unit: '%',
				width: 100,
				height: 100,
				x: 0,
				y: 0,
			});
		}
	},[width, height])

	const imageComponent = (
		<img
				crossOrigin={'anonymous'}
			 src={finalImg}
			 alt={name}
			 className={`${styles.asset} ${opaque && styles.opaque}`}
			 onLoad={(e) => {
				imgRef.current = e.target;

			 	setLoaded(true)
				e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));

				 setCrop({
					 unit: '%',
					 width: 100,
					 height: 100,
					 x: 0,
					 y: 0,
				 });
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
	);

	return (
		<>
			<img src={Assets.empty} alt={'blank'} style={loaded ? { display: "none" } : {}} />
			<ReactCrop
				src={finalImg}
				// onImageLoaded={onLoad}
				renderComponent={imageComponent}
				crop={crop}
				locked={locked}
				ruleOfThirds={true}
				className={`${styles.asset} ${opaque && styles.opaque}`}
				onChange={(c) => setCrop(c)}
				onComplete={(c) => setCompletedCrop(c)}
				keepSelection={true}
			/>
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
				disabled={!completedCrop?.width || !completedCrop?.height}
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
