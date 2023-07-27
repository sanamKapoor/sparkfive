// External import
import update from "immutability-helper";
import { useEffect, useRef, useState } from "react";

// Styles
import styles from "./index.module.css";

import assetApi from "../../server-api/asset";
import toastUtils from "../../utils/toast";
import urlUtils from "../../utils/url";

// Utils

// Components
import fileDownload from "js-file-download";
import { GeneralImg } from "../../assets";
import AuthContainer from "../common/containers/auth-container";
import AssetDownloadProcess from "./asset-download-process";
import ShareItem from "./share-item";
import ShareOperationButtons from "./share-operation-buttons";

// Contexts
import AuthButton from "../common/buttons/auth-button";
import Input from "../common/inputs/input";
import Spinner from "../common/spinners/spinner";

const AssetShare = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [downloadingPercent, setDownloadingPercent] = useState(30);
  const interval = useRef();
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shareUserName, setShareUserName] = useState("");

  // Toggle select asset
  const toggleSelected = (id) => {
    const assetIndex = assets.findIndex(
      (assetItem) => assetItem.asset.id === id
    );

    // Toggle selected item
    if (!assets[assetIndex].isSelected) {
      setSelectedAsset(selectedAsset + 1);
    } else {
      setSelectedAsset(selectedAsset - 1);
    }

    setAssets(
      update(assets, {
        [assetIndex]: {
          isSelected: { $set: !assets[assetIndex].isSelected },
        },
      })
    );
  };

  // Select/Deselect all assets
  const selectAll = () => {
    // If already select all, do deselect
    if (selectedAsset) {
      setAssets(
        assets.map((assetItem) => ({ ...assetItem, isSelected: false }))
      );
      setSelectedAsset(0);
    } else {
      setAssets(
        assets.map((assetItem) => ({ ...assetItem, isSelected: true }))
      );
      setSelectedAsset(assets.length);
    }
  };

  const zipping = () => {
    setDownloadStatus("zipping");
    setShowDownloadPopup(true);
  };

  const done = () => {
    setDownloadStatus("done");
  };

  const simulateProcess = () => {
    // @ts-ignore
    interval.current = setInterval(() => {
      if (downloadingPercent < 100) {
        setDownloadingPercent(downloadingPercent + 10);
      }
    }, 1000);
  };

  const cancelSimulatedProcess = () => {
    if (interval.current) {
      clearInterval(interval.current);
      setDownloadingPercent(0);
    }
  };

  // Download select assets
  const downloadSelectedAssets = async () => {
    try {
      const { shareJWT, code } = urlUtils.getQueryParameters();

      const selectedAssets = assets.filter((asset) => asset.isSelected);

      let payload = {
        assetIds: selectedAssets.map((item) => item.asset.id),
      };

      // Show processing bar
      zipping();

      const { data } = await assetApi.shareDownload(payload, {
        shareJWT,
        code,
      });
      // Download file to storage
      fileDownload(data, "assets.zip");

      done();
    } catch (e) {}
  };

  useEffect(() => {
    getAssets();
  }, []);

  const getAssets = async () => {
    try {
      const { shareJWT, code } = urlUtils.getQueryParameters();

      // Allow get by both shareJWT or code (shareJWT has problem with very long at url issue)
      if (shareJWT || code) {
        const { data } = await assetApi.getSharedAssets({ shareJWT, code });
        if (data.error) {
          setError(true);
          setLoading(false);
          setLogo(data.data.team.workspaceIcon);
          setShareUserName(data.data.user.name);

          if (data.errorMessage !== "Email is required") {
            toastUtils.error(data.errorMessage);
          }
        } else {
          setError(false);
          setLoading(false);
          setAssets(data.data);
        }
      }
    } catch (err) {
      toastUtils.error("Could not get assets from server");
    }
  };

  const onSubmitAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { shareJWT, code } = urlUtils.getQueryParameters();
    const { data } = await assetApi.getSharedAssets({ shareJWT, email, code });

    if (data.error) {
      toastUtils.error(data.errorMessage);
      setError(true);
      setLoading(false);
    } else {
      setError(false);
      setLoading(false);
      setAssets(data.data);
    }
  };

  return (
    <>
      {!loading && !error && (
        <header className={styles.header}>
          <img className={styles["logo-img"]} src={GeneralImg.logo} />
        </header>
      )}
      <section className={styles.container}>
        {loading && <Spinner className={styles["spinner"]} />}
        {!loading && error && (
          <div>
            <img
              alt={"logo"}
              src={logo || GeneralImg.logoHorizontal}
              className={styles.logo}
            />
            <AuthContainer
              title="Spencer Mo has shared files with you"
              titleComponent={
                <p className={"normal-text font-16"}>
                  {shareUserName} has shared files with you
                </p>
              }
              subTitleComponent={
                <p className={"normal-text m-b-32"}>
                  Please enter your email to access the shared files
                </p>
              }
              additionalClass={"color-secondary"}
              subtitle={"Please enter your email to access the shared files"}
            >
              <form onSubmit={onSubmitAuth} className={styles["password-form"]}>
                <Input
                  placeholder={"Email"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  styleType={"regular-short"}
                  type="text"
                />
                <div className={"m-t-15"}>
                  <AuthButton text={"Submit"} type={"submit"} />
                </div>
              </form>
            </AuthContainer>
          </div>
        )}
        {!loading && !error && (
          <>
            <ShareOperationButtons
              selectAll={selectAll}
              selectedAsset={selectedAsset}
              downloadSelectedAssets={downloadSelectedAssets}
            />
            <div className={styles["list-wrapper"]}>
              <ul className={styles["grid-list"]}>
                {assets.map((assetItem) => {
                  return (
                    <li
                      className={styles["grid-item"]}
                      key={assetItem.asset.id}
                    >
                      <ShareItem
                        {...assetItem}
                        toggleSelected={() => {
                          toggleSelected(assetItem.asset.id);
                        }}
                        selectAll={selectAll}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}

        {showDownloadPopup && (
          <AssetDownloadProcess
            downloadingStatus={downloadStatus}
            onClose={() => {
              setShowDownloadPopup(false);
            }}
            downloadingPercent={downloadingPercent}
            selectedAsset={selectedAsset}
          />
        )}
      </section>
    </>
  );
};

export default AssetShare;
