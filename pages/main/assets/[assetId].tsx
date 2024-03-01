import React, { useContext } from "react";
import { ASSET_ACCESS } from "../../../constants/permissions";
import Cookies from 'universal-cookie';
import querystring from 'querystring';

// Components
import AssetDownloadProcess from "../../../components/asset-download-process";
import AssetUploadProcess from "../../../components/asset-upload-process";
import MainLayout from "../../../components/common/layouts/main-layout";
import DetailOverlay from "../../../components/main/assets-library/assetDetail";

import { AssetContext } from "../../../context";

export async function getServerSideProps({ req, res, query }) {
    try {
        const { assetId, isShare, sharePath, sharedCode, activeFolder, availableNext, activeSubFolders, headerName } = query;
        const cookies = new Cookies(req.headers.cookie, { path: '/' });
        // Adding custom headers to the fetch request
        const share = isShare === 'true' ? true : false
        const headers = {
            'Content-Type': 'application/json', // Add any headers you need
            'Authorization': `Bearer ${cookies.get("jwt")}`
        };
        // Using fetch to get data from the API with custom headers
        let apiUrl = `${process.env.SERVER_BASE_URL}/assets/${assetId} `;

        const fetchRes = await fetch(apiUrl, { headers });
        // Checking if the response was successful
        if (!fetchRes.ok) {
            throw new Error(`Failed to fetch data: ${fetchRes.statusText} `);
        }
        // Parsing the JSON data from the response
        const data = await fetchRes.json();
        const { asset, realUrl, thumbailUrl } = data;

        return {
            props: {
                asset: data.asset,
                realUrl: asset.extension === "tiff" || asset.extension === "tif" ? thumbailUrl : realUrl,
                thumbailUrl: thumbailUrl,
                sharePath: sharePath,
                isShare: share,
                sharedCode: sharedCode,
                activeFolder: activeFolder,
                availableNext: availableNext === "true" ? true : false,
                completeAsset: data,
                headerName: headerName,
                activeSubFolders: activeSubFolders,
            },
        };
    } catch (error) {
        return {
            props: {
                realUrl: "",
                thumbailUrl: "",
                asset: null,
                sharePath: "",
                sharedCode: "",
                isShare: false,
                activeFolder: "",
                availableNext: false,
                completeAsset: {},
                activeSubFolders: "",
                headerName: ""
            },
        };
    }
}
const DetailPage = (props) => {
    const { uploadingStatus, uploadingAssets, downloadingStatus } =
        useContext(AssetContext);

    return (
        <MainLayout headerZIndex={'unset'} requiredPermissions={[ASSET_ACCESS]}>
            {uploadingStatus !== "none" && uploadingAssets.length > 0 && (
                <AssetUploadProcess />
            )}
            {downloadingStatus !== "none" && <AssetDownloadProcess />}
            <DetailOverlay
                {...props}
            />
        </MainLayout>
    );
};

export default DetailPage;
