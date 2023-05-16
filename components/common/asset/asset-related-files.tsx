import React, {useContext, useEffect, useState} from 'react'
import styles from './asset-related-files.module.css'
import { Utilities, AssetOps } from '../../../assets'
import { AssetContext, LoadingContext, UserContext } from '../../../context'
import downloadUtils from "../../../utils/download"
import toastUtils from "../../../utils/toast"
import update from "immutability-helper"
import Slider from 'react-slick'
import ConfirmModal from "../modals/confirm-modal"
import AssetThumbail from './asset-thumbail'
import assetApi from "../../../server-api/asset"
import Button from '../buttons/button'
import ReactTooltip from 'react-tooltip'
import BaseModal from '../modals/base'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";
import fileDownload from "js-file-download";

import AssetRelatedFileUpload from "./asset-related-files-upload";

const NextArrow = ({ onClick }) => (
    <img className={styles.arrow} src={Utilities.circleArrowRight} alt="Arrow next" onClick={onClick} />
)

const PrevArrow = ({ onClick }) => (
    <img className={styles.arrow} src={Utilities.circleArrowLeft} alt="Arrow previous" onClick={onClick} />
)

const AssetRelatedFIles = ({ assets, associateFileId, onChangeRelatedFiles, onAddRelatedFiles, closeOverlay, outsideDetailOverlay = false, currentAsset }) => {
    const {
        updateDownloadingStatus,
        setActiveOperation,
        setOperationAssets,
        setDetailOverlayId,
        setCurrentViewAsset
    } = useContext(AssetContext)

    const { user } = useContext(UserContext)

    const { setIsLoading } = useContext(LoadingContext);

    console.log(currentAsset)


    const isAdmin = () => {
        return user.role.id === "admin" || user.role.id === "super_admin"
    }



    const [activeAssetId, setActiveAssetId] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [disassociateModal, setDisassociateModal] = useState(false)

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
        variableWidth: false,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1445,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
    }

    // const assets = [
    //     {
    //         "asset": {
    //             "id": "81b2750b-5270-4862-855a-3d108316f977",
    //             "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
    //             "folderId": null,
    //             "storageId": "b8643f50-50ce-4590-81d9-6c8ddcef0afb/AdobeStock_322956249(1).jpg",
    //             "fileName": "AdobeStock_322956249(1).jpg",
    //             "name": "AdobeStock_322956249(1).jpg",
    //             "shareJwt": null,
    //             "hasThumbail": true,
    //             "stage": "draft",
    //             "type": "image",
    //             "extension": "jpg",
    //             "dimension": "8256,5504",
    //             "size": "3198815",
    //             "createdAt": "2022-10-15T08:11:50.875Z",
    //             "updatedAt": "2022-10-15T08:11:50.875Z",
    //             "channel": null,
    //             "dimensionHeight": 5504,
    //             "dimensionWidth": 8256,
    //             "aspectRatio": 1.5,
    //             "productId": null,
    //             "fileModifiedAt": "2022-10-15T02:54:59.000Z",
    //             "status": "approved",
    //             "dpi": 300,
    //             "deletedAt": null,
    //             "originalId": null,
    //             "duplicatedAt": null,
    //             "versionGroup": "725d323a-5f7e-4133-9d95-c1af2bb3577c",
    //             "version": 1,
    //             "folders": [],
    //             "products": []
    //         },
    //         "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/b8643f50-50ce-4590-81d9-6c8ddcef0afb/AdobeStock_322956249(1).jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=JLZojOgcg7v~BN33YRtdvuiURYLqGtR0V1yQrVSv1fg8bp81qJzq6NOHyVlcx1Tp1jZoLDlvWxNBre1OXMn8j3L8PYKTEory2RLMpxJOErdPfQPEIFJkeN5MnStjj9-2G4MP~nFjl8bgTUvlBpaljt3zt6DHJz~tiynvGAgmq64b7QETLSF6PjwnpGYl6NlYfU2xvBfqdb5hXnV~LNEDXOFoy7Y0ws0f5OKSa2-8vRNvs9QafLDBqg~4XkemyAM40ODAqd5m6sEotlydj0v1r3OXquTC061eGVvcrOd4gID3J4JkfFqnxxJBZ2qaa6kvVrC842-TkFOUeI7fhCs7YA__",
    //         "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/b8643f50-50ce-4590-81d9-6c8ddcef0afb/AdobeStock_322956249(1).jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=Rs04JtH9ACgwyhdrcpSHfm8Sv-ywFCVnh88xsuZ0GG9O76ETYX6r1ENGSPp5hwG7F7mWaKnbzH-jnv01-xqasMzwoKBdPRQGVszArJmYklQVV2njj6a3QJmYkugJpKUuEPRCaFw0VuoavgDVmgT9fnzNTJslwituo8qCPUqCQjZmNJXfD9skeCgFL84lJUGFGnEG3iWz3aSef21tyBvHOToA-OLCDNsHKrw8-hbNM00NezGr3r~-AvNeyBhuPrSmQWVaeFLxZwVelhYH6K2LCQ5l9vn9i1GIUMamY-dFkbJ~rnDDnkTfwO5PiyvznTDc2RdcR3wQbNtWLAuLUygTzA__"
    //     },
    //     {
    //         "asset": {
    //             "id": "24ac40be-a784-450f-9986-b95acb64feaf",
    //             "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
    //             "folderId": null,
    //             "storageId": "eb34093a-7e9b-4b6b-8345-c75e4d8069a1/pexels-photo-378570.jpg",
    //             "fileName": "pexels-photo-378570.jpg",
    //             "name": "pexels-photo-378570.jpg",
    //             "shareJwt": null,
    //             "hasThumbail": true,
    //             "stage": "draft",
    //             "type": "image",
    //             "extension": "jpg",
    //             "dimension": "1444,924",
    //             "size": "264551",
    //             "createdAt": "2022-10-15T04:26:13.845Z",
    //             "updatedAt": "2022-10-15T04:26:13.845Z",
    //             "channel": null,
    //             "dimensionHeight": 924,
    //             "dimensionWidth": 1444,
    //             "aspectRatio": 1.563,
    //             "productId": null,
    //             "fileModifiedAt": "2022-10-15T02:46:05.000Z",
    //             "status": "approved",
    //             "dpi": 72,
    //             "deletedAt": null,
    //             "originalId": null,
    //             "duplicatedAt": null,
    //             "versionGroup": "9b8eb341-7e78-41b1-84ca-757aa6843599",
    //             "version": 1,
    //             "folders": [],
    //             "products": []
    //         },
    //         "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/eb34093a-7e9b-4b6b-8345-c75e4d8069a1/pexels-photo-378570.jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=FjHwNLuctQRSrWeI12x-QbXncWmGlsKkcKSUJD8AF1fC4AkQLlcGW9hpLVxxMp251N3EbhoLk9vdDyU3JuXoyrEU4T7Coo-NFH6swPSMhnxjLNqLkDAyovgh-hEAliVzSsOTmN0B1TLNTWVoYW2-i~nJ3nIFt-ZHLojLpbb1sonZRmv4x8skJuVSXESHfEPdEtj8aOmRn3lwnPDzodBMb1j~ngFMgGaBiE3CFxgfCuvPW~mK5LAkUY7VffJlWgu8T4YtMW3rIvKADpcOa4hM1jvWY25s2oy4bvNLVAT8oGvGo3s7zC7HB27Ae1z1EhE535ZMDpIoepwi6MTqRoFgMw__",
    //         "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/eb34093a-7e9b-4b6b-8345-c75e4d8069a1/pexels-photo-378570.jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=BN41hIWgqmg~QTL-o-dKbIAmNWNBDNZdf27QsqOC34tUEl-swZzrfM3sFUKlnAsgDW7ZeZerk9zQk6mNdOi~3OUGrF2x5kmxkYUacC7L6mdv19-dP5epORZup6KVkx5YZgmXh7kpbU7G0XrbxBMD2uCsUCFSLlWbkYme6J1h1r8EoZ6YsQASO0TpMiDAJxEULBBp~FjTUXl4Gi8Fi6w2ETnyWiD1zEVkl1KA3fprCUm6WOiNdjXZCNUOTk3nVTSIXmGmLYzHxMS2PQ4K98tJl4aTTgBKo7gkhf53FIgnIDLK87SjuQovZ7wsqXkcqS0hhgrUoBmSChdguNMnELbhVg__"
    //     },
    // ]

    const downloadAsset = (assetItem) => {
        downloadUtils.downloadFile(assetItem.realUrl, assetItem.asset.name)
    }

    const openDeleteAsset = (id) => {
        setActiveAssetId(id)
        setDeleteModalOpen(true)
    }

    const openDisassociateModal = (id) => {
        setActiveAssetId(id)
        setDisassociateModal(true)
    }

    const deleteAsset = async (id) => {
        try {
            setIsLoading(true)

            await assetApi.updateAsset(id, {
                updateData: {
                    status: "deleted",
                    stage: "draft",
                    deletedAt: new Date(new Date().toUTCString()).toISOString(),
                },
            })
            const assetIndex = assets.findIndex(
                (assetItem) => assetItem.asset.id === id
            )
            if (assetIndex !== -1)
                onChangeRelatedFiles(
                    update(assets, {
                        $splice: [[assetIndex, 1]],
                    })
                )

            setIsLoading(false)
            toastUtils.success("Assets deleted successfully")
        } catch (err) {
            setIsLoading(false)
            // TODO: Error handling
            toastUtils.error("Could not delete assets, please try again later.")
        }
    }

    const disassociateAsset = async (id) => {
        try {
            setIsLoading(true)
            await assetApi.disassociate([associateFileId, id])
            const assetIndex = assets.findIndex(
                (assetItem) => assetItem.asset.id === id
            )
            if (assetIndex !== -1)
                onChangeRelatedFiles(
                    update(assets, {
                        $splice: [[assetIndex, 1]],
                    })
                )

            setIsLoading(false)
            toastUtils.success("Assets disassociated successfully")
        } catch (err) {
            // TODO: Error handling
            setIsLoading(false)
            toastUtils.error("Could not disassociate assets, please try again later.")
        }
    }

    const downloadAllRelatedAssets = async () => {
        try {
            let payload = {
                assetIds: [],
            };
            let totalDownloadingAssets = 0;
            let filters = {
                estimateTime: 1
            }

            totalDownloadingAssets = assets.length
            payload.assetIds = assets.map(assetItem => assetItem.asset.id)
            payload.assetIds.push(currentAsset.id)


            // Show processing bar
            updateDownloadingStatus('zipping', 0, totalDownloadingAssets)
            let api = assetApi;

            const { data } = await api.downloadAll(payload, filters);
            // Download file to storage
            fileDownload(data, "assets.zip");

            updateDownloadingStatus("done", 0, 0);
        } catch (e) {
            console.error(e)
            updateDownloadingStatus('error', 0, 0, 'Internal Server Error. Please try again.')
        }

        // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets')
    }

    const shareAllRelatedAssets = () => {
        setActiveOperation('share')
    }

    useEffect(()=>{
        setOperationAssets([...assets, {asset: currentAsset}])
    },[assets])

    return (
        <>
            <div className={styles.container}>

                <div data-tip data-for={'upload'} className={assets.length > 0 ? styles['upload-wrapper'] : styles['upload-wrapper-no-asset']}>
                    {assets.length > 0 && <h3>Related Files</h3>}

                    {isAdmin() && <Button
                        text={<img src={AssetOps.upload} />}
                        type='button'
                        styleType='primary'
                        onClick={() => setUploadModalOpen(true)}
                    >
                    </Button>}
                    <ReactTooltip id={'upload'} delayShow={300} effect='solid' place={'right'}>Upload related files</ReactTooltip>
                </div>

                <BaseModal
                    showCancel={false}
                    closeButtonOnly
                    additionalClasses={[styles['modal-upload']]}
                    closeModal={() => setUploadModalOpen(false)}
                    modalIsOpen={uploadModalOpen}
                    confirmText=""
                    confirmAction={() => {
                        // setUploadModalOpen(false)
                        // setConfirmUploadModalOpen(true)
                    }}
                >
                    <AssetRelatedFileUpload currentRelatedAssets={assets} associateFileId={associateFileId} onUploadFinish={onAddRelatedFiles}/>
                </BaseModal>

                {assets.length > 0 && <>
                  <div className={styles.slider}>
                    <Slider {...settings}>
                        {assets.map((assetItem, index) => (
                            <AssetThumbail
                                {...assetItem}
                                key={index}
                                onView={(id)=>{
                                    setDetailOverlayId(undefined)
                                    if(outsideDetailOverlay){
                                        closeOverlay(assetItem);
                                    }else{
                                        closeOverlay(null, assetItem);
                                    }

                                    // setDetailOverlayId(id)
                                    // setTimeout(()=>{
                                    //     console.log(assetItem)
                                    //     setCurrentViewAsset(assetItem)
                                    // },100)

                                }}
                                // sharePath={sharePath}
                                showAssetOption={false}
                                showViewButtonOnly={true}
                                showAssetRelatedOption={true}
                                downloadAsset={() => downloadAsset(assetItem)}
                                openDeleteAsset={() =>
                                    openDeleteAsset(assetItem.asset.id)
                                }
                                onDisassociate={()=>{
                                    openDisassociateModal(assetItem.asset.id)
                                }}
                                detailOverlay={false}
                            />
                        ))}
                    </Slider>
                  </div>
                  <div className={styles['buttons-wrapper']}>
                    <Button
                      text='Download All Related Files'
                      type='button'
                      styleType='secondary'
                      onClick={downloadAllRelatedAssets}
                    />
                    <Button
                      text='Share All Related Files'
                      type='button'
                      styleType='primary'
                      onClick={shareAllRelatedAssets}
                    />
                  </div>
                </>}
            </div>

            {/* Delete modal */}
            <ConfirmModal
                closeModal={() => setDeleteModalOpen(false)}
                confirmAction={() => {
                    deleteAsset(activeAssetId)
                    setActiveAssetId("")
                    setDeleteModalOpen(false)
                }}
                confirmText={"Delete"}
                message={
                    <span>
                        Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this
                        asset?
                    </span>
                }
                modalIsOpen={deleteModalOpen}
            />

            {/* Associate modal */}
            <ConfirmModal
                closeModal={() => setDisassociateModal(false)}
                confirmAction={() => {
                    disassociateAsset(activeAssetId)
                    setActiveAssetId("")
                    setDisassociateModal(false)
                }}
                confirmText={"Disassociate"}
                message={
                   <div>Are you sure you want to <strong>Disassociate</strong> this asset?</div>
                }
                modalIsOpen={disassociateModal}
            />
        </>
    )
}

export default AssetRelatedFIles
