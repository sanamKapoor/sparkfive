import React, { useEffect, useState } from 'react'
import { Assets } from "../../../../assets";
import styles from "../table/table-data.module.css";

const AssetThumb = ({ thumbnail, type }) => {
    const [loaded, setLoaded] = useState(false);

    let finalImg = thumbnail;
    if (!finalImg && type === "video") finalImg = Assets.videoThumbnail;

    if (!finalImg) finalImg = Assets.empty;

    useEffect(() => {
        setLoaded(false);
    }, [thumbnail]);

    return (
        <>
            <img
                src={Assets.empty}
                data-drag="false"
                draggable={false}
                alt={"blank"}
                className={styles.assetImage}
                style={
                    loaded
                        ? { display: "none" }
                        : {}
                }
            />
            <img src={finalImg} alt="user" onLoad={() => setLoaded(true)}
                onError={(e) => setLoaded(false)} style={
                    loaded
                        ? {}
                        : {
                            display: "none",
                        }
                } className={styles.assetImage} />
        </>
    )
}

export default AssetThumb