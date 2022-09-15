import { useEffect} from "react";

import styles from "./asset-img.module.css";

import { Assets } from "../../../assets";
import { useState } from "react";
import asset from "../../../server-api/asset";

const AssetImg = ({
  assetImg,
  type = "image",
  name,
  opaque = false,
  onClick = () => {},
  imgClass = ""
}) => {
  const [loaded, setLoaded] = useState(false);

  let finalImg = assetImg;
  if (!finalImg && type === "video") finalImg = Assets.videoThumbnail;

  if (!finalImg) finalImg = Assets.empty;

  useEffect(()=>{
      setLoaded(false)
  },[assetImg])

  return (
    <>
      <img
        src={Assets.empty}
        alt={"blank"}
        style={loaded ? { display: "none" } : {}}
      />
      <img
        crossOrigin={"anonymous"}
        onClick={onClick}
        src={finalImg}
        alt={name}
        className={`asset-img ${styles.asset} ${opaque && styles.opaque} ${imgClass}`}
        onLoad={() => setLoaded(true)}
        style={
          loaded
            ? {}
            : {
                opacity: 0,
                overflow: "hidden",
                height: 0,
                width: 0,
                margin: 0,
                padding: 0,
                border: "none",
              }
        }
      />
    </>
  );
};

export default AssetImg;
