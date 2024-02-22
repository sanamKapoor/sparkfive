import React, { useContext, useEffect, useState } from 'react';
import AssetDownloadProcess from '../../../components/asset-download-process';
import ShareFolderLayout from '../../../components/common/layouts/share-folder-layout';
import { AssetContext } from '../../../context';
import DetailOverlay from "../../../components/main/assets-library/assetDetail";
import { useRouter } from 'next/router';
import shareApi from '../../../server-api/share-collection';
import { IAssetData } from "../../../interfaces/common/asset"

const ShareDetailPage = () => {
    const { downloadingStatus } = useContext(AssetContext);
    const [assetData, setAssetData] = useState<IAssetData>({
        realUrl: "",
        thumbailUrl: "",
        asset: null,
        sharePath: "",
        sharedCode: "",
        isShare: true,
        activeFolder: "",
        availableNext: false,
        completeAsset: {},
        activeSubFolders: "",
        headerName: ""
    });
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { assetId, isShare, sharePath, sharedCode, activeFolder, availableNext, activeSubFolders, headerName } = router.query;
                const share = isShare === 'true';
                const { data } = await shareApi.getAssetById(assetId, { sharePath, sharedCode });
                const { asset, realUrl, thumbailUrl } = data;
                setAssetData({
                    asset: data.asset,
                    realUrl: (asset.extension === "tiff" || asset.extension === "tif") ? thumbailUrl : realUrl,
                    thumbailUrl,
                    sharePath,
                    isShare: share,
                    sharedCode,
                    activeFolder,
                    availableNext,
                    completeAsset: data,
                    headerName,
                    activeSubFolders,
                });
            } catch (error) {
                console.log(error);
            }
        };
        if (router.query && Object.keys(router.query).length > 0) {
            fetchData();
        }
    }, [router.query]);

    return (
        <ShareFolderLayout headerZIndex={'unset'}>
            {downloadingStatus !== "none" && <AssetDownloadProcess />}
            {assetData.asset && <DetailOverlay {...assetData} />}
        </ShareFolderLayout>
    );
};

export default ShareDetailPage;