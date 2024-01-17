import querystring from 'querystring';
import { useContext } from 'react';
// import Cookies from 'universal-cookie';

import AssetDownloadProcess from '../../../components/asset-download-process';
import ShareFolderLayout from '../../../components/common/layouts/share-folder-layout';
import { AssetContext } from '../../../context';

// Components
import DetailOverlay from "../../../components/main/assets-library/assetDetail";

export async function getServerSideProps({ req, res, query }) {
    try {
        console.log("helolololo2");
        const { assetId, isShare, sharePath, sharedCode, activeFolder, availableNext, activeSubFolders, headerName } = query;
        // const cookies = new Cookies(req.headers.cookie, { path: '/' });
        // Adding custom headers to the fetch request
        console.log(JSON.stringify(query), "hello")
        const share = isShare === 'true' ? true : false
        // const headers = {
        //     'Content-Type': 'application/json', // Add any headers you need
        //     'Authorization': `Bearer ${cookies.get("jwt")}`
        // };
        // Using fetch to get data from the API with custom headers
        let apiUrl = `${process.env.SERVER_BASE_URL}/assets/${assetId} `;
        if (share) {
            apiUrl = `${process.env.SERVER_BASE_URL}/share-collections/assets/${assetId}?${querystring.encode({ sharePath, sharedCode })}`;
        }
        const fetchRes = await fetch(apiUrl);
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
                availableNext: availableNext,
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

const ShareDetailPage = (props) => {
    const { downloadingStatus } = useContext(AssetContext);

    return (
        <ShareFolderLayout>
            {downloadingStatus !== "none" && <AssetDownloadProcess />}
            <DetailOverlay
                {...props}
            />
        </ShareFolderLayout>
    );
};

export default ShareDetailPage;
