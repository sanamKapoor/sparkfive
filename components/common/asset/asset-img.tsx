import { useEffect, useState } from "react";

import styles from "./asset-img.module.css";

import { Assets } from "../../../assets";

const AssetImg = ({
  assetImg,
  type = "image",
  opaque = false,
  onClick = () => { },
  imgClass = "",
  style = {},
  activeFilter = "",
  isResize = false,
  isDeletedItem = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  let finalImg = assetImg;
  if (!finalImg && type === "video") finalImg = Assets.videoThumbnail;

  if (!finalImg) finalImg = Assets.empty;

  useEffect(() => {
    setLoaded(false);
  }, [assetImg]);

  return (
    <>
      <img
        src={Assets.empty}
        data-drag="false"
        draggable={false}
        alt={"blank"}
        className={`${styles[activeFilter]} ${styles["userEvents"]}`}
        style={
          loaded
            ? { display: "none" }
            : {
              width: isDeletedItem ? "none" : "100%",
              height: isDeletedItem ? "none" : "100%",
              objectFit: "contain",
            }
        }
      />
      <img
        data-drag="false"
        onClick={onClick}
        src={finalImg}
        draggable={false}
        className={`${styles["userEvents"]} asset-img ${!isResize ? styles.asset : styles.asset__crop
          } ${opaque && styles.opaque} ${imgClass} ${styles[imgClass]} ${styles[activeFilter]
          }`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          setLoaded(false);
        }}
        style={
          loaded
            ? { ...style }
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
