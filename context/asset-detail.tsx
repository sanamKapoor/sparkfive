import { useState } from "react";
import { AssetDetailContext } from "../context";


export default ({ children }) => {
    const [sharePath, setSharePath] = useState<string>("");
    const [isShare, setisShare] = useState<boolean>(false);
    const [asset, setAsset] = useState<Record<string, any>>({});
    // const [sharePath, setSharePath] = useState("");

    // sharePath = { sharePath }
    // isShare = { isShare }
    // asset = { asset }
    // realUrl = { asset.extension === "tiff" || asset.extension === "tif" ? thumbailUrl : realUrl }
    // activeFolder = { activeFolder }
    // thumbailUrl = { thumbailUrl }
    // initialParams = { overlayProperties }
    // openShareAsset = { openShareAsset }
    // openDeleteAsset = { openDeleteAsset }
    // closeOverlay = { onCloseOverlay }
    // loadMore = { loadMore }



    const assetDetail = {

    };
    return (
        <AssetDetailContext.Provider value={assetDetail}>{children}</AssetDetailContext.Provider>
    );
};