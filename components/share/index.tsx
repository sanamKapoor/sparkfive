// External import
import { boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';
import update from 'immutability-helper';
import fileDownload from 'js-file-download';
import { useContext, useEffect, useRef, useState } from 'react';

import { sizeToZipDownload } from '../../constants/download';
import { defaultLogo } from '../../constants/theme';
import { ShareContext, UserContext } from '../../context';
import assetApi from '../../server-api/asset';
import downloadUtils from '../../utils/download';
import { loadTheme } from '../../utils/theme';
import toastUtils from '../../utils/toast';
import urlUtils from '../../utils/url';
import Button from '../common/buttons/button';
import AuthContainer from '../common/containers/auth-container';
import Input from '../common/inputs/input';
import Spinner from '../common/spinners/spinner';
import AssetDownloadProcess from './asset-download-process';
import styles from './index.module.css';
import ShareItem from './share-item';
import ShareOperationButtons from './share-operation-buttons';

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

// Contexts
const AssetShare = () => {
  const { email, setEmail } = useContext(ShareContext);
  const { logo: themeLogo, setLogo: setThemeLogo } = useContext(UserContext);

  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shareUserName, setShareUserName] = useState("");
  const [sharedCode, setSharedCode] = useState("");

  // new library air drag
  const selectableItems = useRef<Box[]>([]);
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);
  const selectionArea = useRef(null);




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
  };

  const done = () => {
    setDownloadStatus("done");
  };

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
    } catch (e) { }
  };

  useEffect(() => {
    getAssets();
  }, []);

  const getAssets = async () => {
    try {
      const { shareJWT, code } = urlUtils.getQueryParameters();

      // Allow get by both shareJWT or code (shareJWT has problem with very long at url issue)
      if (shareJWT || code) {
        const { data } = await assetApi.getSharedAssets({ shareJWT, email, code });
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
    } else {
      // Load theme from local storage
      const currentTheme = loadTheme();
      // @ts-ignore
      setThemeLogo(currentTheme.logoImage?.realUrl || defaultLogo);
    }
  };

  const onSelectionChange = (box) => {
    if (elementsContainerRef.current) {
      const containerRect = elementsContainerRef.current.getBoundingClientRect();
      const scrollAwareBox = {
        ...box,
        top: box.top - containerRect.top,
        left: box.left - containerRect.left
      };
      selectionArea.current = scrollAwareBox
    }
  };

  const bulkToggle = async (idsToFind) => {
    const updatedAssets = assets.map((asset, index) => {
      // Check if the object's ID is in the idsToFind array
      if (idsToFind.includes(asset.asset.id)) {
        // You can perform your update logic here
        // For example, toggle the isSelected property
        return {
          ...asset,
          isSelected: !asset.isSelected
        };
      }
      return asset; // Return the original object for non-matching IDs
    });
    setSelectedAsset(idsToFind.length);
    setAssets(updatedAssets);
  };

  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById("__next"),
    onSelectionChange,
    onSelectionStart: () => { },
    onSelectionEnd: (box) => {
      const indexesToSelect: string[] = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(selectionArea.current, item)) {
          indexesToSelect.push(item.id);
        }
      })
      if (indexesToSelect.length > 0) {
        bulkToggle(indexesToSelect);
      }
    },
    selectionProps: {
      style: {
        border: "2px solid darkblue",
        borderRadius: 4,
        backgroundColor: "lightskyblue",
        opacity: 0.5,
        zIndex: 9999
      },
    },
    isEnabled: true,
  });

  useEffect(() => {
    if (elementsContainerRef.current && assets?.length) {
      const containerRect = elementsContainerRef.current.getBoundingClientRect();
      const liElements = elementsContainerRef.current.querySelectorAll('li');

      selectableItems.current = new Array();
      Array.from(liElements).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const adjustedTop = top - containerRect.top;
        const adjustedLeft = left - containerRect.left;
        if (item.id !== "") selectableItems.current.push({
          left: adjustedLeft,
          top: adjustedTop,
          width,
          height,
          id: item.id,
        })

      });
    }
  }, [assets?.length]);

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
            <DragSelection />
            <div className={styles["list-wrapper"]}>
              <ul className={styles["grid-list"]}
                ref={elementsContainerRef}>
                {assets.map((assetItem) => {
                  return (
                    <li className={styles["grid-item"]} key={assetItem.asset.id} id={assetItem.asset.id}>
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
            selectedAsset={selectedAsset}
          />
        )}
      </section>
    </>
  );
};

export default AssetShare;
