import { useState } from "react";
import { AssetDetailContext } from "../context";

export default ({ children }) => {

    const [sharePath, setSharePath] = useState<string>("");
    const [isShare, setisShare] = useState<boolean>(false);
    const [asset, setAsset] = useState<Record<string, any>>({});
    const [realUrl, setrealUrl] = useState<string>("");
    const [activeFolder, setactiveFolder] = useState<string>("");
    const [thumbnailUrl, setThumbnailURL] = useState<string>("");
    const [initialParams, setInitialParam] = useState<Record<string, any>>({});

    const assetDetail = {
        sharePath,
        isShare,
        asset,
        realUrl,
        activeFolder,
        thumbnailUrl,
        initialParams,
        setSharePath,
        setisShare,
        setAsset,
        setrealUrl,
        setactiveFolder,
        setThumbnailURL,
        setInitialParam
    };

    return (
        <AssetDetailContext.Provider value={assetDetail}>{children}</AssetDetailContext.Provider>
    );

};