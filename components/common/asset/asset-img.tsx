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
  imgClass = "",
  style={},
  activeFilter="",
  isResize
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
        className={`${styles[activeFilter]}`}
        style={loaded ? { display: "none" } : { width: '100%', height: "100%", "object-fit": "cover"}}
      />
      <img
        onClick={onClick}
        src={finalImg}
        className={`asset-img ${!isResize ? styles.asset : styles.asset__crop} ${opaque && styles.opaque} ${imgClass} ${styles[imgClass]} ${styles[activeFilter]}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {setLoaded(false)}}
        style={
          loaded
            ? {...style}
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
