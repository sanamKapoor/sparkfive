import React, { useContext, useEffect, useRef, useState } from "react";

// @ts-ignore
import styles from "./index.module.css";

import { Utilities, Assets } from "../../../../assets";
import Search from "../../attributes/search-input";
import LogoGrid from "../logo-grid";
import LogoList from "../logo-list";
import DriveSelector from "../../asset/drive-selector";
import Spinner from "../../spinners/spinner";

import { validation } from "../../../../constants/file-validation";
import assetApi from "../../../../server-api/asset";
import { getAssetsFilters } from "../../../../utils/asset";
import cookiesUtils from "../../../../utils/cookies";

import { isImageMimeType, isImageType } from "../../../../utils/file";
import toastUtils from "../../../../utils/toast";
import { useDebounce } from "../../../../hooks/useDebounce";

export default function LogoTypeSelection({ onSelect, onClose }: Props) {
  const fileBrowserRef = useRef(undefined);

  const [selectedIcon, setSelectedIcon] = useState();
  const [searchKey, setSearchKey] = useState("");
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearchKey = useDebounce(searchKey, 500);

  const uploadLogo = async (i: number, assets: any, totalSize: number) => {
    try {
      // @ts-ignore
      const formData = new FormData();
      let file = assets[i].file.originalFile;

      // Do validation
      if (assets[i].asset.size > validation.UPLOAD.MAX_SIZE.VALUE) {
        // Violate validation, mark failure
        const updatedAssets = assets.map((asset, index) =>
          index === i
            ? {
                ...asset,
                status: "fail",
                index,
                error: validation.UPLOAD.MAX_SIZE.ERROR_MESSAGE,
              }
            : asset,
        );

        // The final one
        if (i === assets.length - 1) {
          return true;
        } else {
          // Keep going
          await uploadLogo(i + 1, updatedAssets, totalSize);
        }
      } else {
        // Show uploading toast
        // showUploadProcess("uploading", i);

        // Set current upload file name
        // setUploadingFileName(assets[i].asset.name);

        // Append file to form data
        formData.append("asset", file);
        formData.append(
          "fileModifiedAt",
          new Date((file.lastModifiedDate || new Date(file.lastModified)).toUTCString()).toISOString(),
        );

        let size = totalSize;
        // Calculate the rest of size
        assets.map((asset) => {
          // Exclude done or fail assets
          if (asset.status === "done" || asset.status === "fail") {
            size -= asset.asset.size;
          }
        });

        let attachedQuery = { estimateTime: 0, size, totalSize, usageType: "logo" };

        // Call API to upload
        let { data } = await assetApi.uploadAssets(formData, attachedQuery);

        data = data.map((item) => {
          item.isSelected = true;
          return item;
        });

        assets[i] = data[0];

        // Mark this asset as done
        const updatedAssets = assets.map((asset, index) => (index === i ? { ...asset, status: "done" } : asset));

        // The final one
        if (i === assets.length - 1) {
          return;
        } else {
          // Keep going
          await uploadLogo(i + 1, updatedAssets, totalSize);
        }
      }
    } catch (e) {
      // Violate validation, mark failure
      const updatedAssets = assets.map((asset, index) =>
        index === i ? { ...asset, index, status: "fail", error: "Processing file error" } : asset,
      );

      // The final one
      if (i === assets.length - 1) {
        return true;
      } else {
        // Keep going
        await uploadLogo(i + 1, updatedAssets, totalSize);
      }
    }
  };

  const onFilesDataGet = async (files) => {
    try {
      let totalSize = 0;
      const logos = [];

      files.forEach((file) => {
        totalSize += file.originalFile.size;
        const asset = {
          name: file.originalFile.name,
          createdAt: new Date(),
          size: file.originalFile.size,
          stage: "draft",
          type: "image",
          mimeType: file.originalFile.type,
          fileModifiedAt: file.originalFile.lastModifiedDate || new Date(file.originalFile.lastModified),
        };
        logos.push({
          asset,
          file,
          status: "queued",
          isUploading: true,
        });

        // formData.append('asset', file.path || file.originalFile)
      });

      await uploadLogo(0, logos, totalSize);

      // Fetch logo after upload
      fetchLogos();
    } catch (err) {}
  };

  const onDropboxFilesGet = async (files) => {
    try {
      // Loading
      setLoading(true);
      let totalSize = 0;
      const logos = [];

      // Find non image files
      const nonSelectedImages = files.filter((file) => {
        const fileNames = file.name.split(".");
        const extension = fileNames[fileNames.length - 1];
        return !isImageType(extension);
      });

      // Has non image, alert error
      if (nonSelectedImages.length > 0) {
        toastUtils.error("Please only select SVG/JPG/PNG image");
        setLoading(false);
        return;
      }

      await assetApi.importAssets(
        "dropbox",
        files.map((file) => ({
          link: file.link,
          isDir: file.isDir,
          name: file.name,
          size: file.bytes,
        })),
        { estimateTime: 0, totalSize, usageType: "logo" },
      );

      // Fetch logo after import
      fetchLogos();
    } catch (err) {}
  };

  const onGdriveFilesGet = async (files) => {
    console.log(`>>> Google drive get files`, files);
    // Loading
    setLoading(true);

    // Fine non image files
    const nonSelectedImages = files.filter((file) => {
      return !isImageMimeType(file.mimeType);
    });

    // Has non image, alert error
    if (nonSelectedImages.length > 0) {
      toastUtils.error("Please only select SVG/JPG/PNG image");
      setLoading(false);
      return;
    }

    const googleAuthToken = cookiesUtils.get("gdriveToken");
    try {
      let totalSize = 0;

      await assetApi.importAssets(
        "drive",
        files.map((file) => ({
          googleAuthToken,
          id: file.id,
          name: file.name,
          size: file.sizeBytes,
          mimeType: file.mimeType,
          type: file.type,
        })),
        { estimateTime: 0, totalSize, usageType: "logo" },
      );

      // Fetch logo after import
      fetchLogos();
    } catch (err) {
      console.log(err);
    }
  };

  const onFileChange = async (e) => {
    setLoading(true);

    const files = Array.from(e.target.files).map((originalFile) => ({
      originalFile,
    }));

    // Show uploading process
    // showUploadProcess("uploading");

    onFilesDataGet(files);
  };

  const onDropboxFilesSelection = async (files) => {
    onDropboxFilesGet(files);
  };

  const onDriveFilesSelection = async (files) => {
    onGdriveFilesGet(files);
  };

  const openDropboxSelector = () => {
    const options = {
      success: onDropboxFilesSelection,
      linkType: "preview",
      multiselect: true,
      folderselect: true,
      sizeLimit: 1000 * 1024 * 1024 * 2,
    };
    // Ignore this annoying warning
    // @ts-ignore
    Dropbox.choose(options);
  };

  const fetchLogos = async (searchKey?: string) => {
    setLoading(true);

    const { data } = await assetApi.getAssets({
      ...getAssetsFilters({
        replace: true,
        addedIds: [],
        nextPage: 1,
        userFilterObject: {
          usageType: "logo",
        },
      }),
      complete: "1",
      term: searchKey || "",
    });

    setLogos(data.results);

    setLoading(false);
  };

  useEffect(() => {
    fetchLogos(debouncedSearchKey);
  }, [debouncedSearchKey]);

  useEffect(() => {
    fetchLogos();
  }, []);

  return (
    <div className={styles["dropdown-wrapper"]}>
      <input
        multiple={true}
        id="file-input-id"
        ref={fileBrowserRef}
        style={{ display: "none" }}
        type="file"
        accept="image/png, image/svg, image/jpeg, image/jpg"
        onChange={onFileChange}
      />
      <div className={styles["mobile-header"]}>
        <div>Change Logotype</div>
        <img src={Utilities.grayClose} alt={"close"} className={styles["close-btn-mobile"]} onClick={onClose} />
      </div>
      <div className={styles.header}>
        <ul className={styles.tab}>
          <li className={`${styles["nav-item"]} ${styles["nav-item-selected"]}`}>Library</li>
          <li
            className={styles["nav-item"]}
            onClick={() => {
              fileBrowserRef.current.click();
            }}
          >
            Upload
          </li>
          <li className={styles["nav-item"]}>
            <Assets.dropbox
              className={styles.icon}
              onClick={() => {
                openDropboxSelector();
              }}
            />{" "}
            Dropbox
          </li>
          <li className={styles["nav-item"]}>
            <DriveSelector multiSelect={true} folderSelect={true} onFilesSelect={onDriveFilesSelection}>
              <div className={styles["drive-upload"]}>
                <Assets.gdrive className={styles.icon} /> Google Drive
              </div>
            </DriveSelector>
          </li>
        </ul>

        <img src={Utilities.grayClose} alt={"close"} className={styles["close-btn"]} onClick={onClose} />
      </div>

      <div className={styles.content}>
        <Search
          value={searchKey}
          placeholder={"Search logo via name"}
          onChange={(value) => {
            setSearchKey(value);
          }}
          onClear={() => {}}
          onlyInput={true}
          styleType={styles["search-input"]}
          inputContainerStyle={styles["search-input-container"]}
        />

        {loading && (
          <div className={styles.loading}>
            <Spinner />
          </div>
        )}

        {!loading && debouncedSearchKey && (
          <LogoList
            data={logos}
            onSelect={(item) => {
              onSelect(item);
            }}
          />
        )}

        {!loading && !debouncedSearchKey && (
          <LogoGrid
            data={logos}
            selectedItem={selectedIcon}
            onSelect={(item) => {
              setSelectedIcon(item);
            }}
          />
        )}
        <button
          className={styles["save-btn"]}
          onClick={() => {
            onSelect(selectedIcon);
          }}
          disabled={loading}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

interface Props {
  onSelect: (value: string) => void;
  onClose: () => void;
}
