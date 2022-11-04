import React, { useContext, useState } from 'react'
import styles from './asset-related-files.module.css'
import { Utilities, AssetOps, Assets } from '../../../assets'
import { AssetContext } from '../../../context'
import downloadUtils from "../../../utils/download"
import toastUtils from "../../../utils/toast"
import update from "immutability-helper"

import Slider from 'react-slick'
import ConfirmModal from "../modals/confirm-modal"
import AssetThumbail from './asset-thumbail'
import assetsApi from "../../../server-api/asset"
import Button from '../buttons/button'
import ReactTooltip from 'react-tooltip'
import AssetUpload from './asset-upload'
import BaseModal from '../modals/base'
import IconClickable from '../buttons/icon-clickable'

const NextArrow = ({ onClick }) => (
    <img className={styles.arrow} src={Utilities.circleArrowRight} alt="Arrow next" onClick={onClick} />
)

const PrevArrow = ({ onClick }) => (
    <img className={styles.arrow} src={Utilities.circleArrowLeft} alt="Arrow previous" onClick={onClick} />
)

const AssetRelatedFIles = () => {
    const {
        setAssets,
    } = useContext(AssetContext)

    const [activeAssetId, setActiveAssetId] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [confirmUploadModalOpen, setConfirmUploadModalOpen] = useState(false)

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
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

    const assets = [
        {
            "asset": {
                "id": "81b2750b-5270-4862-855a-3d108316f977",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "b8643f50-50ce-4590-81d9-6c8ddcef0afb/AdobeStock_322956249(1).jpg",
                "fileName": "AdobeStock_322956249(1).jpg",
                "name": "AdobeStock_322956249(1).jpg",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "image",
                "extension": "jpg",
                "dimension": "8256,5504",
                "size": "3198815",
                "createdAt": "2022-10-15T08:11:50.875Z",
                "updatedAt": "2022-10-15T08:11:50.875Z",
                "channel": null,
                "dimensionHeight": 5504,
                "dimensionWidth": 8256,
                "aspectRatio": 1.5,
                "productId": null,
                "fileModifiedAt": "2022-10-15T02:54:59.000Z",
                "status": "approved",
                "dpi": 300,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "725d323a-5f7e-4133-9d95-c1af2bb3577c",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/b8643f50-50ce-4590-81d9-6c8ddcef0afb/AdobeStock_322956249(1).jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=JLZojOgcg7v~BN33YRtdvuiURYLqGtR0V1yQrVSv1fg8bp81qJzq6NOHyVlcx1Tp1jZoLDlvWxNBre1OXMn8j3L8PYKTEory2RLMpxJOErdPfQPEIFJkeN5MnStjj9-2G4MP~nFjl8bgTUvlBpaljt3zt6DHJz~tiynvGAgmq64b7QETLSF6PjwnpGYl6NlYfU2xvBfqdb5hXnV~LNEDXOFoy7Y0ws0f5OKSa2-8vRNvs9QafLDBqg~4XkemyAM40ODAqd5m6sEotlydj0v1r3OXquTC061eGVvcrOd4gID3J4JkfFqnxxJBZ2qaa6kvVrC842-TkFOUeI7fhCs7YA__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/b8643f50-50ce-4590-81d9-6c8ddcef0afb/AdobeStock_322956249(1).jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=Rs04JtH9ACgwyhdrcpSHfm8Sv-ywFCVnh88xsuZ0GG9O76ETYX6r1ENGSPp5hwG7F7mWaKnbzH-jnv01-xqasMzwoKBdPRQGVszArJmYklQVV2njj6a3QJmYkugJpKUuEPRCaFw0VuoavgDVmgT9fnzNTJslwituo8qCPUqCQjZmNJXfD9skeCgFL84lJUGFGnEG3iWz3aSef21tyBvHOToA-OLCDNsHKrw8-hbNM00NezGr3r~-AvNeyBhuPrSmQWVaeFLxZwVelhYH6K2LCQ5l9vn9i1GIUMamY-dFkbJ~rnDDnkTfwO5PiyvznTDc2RdcR3wQbNtWLAuLUygTzA__"
        },
        {
            "asset": {
                "id": "24ac40be-a784-450f-9986-b95acb64feaf",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "eb34093a-7e9b-4b6b-8345-c75e4d8069a1/pexels-photo-378570.jpg",
                "fileName": "pexels-photo-378570.jpg",
                "name": "pexels-photo-378570.jpg",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "image",
                "extension": "jpg",
                "dimension": "1444,924",
                "size": "264551",
                "createdAt": "2022-10-15T04:26:13.845Z",
                "updatedAt": "2022-10-15T04:26:13.845Z",
                "channel": null,
                "dimensionHeight": 924,
                "dimensionWidth": 1444,
                "aspectRatio": 1.563,
                "productId": null,
                "fileModifiedAt": "2022-10-15T02:46:05.000Z",
                "status": "approved",
                "dpi": 72,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "9b8eb341-7e78-41b1-84ca-757aa6843599",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/eb34093a-7e9b-4b6b-8345-c75e4d8069a1/pexels-photo-378570.jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=FjHwNLuctQRSrWeI12x-QbXncWmGlsKkcKSUJD8AF1fC4AkQLlcGW9hpLVxxMp251N3EbhoLk9vdDyU3JuXoyrEU4T7Coo-NFH6swPSMhnxjLNqLkDAyovgh-hEAliVzSsOTmN0B1TLNTWVoYW2-i~nJ3nIFt-ZHLojLpbb1sonZRmv4x8skJuVSXESHfEPdEtj8aOmRn3lwnPDzodBMb1j~ngFMgGaBiE3CFxgfCuvPW~mK5LAkUY7VffJlWgu8T4YtMW3rIvKADpcOa4hM1jvWY25s2oy4bvNLVAT8oGvGo3s7zC7HB27Ae1z1EhE535ZMDpIoepwi6MTqRoFgMw__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/eb34093a-7e9b-4b6b-8345-c75e4d8069a1/pexels-photo-378570.jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=BN41hIWgqmg~QTL-o-dKbIAmNWNBDNZdf27QsqOC34tUEl-swZzrfM3sFUKlnAsgDW7ZeZerk9zQk6mNdOi~3OUGrF2x5kmxkYUacC7L6mdv19-dP5epORZup6KVkx5YZgmXh7kpbU7G0XrbxBMD2uCsUCFSLlWbkYme6J1h1r8EoZ6YsQASO0TpMiDAJxEULBBp~FjTUXl4Gi8Fi6w2ETnyWiD1zEVkl1KA3fprCUm6WOiNdjXZCNUOTk3nVTSIXmGmLYzHxMS2PQ4K98tJl4aTTgBKo7gkhf53FIgnIDLK87SjuQovZ7wsqXkcqS0hhgrUoBmSChdguNMnELbhVg__"
        },
        {
            "asset": {
                "id": "73331d30-4be1-431a-852d-16ba00eca800",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "0fb97865-8a44-42a3-862e-50fb61eb60cd/AdobeStock_322956249(1).jpg",
                "fileName": "AdobeStock_322956249(1).jpg",
                "name": "AdobeStock_322956249(1).jpg",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "image",
                "extension": "jpg",
                "dimension": "8256,5504",
                "size": "3198815",
                "createdAt": "2022-10-15T04:10:54.869Z",
                "updatedAt": "2022-10-15T04:10:54.869Z",
                "channel": null,
                "dimensionHeight": 5504,
                "dimensionWidth": 8256,
                "aspectRatio": 1.5,
                "productId": null,
                "fileModifiedAt": "2022-10-15T02:54:59.000Z",
                "status": "approved",
                "dpi": 300,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "f268dd1a-4323-4bb8-8f20-b9d5e62a60cd",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/0fb97865-8a44-42a3-862e-50fb61eb60cd/AdobeStock_322956249(1).jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=c0jD3I96Ix0km6Vp-1iR1p4cXUzQletDEsZnyA8QWeQciL1gnUpIxoSGbQt7BgMh9TWmgPbCtalVHzr8m4TSELLYxCK0~vGAoPlgQMpoxTmqYP1hxuJIcA2Ey9TIKa9B84U3OnmyKGxy50HStJL9YFXURxQwtWxqA6XkhxOSozu9gdgnRj9XxjhRJrqGgmTDr~wsfbekkCy4oC45X26IWSeGCsZIWQ~1wKJfAbv1FxYoRiOHsdU9wDCjEi15HH6qzzrXWSKqfrzn7z9nK7qkcH~9mjbyZmeeVM30sZo1H9fvheZj1ic8Rzgew9KEwAkiCRI87h1JB9QtbHoRX4wEhg__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/0fb97865-8a44-42a3-862e-50fb61eb60cd/AdobeStock_322956249(1).jpg?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=ZHgDfnMrl81wTvTD-hDo40~AgFh-x1hgmHXmxUd41D09va1eVQL6UaI~sT9EA9GpemSnqwe8~3B7w-bso3Y2l3cu4VWlqFA1biKhScXpzNdEyBLnZDwy4l0aXGQf4BgygfjTOIOh-wf-IcXJQ3AQzIl1Oy~dY~l4-jPygoykzeK54f6BpNbVKMofzuhMFc7p~PWdW5X3ZEC9Ie5A3ItzWYCUQLJp~BRiSjv8ySwQr-qeF5MzfSlruQn6BJ0sPZ11-~bV0TLcMnYlLUptSIoQUgiH2yWQpSYawgPq0TaJE8MDFcrRqkOqBVbBp631LsI2aR19m3qAiT8e461jGmqFOw__"
        },
        {
            "asset": {
                "id": "7f81e42b-a789-481f-a1d0-e3c75d612e28",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "53034ee6-dff9-4d20-bf4a-e81b465ac673/sample_640x360.m4v",
                "fileName": "sample_640x360.m4v",
                "name": "sample_640x360.m4v",
                "shareJwt": null,
                "hasThumbail": false,
                "stage": "draft",
                "type": "video",
                "extension": "m4v",
                "dimension": null,
                "size": "574847",
                "createdAt": "2022-10-12T09:56:38.430Z",
                "updatedAt": "2022-10-12T09:56:38.430Z",
                "channel": null,
                "dimensionHeight": null,
                "dimensionWidth": null,
                "aspectRatio": null,
                "productId": null,
                "fileModifiedAt": "2022-10-12T09:56:15.000Z",
                "status": "approved",
                "dpi": 0,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "a584387c-d186-44a9-99fb-eb88d02b46ad",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/53034ee6-dff9-4d20-bf4a-e81b465ac673/sample_640x360.m4v?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=Lemd9ZFOpZiwu4BWMwNXKeAPUNz1ZUd24GiSBBcXfXgPsrfpaiMOk~onspip8yE7xDVGRxLfBSjJWi1CjmBApFEuVwtlITR2MYtO3LxZlATTWMkYnktB6QZoyGgncrrLhhX33n4amFIEOWMhJFJ0YPcj8OGvrPtSSbn~ZQc4cODwSf~xARG2ZBeXDkNTI3t9JEYoxyCjBb732gnkLHRPlv-xdgpoOJUzhF19tCmzLUZTgubSdlMNd~0FPCqdF9hKVtGmGWEEahb1y6QSbriFhjSvVTuYhO03rerKs5IWx~2Eq6RlOtNJidVf8YCkYCdCbJtWjftt68UT08nSXn37Ng__"
        },
        {
            "asset": {
                "id": "427d04b1-e110-4ad0-a90e-8283caa7e252",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "5d79dacf-2b92-49a8-8421-74ca3023207a/3-43-Highly-Effective-Email-CTAs.pdf",
                "fileName": "3-43-Highly-Effective-Email-CTAs.pdf",
                "name": "3-43-Highly-Effective-Email-CTAs.pdf",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "pdf",
                "extension": "pdf",
                "dimension": null,
                "size": "175146",
                "createdAt": "2022-09-29T02:52:53.910Z",
                "updatedAt": "2022-09-29T02:52:53.910Z",
                "channel": null,
                "dimensionHeight": null,
                "dimensionWidth": null,
                "aspectRatio": null,
                "productId": null,
                "fileModifiedAt": "2022-09-29T02:08:32.000Z",
                "status": "approved",
                "dpi": 0,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "a2a34167-92d8-4f5a-ba74-fba481e37b73",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/5d79dacf-2b92-49a8-8421-74ca3023207a/3-43-Highly-Effective-Email-CTAs.png?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=ErguJUdnuUT8cHflf1tTtTVKt~rM~JREzsiHF6VUabueOne9wKa0RxuJDovRItXeqF6vxfQM2jN~3yOalgX9TMvyxuOzB8JuGvEcqzMRcH8KncZbFhTiop2DQ8Dw5cIUY1FxCw8M00axi-bfYyPLixfNrfxEl13niGWW9VJXlQpk6HqLcCxBReCU8M8o6CjDaHjaf4O4O~Oydf8vUx6vrkiIRwCo4DP~4Ko1Z7PVX5Hh5pJSRayTFQpkvPMqOgIc0x9uNE3ZuRTmSGEqvE9S4EnQ3yIp4LbOoebob8UFAn8H9KagPDFV9TCz4Q-qRFOvL7U1POG5VNP5E4qJprsjOA__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/5d79dacf-2b92-49a8-8421-74ca3023207a/3-43-Highly-Effective-Email-CTAs.pdf?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=W2XPGsVWWxIVs5h-2vYaJz93j2AqlUo0zAQSFSAXm~pxZjjL9cY9r57Sn0JpaMEF0jsmhRuXcofSit-QfZAm-ZbO7y0W5a2oOqKt8XVBoxnYDs0HqP0UGVl1MnBqdluMOTLu1x3m51Y9PKZr91qffyNa2bZ48NAOmAxFrjrSFipyKfTgwyHv4CXNtUsFLN717aM1wrKLHNGuNbHeiBtDl5jtvXRe9l6eAwp13lnjsb8ybYgqsSkgbbMwcySJrJrha90X0kOIoF9q2OF2vOL8ygmRqYZffbdnfFaxaVotFaY9d6HfGbnNCmaxooFD1kivv39UGuWsRCfhR1p-o5sF~A__"
        },
        {
            "asset": {
                "id": "04383731-fa9c-4d0c-a0b8-eff2378807d3",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "edca95cd-518e-40c1-b5dd-ec4fca9d93e3/3-43-Highly-Effective-Email-CTAs.pdf",
                "fileName": "3-43-Highly-Effective-Email-CTAs.pdf",
                "name": "3-43-Highly-Effective-Email-CTAs.pdf",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "pdf",
                "extension": "pdf",
                "dimension": null,
                "size": "175146",
                "createdAt": "2022-09-29T02:22:46.117Z",
                "updatedAt": "2022-09-29T02:22:46.117Z",
                "channel": null,
                "dimensionHeight": null,
                "dimensionWidth": null,
                "aspectRatio": null,
                "productId": null,
                "fileModifiedAt": "2022-09-29T02:08:32.000Z",
                "status": "approved",
                "dpi": 0,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "d7c44b13-7ee2-40dd-8cde-b0a0195cc9e5",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/edca95cd-518e-40c1-b5dd-ec4fca9d93e3/3-43-Highly-Effective-Email-CTAs.png?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=Up8xms7E~~jsMMIU9LMtJ29FLAnKv6muU1wFR3Bs~FytstSsWR3t8Oe~Uq9dYyDt13TRTn7KsAspVPoWfkD6vPrDpU831x~LP9Ben6Tu7BozRzAO1xKOOujUR1fueCoyW7EcMwVM4ywsZasMi2BPIEOdJWxia7EniZkeR5gCnobww0~dJVPWLLh-Z9zstCpLK2xRTEdS~ULQ8yP1rYQoZBKe9UKu-qBYW-fHf3sjppgf2yhM2ZWLPmPbM2I299l2D7rrCpxszFyWnYXYumgquzNPAm21ZzL-RFm4OgR7GaFstqyp8imm4ltzPzKG5cCtiGTtS~CTpA-01peADvS2Fw__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/edca95cd-518e-40c1-b5dd-ec4fca9d93e3/3-43-Highly-Effective-Email-CTAs.pdf?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=RzYwKaJHqP7dDwF8eP~sqlKs3MOQe4yL4UBiECxUBi2OXZVtZ-Sl2nKiY2lF9C7gjF5UuZDhpEEx1XkK5uMX-WOsdQSYN9bnzvIvhjo2VV2Kw3rYrt8IbwSS1~5MWT4WleUYf1vu0G3T-bNDMPUllOshRki80YynffYiZv5cEMTtDQZuSJ51C2lWCiULr0yGMQOUNDjC4tOZtzO8yjUmzzG5ccVzqmhukdHDwWu579VIbd9iThoa8AUHikUgiqFuXJ-030-6tXJnD-3lob7-uFhO3lnWeZS3fOWwtD9rM2DH2VXWbUbarp8vQXjuWE21ouYF6JVrMya5zGO4LPa3Tw__"
        },
        {
            "asset": {
                "id": "0e8b7000-ab83-4752-a3c4-73fcb9da8f94",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "253ad7f6-8f33-472f-a11a-48c74b951f8c/3-43-Highly-Effective-Email-CTAs.pdf",
                "fileName": "3-43-Highly-Effective-Email-CTAs.pdf",
                "name": "3-43-Highly-Effective-Email-CTAs.pdf",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "pdf",
                "extension": "pdf",
                "dimension": null,
                "size": "175146",
                "createdAt": "2022-09-29T02:21:40.117Z",
                "updatedAt": "2022-09-29T02:21:40.117Z",
                "channel": null,
                "dimensionHeight": null,
                "dimensionWidth": null,
                "aspectRatio": null,
                "productId": null,
                "fileModifiedAt": "2022-09-29T02:08:32.000Z",
                "status": "approved",
                "dpi": 0,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "317e2faa-503a-448e-b388-1e1a6c46ba75",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/253ad7f6-8f33-472f-a11a-48c74b951f8c/3-43-Highly-Effective-Email-CTAs.png?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=gvIDoJHEy1ii14QcjVdztF0JX2tTkTJNRcu~qvXfBtS42VYwGmhn9aRq1AuR9nMuv3~QYsLPExBs-EBXZcq5UkOxzS7wREPvw5G5EBuS5ptAQHdVM-bDNLEiT~U6~9EdLXKGwXEpJ5nlGdFHOyJgqSJ~L7hE8phfZ-h6-pCWk8Nbjau5-FeCe2t0YcBoRLo~cREAZuk574lGMgtLx~WdnvO92JBPj43GKZlY0B8~hWQogPdy9OajFluWRqUULxQjARGLXueR~dTliWiWNckR-XS5aavaufGrc7FIrkZSG5IIXGbgZjEUOlaHmeQ~vWfcvUFbNUllpLc0GxuhlPPqFg__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/253ad7f6-8f33-472f-a11a-48c74b951f8c/3-43-Highly-Effective-Email-CTAs.pdf?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=XWSVETSvmGR7O8srboHyj4ZhM5jIN23iubdDq9Dzdcv-ra965kHHnzmyQxbiLI~SA5OlpBk-WGpJWLYC7qKdq5~XNQ-BJtMveDUNtTtpGth16VOOSV1Ap8THWHiEzotkk8fCy7AQENFV1N8sZRDEaE3IK1iFKI~DaFsC3wQBbIyWk5bXeZ4u4BbTicpdINVlLntho~ebv610o8UW9TOBR7e9jEJYUdO0EQ5iXVlU4MxsOy5DKHxx-KAPZOuf1ZGXWyW9EhFPzOD7hWKXwUfCaTucx~IkB1QqI6XztsptKZdk9T8aZDK0yiCMT2BVSSG8Bun3UqkvHkNLB~wz85ZXXQ__"
        },
        {
            "asset": {
                "id": "f49400d8-a610-43da-90f8-29650c81c4cf",
                "userId": "99f57b81-1287-49b6-9a58-06cf8f7c58f8",
                "folderId": null,
                "storageId": "7237e90c-e3ca-46d8-8675-0355f8f812d3/3-43-Highly-Effective-Email-CTAs.pdf",
                "fileName": "3-43-Highly-Effective-Email-CTAs.pdf",
                "name": "3-43-Highly-Effective-Email-CTAs.pdf",
                "shareJwt": null,
                "hasThumbail": true,
                "stage": "draft",
                "type": "pdf",
                "extension": "pdf",
                "dimension": null,
                "size": "175146",
                "createdAt": "2022-09-29T02:09:21.240Z",
                "updatedAt": "2022-09-29T02:09:21.240Z",
                "channel": null,
                "dimensionHeight": null,
                "dimensionWidth": null,
                "aspectRatio": null,
                "productId": null,
                "fileModifiedAt": "2022-09-29T02:08:32.000Z",
                "status": "approved",
                "dpi": 0,
                "deletedAt": null,
                "originalId": null,
                "duplicatedAt": null,
                "versionGroup": "54943fe1-067e-421a-bcb8-fbdb6c6c63c4",
                "version": 1,
                "folders": [],
                "products": []
            },
            "thumbailUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/thumbails/7237e90c-e3ca-46d8-8675-0355f8f812d3/3-43-Highly-Effective-Email-CTAs.png?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=aDgbA7okC45a4f4NBkmiY~UmoecwM6T9LpPmRLRn3vqdPMCGqSq-hUbuiOMMGtIGJ7srw4PfhMBOjUB5TAWnJ5tyMuusaUtwX5Vi5bnKVKiY4nJYVahzKiIQnkbDD8eR7OIjYSIaQ10PR7SUsxprMCRVTia-x8KSt835LadC~bG--DElkDps5nR9izLUY~77TYzwLRuiCz8KTJ6qioBCQ4LbSL0GprLWhoolFe88XeAlUXqpuEVO5nKeACLkIK3txryOe99SYJBVvBglQJ9jmxBDSX498bzWVetQJc1F3E53RU6CYcq6FyayboWYGYbQW79MtAjAfm-t0uViYF-PBw__",
            "realUrl": "https://d29nodv69u07ms.cloudfront.net/assets/674dbe2a-1226-4d35-9f82-58a08eb99055/files/7237e90c-e3ca-46d8-8675-0355f8f812d3/3-43-Highly-Effective-Email-CTAs.pdf?Expires=1667423887&Key-Pair-Id=APKAJ4TLYM4MOZ5EAADA&Signature=RoTxMCv14WZL0ylpOZ88aM517bW06iC6aotYn7l~Q0yYC3sAC3uC4vMshWpiQENgJI2m9PRK0RyxPtP3NJjwR3HcP0gxgln79lSaVW~y~c3AVfLj2vgQX1-bQ6obQF1HnpllPIjh21WCI282hc4Vl23CE5i54wNnbPk-YFW~v9UFt43qJtjOtw7NxmyIQa4mBOfORRbhFJwvKF~FYK6tRqSpu9qn1z2tIO94yFFGhsNLHbqVkXpZbvVoY6QBx4pZ3NewkWnbxhKjvy4IszeFtOclfNWThKl9wNBYSf0kjATxjO9tHSYB~SVyoT2qtZpUkEwecKxXIejCsdnE3mGnsg__"
        }
    ]

    const downloadAsset = (assetItem) => {
        downloadUtils.downloadFile(assetItem.realUrl, assetItem.asset.name)
    }

    const openDeleteAsset = (id) => {
        setActiveAssetId(id)
        setDeleteModalOpen(true)
    }

    const deleteAsset = async (id) => {
    const [previewActive, setPreviewActive] = useState(false)
    try {
            await assetsApi.updateAsset(id, {
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
                setAssets(
                    update(assets, {
                        $splice: [[assetIndex, 1]],
                    })
                )
            toastUtils.success("Assets deleted successfully")
        } catch (err) {
            // TODO: Error handling
            toastUtils.error("Could not delete assets, please try again later.")
        }
    }

    return (
        <>
            <div className={styles.container}>

                <div data-tip data-for={'upload'} className={styles['upload-wrapper']}>
                    <Button
                        text={<img src={AssetOps.upload} />}
                        type='button'
                        styleType='primary'
                        onClick={() => setUploadModalOpen(true)}
                    >
                    </Button>
                    <ReactTooltip id={'upload'} delayShow={300} effect='solid' place={'right'}>Upload related files</ReactTooltip>

                    <BaseModal
                        showCancel={false}
                        closeButtonOnly
                        additionalClasses={[styles['modal-upload']]}
                        closeModal={() => setUploadModalOpen(false)}
                        modalIsOpen={uploadModalOpen}
                        confirmText="Add Related Files"
                        confirmAction={() => {
                            setUploadModalOpen(false)
                            setConfirmUploadModalOpen(true)
                        }}
                    >
                        <div className={styles['modal-upload-content']}>
                            <div className={styles['upload-icons-wrapper']}>
                                <div className={styles['upload-icon-wrapper']}>
                                    <IconClickable
                                        src={Assets.computer}
                                        additionalClass={styles['upload-icon']}
                                        onClick={() => { }}
                                    />
                                    <p>Computer</p>
                                </div>
                                <div className={styles['upload-icon-wrapper']}>
                                    <IconClickable
                                        src={Assets.gdrive}
                                        additionalClass={styles['upload-icon']}
                                        onClick={() => { }}
                                    />
                                    <p>Google Drive</p>
                                </div>
                                <div className={styles['upload-icon-wrapper']}>
                                    <IconClickable
                                        src={Assets.dropbox}
                                        additionalClass={styles['upload-icon']}
                                        onClick={() => { }}
                                    />
                                    <p>Dropbox</p>
                                </div>
                            </div>
                            <AssetUpload
                                onDragText={"Drop files here to upload"}
                                preDragText={`Upload Images / Drag and Drop`}
                            // onFilesDataGet={onFilesDataGet}
                            />
                        </div>
                    </BaseModal>

                    <ConfirmModal
                        closeModal={() => setConfirmUploadModalOpen(false)}
                        confirmAction={() => {
                            setConfirmUploadModalOpen(false)
                        }}
                        confirmText={"Add Related Files"}
                        message={
                            <span>
                                Are you sure you want to Add (4) Related Files?
                            </span>
                        }
                        modalIsOpen={confirmUploadModalOpen}
                    />
                </div>
                <h3>Related Files</h3>
                <div className={styles.slider}>
                    <Slider {...settings}>
                        {assets.map((assetItem, index) => (
                            <AssetThumbail
                                {...assetItem}
                                key={index}
                                // sharePath={sharePath}
                                showAssetOption={false}
                                showAssetRelatedOption={true}
                                downloadAsset={() => downloadAsset(assetItem)}
                                openDeleteAsset={() =>
                                    openDeleteAsset(assetItem.asset.id)
                                }
                            />
                        ))}
                    </Slider>
                </div>
                <div className={styles['buttons-wrapper']}>
                    <Button
                        text='Download All Related Files'
                        type='button'
                        styleType='secondary'
                        onClick={() => { }}
                    />
                    <Button
                        text='Share All Related Files'
                        type='button'
                        styleType='primary'
                        onClick={() => { }}
                    />
                </div>
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
                        Are you sure you want to &nbsp<strong>Delete</strong>&nbsp this
                        asset?
                    </span>
                }
                modalIsOpen={deleteModalOpen}
            />
        </>
    )
}

export default AssetRelatedFIles