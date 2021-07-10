import ReactCrop from 'react-image-crop';
import { useState, useCallback, useRef, useEffect } from 'react'
import 'react-image-crop/dist/ReactCrop.css';

import styles from './asset-img.module.css'

import { Assets } from "../../../assets"

const AssetCropImg = ({ assetImg, type = 'image', name, opaque = false, width = 100, height = 100 , locked = true}) => {

	const previewCanvasRef = useRef(null);
	const imgRef = useRef(null);
	const [loaded, setLoaded] = useState(false)
	const [crop, setCrop] = useState({ unit: 'px', width, height });
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

	const onLoad = useCallback((img) => {

		// // You must inform ReactCrop when your media has loaded.
		// e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));

		imgRef.current = img;

		// const aspect = 16 / 9;
		// const width = img.width / aspect < img.height * aspect ? 100 : ((img.height * aspect) / img.width) * 100;
		// const height = img.width / aspect > img.height * aspect ? 100 : (img.width / aspect / img.height) * 100;
		// const y = (100 - height) / 2;
		// const x = (100 - width) / 2;
		//
		// setCrop({
		// 	unit: '%',
		// 	width: 50,
		// 	x,
		// 	y,
		// 	aspect,
		// });

		setLoaded(true)

		// return false; // Return false if you set crop state in here.

	}, []);

	useEffect(()=>{
	setCrop({
			unit: 'px',
			width,
			height,
			x: width/2,
			y: height/2
		});
	},[width, height])

	const imageComponent = (
		<img
				crossOrigin={'anonymous'}
			 src={finalImg}
			 alt={name}
			 className={`${styles.asset} ${opaque && styles.opaque}`}
			 onLoad={(e) => {
			 	console.log(e.target)
				imgRef.current = e.target;

			 	setLoaded(true)
				e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));
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
			{/*<img src={Assets.empty} alt={'blank'} style={loaded ? { display: "none" } : {}} />*/}
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
