// External import
import update from "immutability-helper";
import { useContext, useEffect, useRef, useState } from "react";

// Styles
import styles from "./index.module.css";

import assetApi from "../../server-api/asset";
import toastUtils from "../../utils/toast";
import urlUtils from "../../utils/url";

// Components
import fileDownload from "js-file-download";
import { GeneralImg } from "../../assets";
import AuthContainer from "../common/containers/auth-container";
import AssetDownloadProcess from "./asset-download-process";
import ShareItem from "./share-item";
import ShareOperationButtons from "./share-operation-buttons";

// Contexts
import Button from "../common/buttons/button";
import Input from "../common/inputs/input";
import Spinner from "../common/spinners/spinner";

import { loadTheme } from "../../utils/theme";

import { UserContext } from "../../context";
import { defaultLogo } from "../../constants/theme";

import { sizeToZipDownload } from "../../constants/download";
import downloadUtils from "../../utils/download";

import {events} from '../../constants/analytics';
import useAnalytics from "../../hooks/useAnalytics"

const AssetShare = () => {
  const { logo: themeLogo, setLogo: setThemeLogo } = useContext(UserContext);
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
  const [sharedCode, setSharedCode] = useState("");

	const {trackEvent} = useAnalytics();

  // Toggle select asset
  const toggleSelected = (id) => {
    const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);

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
      }),
    );
  };

  // Select/Deselect all assets
  const selectAll = () => {
    // If already select all, do deselect
    if (selectedAsset) {
      setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: false })));
      setSelectedAsset(0);
    } else {
      setAssets(assets.map((assetItem) => ({ ...assetItem, isSelected: true })));
      setSelectedAsset(assets.length);
    }
  };

  const zipping = () => {
    setDownloadStatus("zipping");
    setShowDownloadPopup(true);
    // simulateProcess();
  };

  const done = () => {
    setDownloadStatus("done");
    // cancelSimulatedProcess
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
  // Download select assets
  const downloadSelectedAssets = async () => {
    try {
      const { shareJWT, code } = urlUtils.getQueryParameters();

      const selectedAssets = assets.filter((asset) => asset.isSelected);

      const downloadAsZip = async () => {
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
      };

      if (selectedAssets.length === 1) {
        const size = parseInt(selectedAssets[0].asset?.size || 0);
        if (size >= sizeToZipDownload || selectedAssets[0].asset?.type === "video") {
          downloadAsZip();
        } else {
          downloadUtils.downloadFile(selectedAssets[0].realUrl, selectedAssets[0]?.asset.name);
        }
      } else {
        downloadAsZip();
      }

      // downloadUtils.zipAndDownload(selectedAssets.map(assetItem => ({ url: assetItem.realUrl, name: assetItem.asset.name })), 'assets.zip')
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
          setShareUserName(data.sharedBy);
          setSharedCode(code as string);
          setLogo(data.data.team?.workspaceIcon);
        }

        // There is team theme set
        if (data.theme) {
          // Load theme from team settings
          const currentTheme = loadTheme(data.theme);

          // @ts-ignore
          setThemeLogo(currentTheme.logoImage?.realUrl || defaultLogo);
        }
      }
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not get assets from server");
    }
  };

  const onSubmitAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
		trackEvent(events.ACCESS_SHARED_LINK, {email});
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

    // There is team theme set
    if (data.theme) {
      // Load theme from team settings
      const currentTheme = loadTheme(data.theme);

      console.log(`Current sync theme`, currentTheme);
      // @ts-ignore
      console.log(`Logo: `, currentTheme.logoImage?.realUrl || defaultLogo);
      // @ts-ignore
      setThemeLogo(currentTheme.logoImage?.realUrl || defaultLogo);
    } else {
      // Load theme from local storage
      const currentTheme = loadTheme();
      console.log(`Current logo theme`, currentTheme);
      // @ts-ignore
      setThemeLogo(currentTheme.logoImage?.realUrl || defaultLogo);
    }
  };

  return (
    <>
      {!loading && !error && (
        <header className={styles.header}>
          <img className={styles["logo-img"]} src={themeLogo} />
        </header>
      )}
      <section className={styles.container}>
        {loading && <Spinner className={styles["spinner"]} />}
        {!loading && error && (
          <div>
            <img alt={"logo"} src={logo || themeLogo} className={styles.logo} />
            <AuthContainer
              title="Spencer Mo has shared files with you"
              titleComponent={<p className={"normal-text font-16"}>{shareUserName} has shared files with you</p>}
              subTitleComponent={
                <p className={"normal-text m-b-32"}>Please enter your email to access the shared files</p>
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
                  <Button className="container primary" text={"Submit"} type={"submit"} />
                </div>
              </form>
            </AuthContainer>
          </div>
        )}
        {!loading && !error && (
          <>
            <ShareOperationButtons
              sharedBy={shareUserName}
              selectAll={selectAll}
              totalSharedFiles={assets?.length}
              selectedAsset={selectedAsset}
              downloadSelectedAssets={downloadSelectedAssets}
            />
            <div className={styles["list-wrapper"]}>
              <ul className={styles["grid-list"]}>
                {assets.map((assetItem) => {
                  return (
                    <li className={styles["grid-item"]} key={assetItem.asset.id}>
                      <ShareItem
                        {...assetItem}
                        toggleSelected={() => {
                          toggleSelected(assetItem.asset.id);
                        }}
                        selectAll={selectAll}
                        sharedCode={sharedCode}
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
