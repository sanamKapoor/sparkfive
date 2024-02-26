import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import AssetDownloadProcess from '../../../components/asset-download-process';
import ShareLayout from '../../../components/common/layouts/share-layout';
import DetailOverlay from '../../../components/main/assets-library/assetDetail';
import { AssetContext } from '../../../context';
import shareApi from '../../../server-api/share-collection';
import { IAssetData } from "../../../interfaces/common/asset"


const ShareAssetDetailPage = () => {
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
    }); const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const { assetId, isShare, sharePath, sharedCode, activeFolder, availableNext, activeSubFolders, headerName } = router.query;
                const share = isShare === 'true' ? true : false;

                const { data } = await shareApi.getAssetById(assetId, { sharePath, sharedCode });
                const { asset, realUrl, thumbailUrl } = data;

                setAssetData({
                    asset: data.asset,
                    realUrl: asset.extension === "tiff" || asset.extension === "tif" ? thumbailUrl : realUrl,
                    thumbailUrl: thumbailUrl,
                    sharePath: sharePath,
                    isShare: share,
                    sharedCode: sharedCode,
                    activeFolder: activeFolder,
                    availableNext: availableNext,
                    completeAsset: data,
                    headerName: headerName,
                    activeSubFolders: activeSubFolders,
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (router.query && Object.keys(router.query).length > 0) {
            fetchData();
        }
    }, [router.query]);

    return (
        <ShareLayout>
            {downloadingStatus !== "none" && <AssetDownloadProcess />}
            {assetData.asset && <DetailOverlay {...assetData} />}
        </ShareLayout>
    );
};

export default ShareAssetDetailPage;
