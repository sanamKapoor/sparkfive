import update from 'immutability-helper';
import fileDownload from 'js-file-download';
import { useRouter } from 'next/router';
import querystring from 'querystring';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Rnd } from 'react-rnd';
import Cookies from 'universal-cookie';

import { AssetOps, Utilities } from '../../../assets';
import AssetAddition from '../../../components/common/asset/asset-addition';
import AssetCropImg from '../../../components/common/asset/asset-crop-img';
import AssetIcon from '../../../components/common/asset/asset-icon';
import AssetImg from '../../../components/common/asset/asset-img';
import AssetNote from '../../../components/common/asset/asset-note';
import AssetNotes from '../../../components/common/asset/asset-notes';
import AssetPdf from '../../../components/common/asset/asset-pdf';
import AssetRelatedFilesList from '../../../components/common/asset/asset-related-files-list';
import AssetTranscript from '../../../components/common/asset/asset-transcript';
import CdnPanel from '../../../components/common/asset/cdn-panel';
import CropSidePanel from '../../../components/common/asset/crop-side-panel';
import styles from '../../../components/common/asset/detail-overlay.module.css';
import SidePanel from '../../../components/common/asset/detail-side-panel';
import VersionList from '../../../components/common/asset/version-list';
import Button from '../../../components/common/buttons/button';
import IconClickable from '../../../components/common/buttons/icon-clickable';
import ConversationList from '../../../components/common/conversation/conversation-list';
import Dropdown from '../../../components/common/inputs/dropdown';
import ConfirmModal from '../../../components/common/modals/confirm-modal';
import RenameModal from '../../../components/common/modals/rename-modal';
import ShareModal from '../../../components/common/modals/share-modal';
import { sizeToZipDownload } from '../../../constants/download';
import { ASSET_DOWNLOAD } from '../../../constants/permissions';
import { AssetContext, FilterContext, ShareContext, UserContext } from '../../../context';
import assetApi from '../../../server-api/asset';
import cookiesApi from '../../../utils/cookies';
import shareApi from '../../../server-api/share-collection';
import customFileSizeApi from '../../../server-api/size';
import downloadUtils from '../../../utils/download';
import { isImageType } from '../../../utils/file';
import toastUtils from '../../../utils/toast';
import urlUtils from '../../../utils/url';
import { events, shareLinkEvents } from '../../../constants/analytics';
import useAnalytics from '../../../hooks/useAnalytics';

// Components
const getDefaultDownloadImageType = (extension) => {
    const defaultDownloadImageTypes = [
        {
            value: "png",
            label: "PNG",
        },
        {
            value: "jpg",
            label: "JPG",
        },
        {
            value: "tiff",
            label: "TIFF",
        },
    ];
    let foundExtension = extension || "";
    if (extension === "jpeg") {
        foundExtension = "jpg";
    }
    if (extension === "tif") {
        foundExtension = "tiff";
    }
    const existingExtension = defaultDownloadImageTypes.filter((type) => type.value === foundExtension);
    // Already existed
    if (existingExtension.length > 0) {
        return defaultDownloadImageTypes.map((type) => {
            if (type.value === foundExtension) {
                type.label = `${foundExtension.toUpperCase()} (original)`;
            }

            return type;
        });
    } else {
        return defaultDownloadImageTypes.concat([
            {
                value: foundExtension,
                label: `${foundExtension.toUpperCase()} (original)`,
            },
        ]);
    }
};

const getResizeSize = (assetWidth, assetHeight): any => {
    const maximumWidth = 900;
    const maximumHeight = 900;
    if (assetWidth > maximumWidth) {
        return {
            width: maximumWidth,
            height: maximumHeight * (assetHeight / assetWidth),
        };
    }

    if (assetHeight > maximumHeight) {
        return {
            width: maximumWidth * (assetWidth / assetHeight),
            height: maximumHeight,
        };
    }

    return {
        width: assetWidth,
        height: assetHeight,
    };
};

const DetailOverlay = ({
    realUrl,
    thumbailUrl,
    asset,
    availableNext = true,
    sharedCode = "",
    isShare = false,
    sharePath,
    completeAsset,
    loadMore = () => { },
    activeSubFolders,
    activeFolder,
    headerName
}) => {
    const router = useRouter();

    if (!asset) {
        if (isShare) {
            router.back()
        } else {
            router.push('/main/assets')
        }
    }

    const { user, cdnAccess, transcriptAccess, hasPermission } = useContext(UserContext);

    const { activeOperation, assets, setAssets, folders, needsFetch, updateDownloadingStatus, setDetailOverlayId, setOperationAssets,
        setHeaderName,
        subFoldersAssetsViewList: {
            results: subcollectionAssets,
            next: nextAsset,
            total: totalAssets,
        },
        setSubFoldersAssetsViewList,
        subFoldersViewList,
        currentFolder,
        setActiveOperation,
        setOperationAsset,
        setOperationFolder,
        operationAsset,
        operationFolder,
        operationAssets,
        setActiveFolder,
        setActiveSubFolders,

    } = useContext(AssetContext);

    const { folderInfo } = useContext(ShareContext);

    const { activeSortFilter } = useContext(FilterContext);
    const { trackEvent, trackLinkEvent } = useAnalytics();

    const [assetDetail, setAssetDetail] = useState(undefined);

    const [renameModalOpen, setRenameModalOpen] = useState(false);

    const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

    const [activeCollection, setActiveCollection] = useState({
        name: "",
        assets: [],
    });

    const [assetIndex, setAssetIndex] = useState(0);

    const [activeSideComponent, setActiveSidecomponent] = useState("detail");

    const [sideOpen, setSideOpen] = useState(true);

    const [versionCount, setVersionCount] = useState(0);
    const [versions, setVersions] = useState([]);
    const [currentAsset, setCurrentAsset] = useState(asset);
    const [changedVersion, setChangedVersion] = useState(false); // to track version uploaded on overlay close
    const [versionRealUrl, setVersionRealUrl] = useState(realUrl);
    const [versionThumbnailUrl, setVersionThumbnailUrl] = useState(thumbailUrl);
    const [previewUrl, setPreviewUrl] = useState(null);
    const resizeSizes = getResizeSize(currentAsset?.dimensionWidth, currentAsset?.dimensionHeight);

    const [detailPosSize, setDetailPosSize] = useState({
        x: 0,
        y: 0,
        width: resizeSizes.width,
        height: resizeSizes.height,
    });

    const [defaultSize, setDefaultSize] = useState({
        width: currentAsset?.dimensionWidth,
        height: currentAsset?.dimensionHeight,
    });

    const [notes, setNotes] = useState([]);

    const [sizeOfCrop, setSizeOfCrop] = useState({
        width: defaultSize.width,
        height: defaultSize.height,
    });

    const [transcripts, setTranscript] = useState([]);

    // delete state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [activeAssetId, setActiveAssetId] = useState("");

    const renameValue = useRef("");

    const setRenameValue = (value) => {
        renameValue.current = value;
    };

    const calculateNoteHeight = () => {
        const element = document.getElementById(`notes - ${currentAsset.id} `);
        return element ? element.offsetHeight + 90 : 0;
    };

    const [noteHeight, setNoteHeight] = useState(calculateNoteHeight());

    // For resize and cropping
    const [downloadImageTypes, setDownloadImageTypes] = useState(getDefaultDownloadImageType(currentAsset.extension));
    const [mode, setMode] = useState("detail"); // Available options: resize, crop, detail
    const [imageType, setImageType] = useState(currentAsset.extension);

    const [presetTypes, setPresetTypes] = useState([
        {
            label: "None",
            value: "none",
            width: currentAsset.dimensionWidth,
            height: currentAsset.dimensionHeight,
        },
    ]);

    const [preset, setPreset] = useState<any>(presetTypes[0]);

    const [sizes, setSizes] = useState([
        {
            label: "Original",
            value: "none",
            width: currentAsset.dimensionWidth,
            height: currentAsset.dimensionHeight,
        },
    ]);
    const [size, setSize] = useState<any>(sizes[0]);

    const [width, setWidth] = useState<number>(currentAsset.dimensionWidth);
    const [height, setHeight] = useState<number>(currentAsset.dimensionHeight);
    const [transcriptLoading, setTranscriptLoading] = useState(true);

    const resetValues = () => {
        const width = currentAsset.dimensionWidth;
        const height = currentAsset.dimensionHeight;
        setPreset({
            label: "None",
            value: "none",
            width: width,
            height: height,
        });
        setSize({
            label: "Original",
            value: "none",
            width: width,
            height: height,
        });
        setWidth(width);
        setHeight(height);
        setImageType(currentAsset.extension);
    };

    const getCropResizeOptions = async () => {
        try {
            if (isShare) {
                const { data } = await customFileSizeApi.getSharedSizePresetsByGroup();

                // @ts-ignore
                setPresetTypes(presetTypes.concat(data));
            } else {
                const { data } = await customFileSizeApi.getSizePresetsByGroup();
                if (data) {
                    // @ts-ignore
                    setPresetTypes(presetTypes.concat(data));
                }
            }
        } catch (e) { }
    };

    const _setActiveCollection = () => {
        // TODO: ? What is purpose of this ?
        if (activeFolder && activeSubFolders !== "") {
            let folder = {}
            if (folderInfo?.singleSharedCollectionId && isShare) {
                folder = folderInfo.sharedFolder
            } else {
                folder = folders.find((folder) => {
                    return folder.id === activeSubFolders
                })
            }
            if (folder) {
                setActiveCollection(folder);
                const assetIndx = subcollectionAssets.findIndex((item) => item.asset && item.asset.id === currentAsset.id);
                setAssetIndex(assetIndx);
            } else if (currentFolder) {
                setActiveCollection(currentFolder);
                const assetIndx = subcollectionAssets.findIndex((item) => item.asset && item.asset.id === currentAsset.id);
                setAssetIndex(assetIndx);
            }
        } else if (activeFolder && activeSubFolders === "") {
            const folder = subFoldersViewList?.results?.find((folder) => {
                return folder.id === activeFolder
            })
            if (folder) {
                setActiveCollection(folder);
                const assetIndx = assets.findIndex((item) => item.asset && item.asset.id === currentAsset.id);
                setAssetIndex(assetIndx);
            } else if (currentFolder) {
                setActiveCollection(currentFolder);
                const assetIndx = assets.findIndex((item) => item.asset && item.asset.id === currentAsset.id);
                setAssetIndex(assetIndx);
            }
        }
    };

    const onChangeNoteHeight = () => {
        setTimeout(() => {
            setNoteHeight(calculateNoteHeight());
        }, 100);
    };

    useEffect(() => {
        if (transcriptAccess) {
            getTranscript();
        }
        getCropResizeOptions();
        getDetail();
        checkInitialParams();
        _setActiveCollection();
    }, [currentAsset]);

    useEffect(() => {
        if (currentAsset.id !== asset.id) {
            setCurrentAsset(asset);
        }
    }, [asset]);

    useEffect(() => {
        onChangeNoteHeight();
    }, [notes]);

    useEffect(() => {
        window.addEventListener("resize", onChangeNoteHeight);
        return () => {
            window.removeEventListener("resize", onChangeNoteHeight);
        };
    }, []);

    useEffect(() => {
        if (asset) {
            if ((!needsFetch || needsFetch === "versions") && !isShare) {
                loadVersions();
            }
            if (!needsFetch) {
                loadNotes();
            }
        }
    }, [needsFetch]);

    // Subscribe mode change, if user back/enter to detail page, should reset all size value do default
    useEffect(() => {
        if (mode === "detail") {
            // Set default size to none
            setSizes([
                {
                    label: "Original",
                    value: "none",
                    width: currentAsset.dimensionWidth,
                    height: currentAsset.dimensionHeight,
                },
            ]);
            setSize({
                label: "Original",
                value: "none",
                width: currentAsset.dimensionWidth,
                height: currentAsset.dimensionHeight,
            });
            setPreset({
                label: "None",
                value: "none",
                width: currentAsset.dimensionWidth,
                height: currentAsset.dimensionHeight,
            });
            setWidth(currentAsset.dimensionWidth);
            setHeight(currentAsset.dimensionHeight);
        }
    }, [mode, currentAsset]);

    const checkInitialParams = () => {
        setActiveSidecomponent("detail");
    };

    const getDetail = async (curAsset?) => {
        try {
            const asset = curAsset || currentAsset;
            if (isShare) {
                const { data } = await shareApi.getAssetById(asset.id, { sharePath, sharedCode });

                if (data.asset.id !== assetDetail?.id) {
                    setAssetDetail(data.asset);
                    setPreviewUrl(data.previewUrl);
                    setVersionRealUrl(data.realUrl);
                    setVersionThumbnailUrl(data.thumbailUrl);
                    setCurrentAsset({ ...currentAsset, thumbailUrl: data.thumbailUrl });
                }
            } else {
                const { data } = await assetApi.getById(asset.id);

                if (data.asset.id !== assetDetail?.id) {
                    setAssetDetail(data.asset);
                    setPreviewUrl(data.previewUrl);
                    setVersionRealUrl(data.realUrl);
                    setVersionThumbnailUrl(data.thumbailUrl);

                    // This is for showing current asset image in version list
                    setCurrentAsset({ ...data.asset, thumbailUrl: data.thumbailUrl });
                }
            }
        } catch (err) {
            // console.log(err);
        }
    };

    const onChangeRelatedFiles = (fileAssociations) => {
        setAssetDetail({ ...assetDetail, fileAssociations });
    };

    const getTranscript = async (curAsset?) => {
        try {
            setTranscriptLoading(true);
            const asset = curAsset || currentAsset;
            const { data } = await assetApi.getTranscript(asset.id);
            setTranscript(data);
            setTranscriptLoading(false);
        } catch (err) {
            setTranscriptLoading(false);
            // console.log(err);
        }
    };

    const updateAsset = async (inputData) => {
        try {
            // Optimistic data set
            setAssetDetail({
                ...assetDetail,
                ...inputData.updateData,
            });
            const { data } = await assetApi.updateAsset(currentAsset.id, inputData);
            setAssetDetail(data);
        } catch (err) {
            // console.log(err);
        }
    };

    const updateAssetName = async (assetId, newValue, assetsList, setAssetsList) => {
        try {
            const editedName = `${newValue}.${assetDetail.extension} `;
            await assetApi.updateAsset(assetId, {
                updateData: { name: editedName },
            });
            const modAssetIndex = assetsList.findIndex((assetItem) => assetItem.asset.id === assetId);
            if (modAssetIndex !== -1) {
                setAssetsList(
                    update(assetsList, {
                        [modAssetIndex]: {
                            asset: {
                                name: { $set: editedName },
                            },
                        },
                    })
                );
                setAssetDetail(
                    update(assetDetail, {
                        name: { $set: editedName },
                    })
                );
                toastUtils.success("Asset name updated");
            }

        } catch (err) {
            toastUtils.error("Could not update asset name");
        }
    };

    const confirmAssetRename = async (newValue) => {
        try {
            if (activeSortFilter.mainFilter === "SubCollectionView") {
                await updateAssetName(currentAsset.id, newValue, subcollectionAssets, setSubFoldersAssetsViewList);
            } else {
                await updateAssetName(currentAsset.id, newValue, assets, setAssets);
            }
        } catch (err) {
            // Handle the error if needed
        }
    };

    const toggleSideMenu = (value = null) => {
        if (value === null) setSideOpen(!sideOpen);
        else setSideOpen(value);
    };

    const changeActiveSide = (side) => {
        setActiveSidecomponent(side);
        setSideOpen(true);
    };

    // On Crop/Resize select change
    const onSelectChange = (type, value) => {
        if (type === "preset") {
            setPreset(value);
            // Restore values
            if (value.value === "none") {
                // Set width, height as their original size
                setWidth(currentAsset.dimensionWidth);
                setHeight(currentAsset.dimensionHeight);

                // Set default size to none
                setSize({
                    label: "Original",
                    value: "none",
                    width: currentAsset.dimensionWidth,
                    height: currentAsset.dimensionHeight,
                });

                // Restore size back to temp size
                setSizes([
                    {
                        label: "Original",
                        value: "none",
                        width: currentAsset.dimensionWidth,
                        height: currentAsset.dimensionHeight,
                    },
                ]);

                if (mode === "crop") {
                    setSizeOfCrop({
                        width: width,
                        height: height,
                    });
                } else {
                    setDetailPosSize({
                        ...detailPosSize,
                        width: defaultSize.width,
                        height: defaultSize.height,
                    });
                }
            } else {
                // Reset size value
                setSize(undefined);

                // Set size list by preset data
                setSizes(value.data);
            }
        }
        if (type === "size") {
            if (mode === "crop") {
                setSizeOfCrop({
                    width: value.width > detailPosSize.width ? detailPosSize.width : value.width,
                    height: value.height > detailPosSize.height ? detailPosSize.height : value.height,
                });
            } else {
                setWidth(value.width);
                setHeight(value.height);
                // set new rendering size in the <container></container>
                setDetailPosSize({
                    ...detailPosSize,
                    width: value.width > defaultSize.width ? defaultSize.width : value.width,
                    height: value.height > defaultSize.height ? defaultSize.height : value.height,
                });
            }
            setSize(value);
        }
    };

    const calculateRenderSize = (newW, newH) => {
        // calculate renderable height width based on provided value(preset size)
        if (defaultSize.height > defaultSize.width) {
            if (newH > defaultSize.height) {
                newH = defaultSize.height;
                newW = defaultSize.width;
            } else {
                newW = Math.round((newH * defaultSize.width) / defaultSize.height);
            }
        } else {
            if (newW > defaultSize.width) {
                newH = defaultSize.height;
                newW = defaultSize.width;
            } else {
                newH = Math.round((newW * defaultSize.height) / defaultSize.width);
            }
        }
        return { newH, newW };
    };

    // On width, height input change
    const onSizeInputChange = (name, value, resizeOption) => {
        const originalRatio = currentAsset.dimensionWidth / currentAsset.dimensionHeight;
        let _width = width,
            _height = height;
        if (resizeOption === "%") {
            if (value > 100) {
                value = 100;
            }
            value =
                name === "width"
                    ? Math.round((value * asset.dimensionWidth) / 100)
                    : Math.round((value * asset.dimensionHeight) / 100);
        }

        if (name === "width") {
            if (value) {
                if (value <= currentAsset.dimensionWidth) {
                    _width = value;

                    if (mode === "resize") {
                        _height = Math.round(value / originalRatio);
                    }
                }
            } else {
                _width = value;
            }
        }

        if (name === "height") {
            if (value) {
                if (value <= currentAsset.dimensionHeight) {
                    _height = value;

                    if (mode === "resize") {
                        _width = Math.round(value * originalRatio);
                    }
                }
            } else {
                _height = value;
            }
        }

        const { newW, newH } = calculateRenderSize(_width, _height);

        setWidth(_width);
        setHeight(_height);

        const resizeSizes = getResizeSize(newW, newH);

        setDetailPosSize({
            ...detailPosSize,
            width: resizeSizes.width,
            height: resizeSizes.height,
        });
    };

    const lockCropping = () => {
        // Only lock if user is choose specific preset
        return (preset && preset.value !== "none") || (size && size.value !== "none");
    };

    const downloadSelectedAssets = async (id) => {
        const { shareJWT } = urlUtils.getQueryParameters();
        try {
            let payload = {
                assetIds: [id],
            };

            let totalDownloadingAssets = 1;
            let filters = {
                estimateTime: 1,
            };

            // Download files in shared collection or normal download (not share)
            if ((isShare && sharePath && !sharedCode) || !isShare) {
                // Add sharePath property if user is at share collection page
                if (sharePath) {
                    filters["sharePath"] = sharePath;
                }

                // Show processing bar
                updateDownloadingStatus("zipping", 0, totalDownloadingAssets);

                let api: any = assetApi;

                if (isShare) {
                    api = shareApi;
                }

                const { data } = await api.downloadAll(payload, filters);

                // Download file to storage
                fileDownload(data, "assets.zip");

                updateDownloadingStatus("done", 0, 0);
            } else {
                // Download shared single asset
                if (isShare && !sharePath && sharedCode) {
                    // Show processing bar
                    updateDownloadingStatus("zipping", 0, totalDownloadingAssets);

                    const { data } = await assetApi.shareDownload(payload, {
                        code: sharedCode,
                    });

                    // Download file to storage
                    fileDownload(data, "assets.zip");

                    updateDownloadingStatus("done", 0, 0);
                }
            }

            // Track download asset event
            if (isShare) {
                trackLinkEvent(
                    shareLinkEvents.DOWNLOAD_SHARED_ASSET,
                    {
                        email: cookiesApi.get('shared_email') || null,
                        teamId: cookiesApi.get('teamId') || null,
                        assetId: asset.id,
                    });
            } else {
                trackEvent(events.DOWNLOAD_ASSET, {
                    assetId: asset.id,
                });
            }
        } catch (e) {
            const errorResponse = (await e?.response?.data?.text()) || "{}";
            const parsedErrorResponse = JSON.parse(errorResponse);
            updateDownloadingStatus("error", 0, 0, parsedErrorResponse?.message || "Internal Server Error. Please try again.");
        }
    };

    const setDisplayVersions = (versionAssets) => {
        const versionCount = versionAssets.length;
        versionAssets = versionAssets.map((asset, indx) => {
            // For architectural reason versions are stored in database in
            // the order 1(current), 2, 3, 4 ( recent to oldest)
            // So need to display in reverse order
            asset.displayVersion = versionCount - indx + 1;
            return asset;
        });
        return versionAssets;
    };

    const updateList = (versionAssets, curAsset) => {
        versionAssets = setDisplayVersions(versionAssets);
        if (currentAsset.id !== curAsset.id) {
            setCurrentAsset(curAsset);
        }

        setVersions(versionAssets);
        setVersionCount(versionAssets.length);
    };

    const loadVersions = async () => {
        try {
            const { data } = await assetApi.getVersions(currentAsset.versionGroup);
            updateList(data.versions, data.currentAsset);

            if (data.currentAsset.id !== currentAsset.id) {
                getDetail(data.currentAsset);
            }
        } catch (err) {
            // console.log(err)
        }
    };

    const downloadAsset = (id) => {
        if (currentAsset >= sizeToZipDownload || currentAsset.type === "video") {
            downloadSelectedAssets(id);
        } else {
            if (isShare) {
                trackLinkEvent(
                    shareLinkEvents.DOWNLOAD_SHARED_ASSET,
                    {
                        email: cookiesApi.get('shared_email') || null,
                        teamId: cookiesApi.get('teamId') || null,
                        assetId: currentAsset.id,
                    });
            } else {
                trackEvent(events.DOWNLOAD_ASSET, {
                    assetId: currentAsset.id,
                });
            }

            downloadUtils.downloadFile(versionRealUrl, currentAsset.name);
        }
    };

    const loadNotes = async () => {
        try {
            const assetId = currentAsset.id;
            const { data } = await assetApi.getNotes(assetId);
            setNotes(data || []);
        } catch (err) {
            // console.log(err)
        }
    };

    const revertToCurrent = async (version) => {
        try {
            const { data: newOrderedAssts } = await assetApi.revertVersion({
                revertAssetId: version.id,
                versionGroup: version.versionGroup,
            });
            const curAsset = newOrderedAssts[0];
            const versionAssets = newOrderedAssts.splice(1);

            updateList(versionAssets, curAsset);
            toastUtils.success("Version successfully reverted to current");
        } catch (err) {
            // console.log(err)
        }
    };

    const shouldRenderCdnTabButton = () => {
        const checkValid = (stringsToCheck: string[], paramToCheck: string) => {
            let result = false;

            if (!paramToCheck) return false;

            stringsToCheck.forEach((str) => {
                const isValid = str.toLowerCase() === paramToCheck.toLowerCase();

                if (!result) result = isValid;
            });

            return result;
        };

        const isTypeValid = checkValid(["image", "video", "pdf"], assetDetail?.type);
        const isExtensionValid = checkValid(
            ["png", "jpg", "gif", "tif", "tiff", "webp", "svg", "mp4", "mov", "avi", "pdf"],
            assetDetail?.extension,
        );
        const isUserValid = (user.roleId === "admin" || user.roleId === "super_admin") && cdnAccess;

        return isTypeValid && isExtensionValid && isUserValid;
    };

    const deleteVersion = async (version) => {
        try {
            await assetApi.deleteAsset(version.id);
            let clonedVersions = [...versions];
            clonedVersions = clonedVersions.filter((asset) => asset.id !== version.id);
            clonedVersions = setDisplayVersions(clonedVersions);
            setVersions(clonedVersions);
            toastUtils.success("Version deleted successfully.");
        } catch (err) {
            // console.log(err)
        }
    };

    const onUserEvent = (eventName, currentVersion) => {
        if (eventName !== "delete") {
            setVersionRealUrl(currentVersion.realUrl);
            setVersionThumbnailUrl(currentVersion.thumbailUrl);
        }

        switch (eventName) {
            case "delete":
                deleteVersion(currentVersion);
                break;
            case "revert":
                revertToCurrent(currentVersion);
                setChangedVersion(true); // to track version uploaded on overlay close
                getDetail(currentVersion);
                break;
            case "upload":
                setChangedVersion(true); // to track version uploaded on overlay close
                loadVersions();
                break;
        }
    };

    const applyCrud = (action, note) => {
        switch (action) {
            case "add":
                setNotes([...notes, note]);
                break;

            case "edit":
                const _notes = notes.map((_note) => {
                    if (_note.id === note.id) {
                        _note.text = note.text;
                    }
                    return _note;
                });
                setNotes(_notes);
                break;

            case "delete":
                const restNotes = notes.filter((_note) => _note.id !== note.id);
                setNotes(restNotes);
                break;
        }
    };

    const navigateOverlay = (navBy) => {
        if (activeSubFolders !== "" && activeFolder !== "") {
            const currentIndx = subcollectionAssets.findIndex((item) => asset && item.asset && item.asset.id === currentAsset.id);
            const newIndx = currentIndx + navBy;
            if (newIndx >= 0) {
                setAssetIndex(newIndx);
                setCurrentAsset({
                    ...subcollectionAssets[newIndx].asset, thumbailUrl: subcollectionAssets[newIndx].thumbailUrl
                });
                setDetailOverlayId(subcollectionAssets[newIndx].asset.id);
            }
        }
        else if (activeFolder !== "" && activeSubFolders === "") {
            const currentIndx = assets.findIndex((item) => asset && item.asset && item.asset.id === currentAsset.id);
            const newIndx = currentIndx + navBy;
            if (newIndx >= 0) {
                setAssetIndex(newIndx);
                setCurrentAsset({
                    ...assets[newIndx].asset, thumbailUrl: assets[newIndx].thumbailUrl
                });
                setDetailOverlayId(assets[newIndx].asset.id);
            }
        }
    };

    const resetImageSettings = (newWidth, newHeight) => {
        const img = document.querySelector(".app-overlay img.img-preview") as HTMLImageElement;
        // const draggable = document.querySelector('.app-overlay .react-draggable') as HTMLDivElement;
        // var positions = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
        // const pos = parseInt(positions[0]);
        const cWidth = newWidth || img.width;
        const cHeight = newHeight || img.height;
        let nw = img.naturalWidth;
        let nh = img.naturalHeight;
        var oRatio = nw / nh,
            cRatio = cWidth / cHeight;

        let width, height;
        if (oRatio > cRatio) {
            width = cWidth;
            height = cWidth / oRatio;
        } else {
            width = cHeight * oRatio;
            height = cHeight;
        }

        width = width > currentAsset.dimensionWidth ? currentAsset.dimensionWidth : Math.round(width);
        height = height > currentAsset.dimensionHeight ? currentAsset.dimensionHeight : Math.round(height);

        setDetailPosSize(Object.assign({ ...detailPosSize }, { height, width }));
        if (!newWidth && !newHeight) {
            setDefaultSize({ height, width });
        }
    };

    const onResizeStop = (w, h, position = {}) => {
        w = parseInt(w);
        h = parseInt(h);
        const resizeSizes = getResizeSize(w, h);
        setDetailPosSize(
            Object.assign(
                { ...detailPosSize },
                {
                    width: resizeSizes.width,
                    height: resizeSizes.height,
                    ...position,
                },
            ),
        );
        setWidth(w);
        setHeight(h);
    };

    //close overlay
    const _closeOverlay = () => {
        setOperationAssets([]);
        onCloseOverlay(changedVersion ? currentAsset : undefined);
        setDetailOverlayId(undefined);
    };

    const onCloseOverlay = (changedVersion = null) => {
        if (changedVersion) {
            refreshVersion(changedVersion);
        }
        if (activeFolder === "" && activeSubFolders !== "" && isShare) {
            setActiveFolder("");
            setActiveSubFolders(activeFolder);
        } else if (activeFolder !== "" && activeSubFolders !== "") {
            setActiveFolder("");
            setActiveSubFolders(activeFolder);
            if (!isShare) setHeaderName(headerName);
        } else if (activeFolder !== "" && activeSubFolders === "") {
            setActiveFolder(activeFolder);
            setActiveSubFolders("");
            if (!isShare) setHeaderName(headerName);
        }
        if (isShare) {
            router.back()
        } else {
            router.push("/main/assets")
        }
    };

    const refreshVersion = (currentVersion) => {
        if (!currentVersion) {
            return;
        }
        const assetsList = activeSortFilter.mainFilter === "SubCollectionView" ? subcollectionAssets : assets;

        const clonedAssets = [...assetsList].filter((asset) => !asset.isUploading);
        const versionIndex = clonedAssets.findIndex((item) => item.asset.versionGroup === currentVersion.versionGroup);

        if (versionIndex !== -1) {
            const oldAsset = clonedAssets[versionIndex];
            const newVersionAsset = {
                asset: currentVersion,
                realUrl: currentVersion.realUrl,
                thumbailUrl: currentVersion.thumbailUrl,
                toggleSelected: { ...oldAsset.toggleSelected },
            };

            clonedAssets[versionIndex] = newVersionAsset;

            if (activeSortFilter.mainFilter === "SubCollectionView") {
                setSubFoldersAssetsViewList({
                    nextAsset,
                    totalAssets,
                    results: clonedAssets,
                });
            } else {
                setAssets(clonedAssets);
            }
        }
    };

    const editThenDownload =
        currentAsset.extension !== "gif" &&
        currentAsset.extension !== "tiff" &&
        currentAsset.extension !== "tif" &&
        currentAsset.extension !== "svg" &&
        currentAsset.extension !== "svg+xml" &&
        currentAsset.type === "image" &&
        isImageType(assetDetail?.extension);

    const seekVideo = (secs) => {
        let myVideo = document.getElementById("video-element");
        if (myVideo) {
            // @ts-ignore
            if (myVideo.fastSeek) {
                // @ts-ignore
                myVideo.fastSeek(secs);
                // @ts-ignore
                myVideo.play();
            } else {
                // @ts-ignore
                myVideo.currentTime = secs;
                // @ts-ignore
                myVideo.play();
            }
        }
    };

    const beginAssetOperation = ({ asset = null, folder = null }, operation) => {        
        if (asset) {
            setOperationAsset(asset);
            trackEvent(events.SHARE_ASSET, {
                assetId: asset?.asset?.id,
            });
        }
        if (folder) {
            setOperationFolder(folder);
            trackEvent(events.SHARE_COLLECTION, {
                collectionId: folder?.id
            });
        }
        setActiveOperation(operation);
    };

    let operationLength = 0;

    // Check selected assets to be operated
    if (operationAsset) {
        operationLength = 1;
    } else if (operationFolder) {
        operationLength = operationFolder.assets.length;
    } else if (operationAssets.length > 0) {
        operationLength = operationAssets.length;
    }

    // ------- share asset functionality ------- //
    const openShareAsset = () => {
        return beginAssetOperation({ asset: completeAsset }, "share")
    }

    const shareAssets = async (recipients, message, sharedLinkData, closeAfterDone = true, showStatusToast = true) => {
        return new Promise<any>(async (resolve) => {
            try {
                let assetIds;
                let filters = {};
                if (operationAsset) {
                    assetIds = operationAsset.asset.id;
                } else if (operationFolder) {
                    assetIds = operationFolder.assets.map((asset) => asset.id).join(",");
                } else if (operationAssets.length > 0) {
                    assetIds = operationAssets.map((item) => item.asset.id).join(",");
                }

                const result = await assetApi.generateAndSendShareUrl(
                    {
                        recipients,
                        message,
                        ...sharedLinkData,
                        expiredPeriod: sharedLinkData.expiredPeriod?.value || "",
                        assetIds,
                    },
                    filters,
                );

                if (showStatusToast) {
                    toastUtils.success("Assets shared succesfully");
                }

                if (closeAfterDone) {
                    closeModalAndClearOpAsset();
                }

                resolve(result);
            } catch (err) {
                if (showStatusToast) {
                    toastUtils.error("Could not share assets, please try again later.");
                }
                resolve({});
            }
        });
    };

    const getShareLink = async (name, subCollectionShare = false) => {
        try {
            let versionGroups;
            let assetIds;
            let filters = {};
            if (operationAsset) {
                versionGroups = operationAsset.asset.versionGroup;
                assetIds = operationAsset.asset.id;
            } else if (operationFolder) {
                versionGroups = operationFolder.assets.map((asset) => asset.versionGroup).join(",");
                assetIds = operationFolder.assets.map((asset) => asset.id).join(",");
            } else if (operationAssets.length > 0) {
                versionGroups = operationAssets.map((item) => item.asset.versionGroup).join(",");
                assetIds = operationAssets.map((item) => item.asset.id).join(",");
            }
            filters["name"] = name;
            const getCustomFields = (filters) => {
                let fields = "";
                Object.keys(filters).map((key) => {
                    if (key.includes("custom-p")) {
                        if (fields) {
                            fields = `${fields},${filters[key]} `;
                        } else {
                            fields = `${filters[key]} `;
                        }
                    }
                });
                return fields;
            };

            const customFields = getCustomFields(filters);
            const params = {
                versionGroups,
                assetIds,
            };
            // Create sub collection from tags/custom fields (only create sub colleciton if all filtered assets selected)
            if (filters["folderId"] && (customFields || filters["tags"]) && filters["selectedAll"] && subCollectionShare) {
                params["customFields"] = customFields;
                params["folderId"] = filters["folderId"];
                params["tags"] = filters["tags"];
                filters["subCollection"] = "1";
            }
            return await assetApi.getShareUrl(params, filters);
        } catch (err) {
            console.log(err);
            return "";
        }
    };

    const closeModalAndClearOpAsset = () => {
        setActiveOperation("");
        setOperationAsset(null);
        setOperationFolder(null);
    };

    // -------  delete Overlay single module ------- //
    const openDeleteAsset = (id) => {
        setActiveAssetId(id);
        setDeleteModalOpen(true);
    };

    const deleteAsset = async (id) => {
        try {
            let assetsApi: any = assetApi;
            await assetsApi.updateAsset(id, {
                updateData: {
                    status: "deleted",
                    stage: "draft",
                    deletedAt: new Date(new Date().toUTCString()).toISOString(),
                },
            });
            if (mode === "SubCollectionView") {
                const assetIndex = subcollectionAssets.findIndex((assetItem) => assetItem.asset.id === id);
                if (assetIndex !== -1) {
                    setSubFoldersAssetsViewList({
                        next: nextAsset,
                        results: update(subcollectionAssets, {
                            $splice: [[assetIndex, 1]],
                        }),
                        total: totalAssets - 1,
                    });
                }
            } else {
                const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
                if (assetIndex !== -1)
                    setAssets(
                        update(assets, {
                            $splice: [[assetIndex, 1]],
                        }),
                    );
            }
            onCloseOverlay()
            toastUtils.success("Assets deleted successfully");
        } catch (err) {
            toastUtils.error("Could not delete assets, please try again later.");
        }
    };

    return (
        <div className={`app - overlay ${styles.container} ${isShare ? styles.share : ""} `}>
            {assetDetail && (
                <section id={"detail-overlay"} className={styles.content}>
                    <div className={styles["top-wrapper"]}>
                        <div className={styles["back-name"]}>
                            <div className={styles.back}
                                onClick={_closeOverlay}
                            >
                                <IconClickable src={Utilities.backWhite} />
                                <span>Back</span>
                            </div>
                            <div>
                                <div className={styles.name}>
                                    <h3>{assetDetail.name}</h3>
                                    {!isShare && <IconClickable src={Utilities.editLight} onClick={() => setRenameModalOpen(true)} />}
                                </div>
                                {!isShare && (
                                    <div className={styles["versions-related-wrapper"]}>
                                        {hasPermission(["admin", "super_admin"]) && versionCount > 0 && (
                                            <div
                                                className={styles["versions-number"]}
                                                onClick={() => {
                                                    setMode("detail");
                                                    resetValues();
                                                    changeActiveSide("versions");
                                                }}
                                            >
                                                {versionCount + 1} versions
                                            </div>
                                        )}
                                        {assetDetail?.fileAssociations?.length > 0 && (
                                            <>
                                                <img src={Utilities.ellipse} />
                                                <div
                                                    className={styles["related-number"]}
                                                    onClick={() => {
                                                        setMode("detail");
                                                        resetValues();
                                                        changeActiveSide("related");
                                                    }}
                                                >
                                                    {assetDetail?.fileAssociations?.length} Related files
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles["asset-actions"]}>
                            {hasPermission(["admin", "super_admin"]) && (
                                <div className={styles["only-desktop-button"]}>
                                    <AssetAddition
                                        folderAdd={false}
                                        versionGroup={assetDetail.versionGroup}
                                        assetDetailPage={true}
                                        triggerUploadComplete={onUserEvent}
                                    />
                                </div>
                            )}
                            {!isShare && (
                                <>
                                    <Button
                                        text={"Share"}
                                        type={"button"}
                                        className={`container ${styles["only-desktop-button"]} primary`}
                                        onClick={openShareAsset}
                                    />
                                    <div className={styles["only-mobile-button"]}>
                                        <IconClickable
                                            additionalClass={styles["only-mobile-button"]}
                                            src={AssetOps.shareWhite}
                                            onClick={openShareAsset}
                                        />
                                    </div>
                                </>
                            )}
                            {mode === "detail" && (isShare || hasPermission([ASSET_DOWNLOAD])) && (
                                <>
                                    <Button
                                        text={"Download"}
                                        type={"button"}
                                        className={`container ${styles["only-desktop-button"]} secondary`}
                                        onClick={() => {
                                            if (editThenDownload) {
                                                setDownloadDropdownOpen(true);
                                            } else {
                                                downloadSelectedAssets(currentAsset.id);
                                            }
                                        }}
                                    />
                                    <div className={styles["only-mobile-button"]}>
                                        <IconClickable
                                            className={styles["only-mobile-button"]}
                                            src={AssetOps.downloadWhite}
                                            onClick={() => setDownloadDropdownOpen(true)}
                                        />
                                    </div>

                                    {downloadDropdownOpen && (
                                        <div className={styles["download-list-dropdown"]}>
                                            <Dropdown
                                                onClickOutside={() => setDownloadDropdownOpen(false)}
                                                additionalClass={styles["more-dropdown"]}
                                                options={[
                                                    {
                                                        id: "download",
                                                        label: "Download Original",
                                                        onClick: () => downloadAsset(currentAsset.id),
                                                    },
                                                    {
                                                        id: "edit",
                                                        label: "Edit then Download",
                                                        onClick: () => {
                                                            changeActiveSide("download");
                                                            setMode("resize");
                                                        },
                                                    },
                                                ]}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className={styles["notes-container"]}>
                        <div className={styles["notes-wrapper"]} id={`notes - ${currentAsset.id} `}>
                            {notes.map(
                                (note, indx) =>
                                    ((isShare && !note.internal) || !isShare) && (
                                        <AssetNote
                                            key={indx.toString()}
                                            title={`Note ${indx + 1} `}
                                            note={note.text}
                                            onShowClick={() => {
                                                onChangeNoteHeight();
                                            }}
                                        />
                                    ),
                            )}
                        </div>
                        <div className={`${!isShare ? styles["img-wrapper"] : styles["share-img-wrapper"]}${activeFolder && ` ${styles["active-folderimg"]}`
                            } `} style={{ height: `calc(100 % - ${noteHeight}px)` }}>
                            {assetDetail.type === "image" && (
                                <>
                                    {mode === "detail" && (
                                        <AssetImg
                                            imgClass="img-preview"
                                            name={assetDetail.name}
                                            assetImg={
                                                assetDetail.extension === "tiff" ||
                                                    assetDetail.extension === "tif" ||
                                                    assetDetail.extension === "svg" ||
                                                    assetDetail.extension === "svg+xml" ||
                                                    assetDetail.extension === "heif" ||
                                                    assetDetail.extension === "heic" ||
                                                    assetDetail.extension === "cr2"
                                                    ? versionThumbnailUrl
                                                    : versionRealUrl
                                            }
                                        />
                                    )}
                                    {mode === "resize" && (
                                        <Rnd
                                            position={{ x: detailPosSize.x, y: detailPosSize.y }}
                                            size={{
                                                width: detailPosSize.width,
                                                height: detailPosSize.height,
                                            }}
                                            className={`${styles["react-draggable"]} `}
                                            lockAspectRatio={true}
                                            onResizeStop={(e, direction, ref, delta, position) =>
                                                onResizeStop(ref.style.width, ref.style.height, position)
                                            }
                                        >
                                            <AssetImg name={assetDetail.name} assetImg={versionRealUrl} imgClass="img-preview" isResize />
                                        </Rnd>
                                    )}

                                    {mode === "crop" && (
                                        <AssetCropImg
                                            imageType={imageType}
                                            assetExtension={assetDetail.extension}
                                            setWidth={setWidth}
                                            setHeight={setHeight}
                                            locked={lockCropping()}
                                            name={assetDetail.name}
                                            assetImg={realUrl}
                                            width={width}
                                            height={height}
                                            sizeOfCrop={sizeOfCrop}
                                            setSizeOfCrop={setSizeOfCrop}
                                            detailPosSize={detailPosSize}
                                            associateFileId={currentAsset.id}
                                            onAddAssociate={(asset) => {
                                                const detail = { ...assetDetail };
                                                detail.fileAssociations.push(asset);

                                                setAssetDetail(detail);
                                            }}
                                            renameValue={renameValue}
                                        />
                                    )}
                                </>
                            )}
                            {assetDetail.type !== "image" &&
                                assetDetail.type !== "video" &&
                                versionThumbnailUrl &&
                                (assetDetail.extension.toLowerCase() === "pdf" ? (
                                    <AssetPdf asset={asset} />
                                ) : (
                                    <AssetImg name={assetDetail.name} assetImg={versionThumbnailUrl} imgClass="img-preview" />
                                ))}
                            {assetDetail.type !== "image" && assetDetail.type !== "video" && !versionThumbnailUrl && (
                                <AssetIcon extension={currentAsset.extension} />
                            )}
                            {
                                assetDetail.type === "video" && (
                                    <>
                                        {(previewUrl || (!previewUrl && currentAsset.extension === "mp4")) && <video controls id={"video-element"}>
                                            <source
                                                src={previewUrl ?? versionRealUrl}
                                                type={
                                                    "video/mp4"
                                                }
                                            />
                                            Sorry, your browser doesn't support video playback.
                                        </video>}
                                        {(!previewUrl && currentAsset.extension !== "mp4") && <AssetImg
                                            name={assetDetail.name}
                                            assetImg={""}
                                            type={"video"}
                                            imgClass="img-preview"
                                            isResize
                                        />}
                                    </>

                                )
                            }
                            {
                                activeCollection?.assetsCount !== undefined && activeFolder && activeSubFolders !== "" && (
                                    <div className={styles.arrows}>
                                        <div>
                                            {subcollectionAssets.length &&
                                                subcollectionAssets[0].asset &&
                                                subcollectionAssets[0].asset.id !== currentAsset.id && (
                                                    <span className={styles["arrow-prev"]}>
                                                        <IconClickable src={Utilities.arrowPrev} onClick={() => navigateOverlay(-1)} />
                                                    </span>
                                                )}
                                            {availableNext &&
                                                subcollectionAssets.length &&
                                                subcollectionAssets[subcollectionAssets.length - 1].asset &&
                                                subcollectionAssets[subcollectionAssets.length - 1].asset.id !== currentAsset.id && (
                                                    <span className={styles["arrow-next"]}>
                                                        <IconClickable src={Utilities.arrowNext} onClick={() => navigateOverlay(1)} />
                                                    </span>
                                                )}
                                        </div>
                                        <span>
                                            {(assetIndex % activeCollection?.assetsCount) + 1} of {activeCollection?.assetsCount} in{" "}
                                            {activeCollection?.name} collection
                                        </span>
                                    </div>
                                )
                            }
                            {
                                activeCollection?.assetsCount !== undefined && activeFolder && activeSubFolders === "" && (
                                    <div className={styles.arrows}>
                                        <div>
                                            {assets.length &&
                                                assets[0].asset &&
                                                assets[0].asset.id !== currentAsset.id && (
                                                    <span className={styles["arrow-prev"]}>
                                                        <IconClickable src={Utilities.arrowPrev} onClick={() => navigateOverlay(-1)} />
                                                    </span>
                                                )}
                                            {availableNext && assets.length && assets[assets.length - 1].asset &&
                                                assets[assets.length - 1].asset.id !== currentAsset.id && (
                                                    <span className={styles["arrow-next"]}>
                                                        <IconClickable src={Utilities.arrowNext} onClick={() => navigateOverlay(1)} />
                                                    </span>
                                                )}
                                        </div>
                                        <span>
                                            {(assetIndex % activeCollection?.assetsCount) + 1} of {activeCollection?.assetsCount} in{" "}
                                            {activeCollection?.name} collection
                                        </span>
                                    </div>
                                )
                            }
                        </div >
                    </div >
                </section >
            )}
            {
                sideOpen && (
                    <section className={styles.side}>
                        {assetDetail && activeSideComponent === "detail" && (
                            <>
                                {mode === "detail" && (
                                    <SidePanel
                                        asset={assetDetail}
                                        updateAsset={updateAsset}
                                        setAssetDetail={setAssetDetail}
                                        isShare={isShare}
                                    />
                                )}
                            </>
                        )}
                        {activeSideComponent === "download" && (
                            <CropSidePanel
                                isShare={isShare}
                                sharePath={sharePath}
                                imageType={imageType}
                                onImageTypeChange={(type) => {
                                    setImageType(type);
                                }}
                                downloadImageTypes={downloadImageTypes}
                                presetTypes={presetTypes}
                                presetTypeValue={preset}
                                sizes={sizes}
                                sizeValue={size}
                                mode={mode}
                                widthOriginal={width}
                                heightOriginal={height}
                                onModeChange={(mode) => {
                                    setMode(mode);
                                    if (mode === "crop") {
                                        setSizeOfCrop({
                                            width: Math.round(width / 2),
                                            height: Math.round(height / 2),
                                        });
                                    }
                                }}
                                onSelectChange={onSelectChange}
                                onSizeInputChange={onSizeInputChange}
                                asset={assetDetail}
                                onResetImageSize={() => {
                                    resetValues();
                                    setDetailPosSize({
                                        ...detailPosSize,
                                        width: defaultSize.width,
                                        height: defaultSize.height,
                                    });
                                }}
                                sizeOfCrop={sizeOfCrop}
                                setSizeOfCrop={setSizeOfCrop}
                                detailPosSize={detailPosSize}
                                onAddAssociate={(asset) => {
                                    const detail = { ...assetDetail };
                                    detail.fileAssociations.push(asset);

                                    setAssetDetail(detail);
                                }}
                                setRenameData={setRenameValue}
                            />
                        )}
                        {!isShare && activeSideComponent === "comments" && <ConversationList itemId={asset?.id} itemType="assets" />}
                        {!isShare && activeSideComponent === "versions" && (
                            <VersionList versions={versions} currentAsset={currentAsset} triggerUserEvent={onUserEvent} />
                        )}
                        {activeSideComponent === "cdn" && <CdnPanel assetDetail={assetDetail} />}

                        {activeSideComponent === "notes" && notes && <AssetNotes asset={asset} notes={notes} applyCrud={applyCrud} />}

                        {activeSideComponent === "related" && (
                            <AssetRelatedFilesList
                                currentAsset={assetDetail}
                                relatedAssets={assetDetail?.fileAssociations || []}
                                associateFileId={currentAsset.id}
                                onChangeRelatedFiles={onChangeRelatedFiles}
                                onAddRelatedFiles={(data) => {
                                    let updatedAssets = [...assetDetail.fileAssociations];
                                    updatedAssets = updatedAssets.concat(data);
                                    setAssetDetail({
                                        ...assetDetail,
                                        fileAssociations: updatedAssets,
                                    });
                                }}
                            />
                        )}
                        {activeSideComponent === "transcript" && transcripts && (
                            <AssetTranscript
                                title={"Transcript"}
                                transcripts={transcripts}
                                loading={transcriptLoading}
                                navigateToTime={seekVideo}
                            />
                        )}
                    </section>
                )
            }
            {/* Share page mobile right button */}
            {
                isShare && (
                    <div className={styles["share-right-button"]}>
                        {" "}
                        <IconClickable
                            src={Utilities.closePanelLight}
                            onClick={() => toggleSideMenu()}
                            additionalClass={`${styles["menu-icon"]} ${!sideOpen && "mirror"} `}
                        />{" "}
                        <IconClickable
                            SVGElement={isMobile ? Utilities.infoGray : Utilities.info}
                            additionalClass={styles["menu-icon"]}
                            onClick={() => {
                                setMode("detail");
                                resetValues();
                                changeActiveSide("detail");
                            }}
                        />
                    </div>
                )
            }
            {
                !isShare && (
                    <section className={styles.menu}>
                        <IconClickable
                            src={Utilities.closePanelLight}
                            onClick={() => toggleSideMenu()}
                            additionalClass={`${styles["menu-icon"]} ${!sideOpen && "mirror"} ${styles.expand
                                } `}
                        />
                        {!isShare && (
                            <>
                                <div className={`${styles.separator} ${styles.expand} `}></div>
                                <IconClickable
                                    SVGElement={Utilities.delete}
                                    additionalClass={styles["menu-icon"] + " " + styles["only-desktop-button"]}
                                    onClick={() => openDeleteAsset(assetDetail.id)}
                                />
                            </>
                        )}
                        <div className={styles.separator + " " + styles["only-desktop-button"]}></div>
                        <IconClickable
                            SVGElement={isMobile ? Utilities.infoGray : Utilities.info}
                            additionalClass={styles["menu-icon"]}
                            onClick={() => {
                                setMode("detail");
                                resetValues();
                                changeActiveSide("detail");
                            }}
                        />
                        {!isShare && (
                            <>
                                <IconClickable
                                    src={Utilities.tagGray}
                                    additionalClass={
                                        styles["menu-icon"] + " " + styles["only-mobile-button"]
                                    }
                                    onClick={() => { }}
                                />
                                <IconClickable
                                    SVGElement={isMobile ? Utilities.commentLight : Utilities.comment}
                                    additionalClass={styles["menu-icon"]}
                                    onClick={() => {
                                        setMode("detail");
                                        resetValues();
                                        changeActiveSide("comments");
                                    }}
                                />
                                {hasPermission(["admin", "super_admin"]) && (
                                    <div className={styles["only-mobile-button"]}>
                                        <AssetAddition
                                            folderAdd={false}
                                            // versionGroup={assetDetail.versionGroup}
                                            triggerUploadComplete={onUserEvent}
                                        />
                                    </div>
                                )}
                                {shouldRenderCdnTabButton() && (
                                    <IconClickable
                                        // src={Utilities.embedCdn}
                                        SVGElement={isMobile ? Utilities.embedCdnGrey : Utilities.embedCdn}
                                        additionalClass={styles["menu-icon"] + " " + styles["cdn-icon"]}
                                        onClick={() => {
                                            setMode("detail");
                                            resetValues();
                                            changeActiveSide("cdn");
                                        }}
                                    />
                                )}
                                {editThenDownload && hasPermission([ASSET_DOWNLOAD]) && (
                                    <IconClickable
                                        SVGElement={AssetOps.download}
                                        additionalClass={styles["menu-icon"] + " " + styles["only-desktop-button"]}
                                        onClick={() => {
                                            if (currentAsset.type === "image" && isImageType(currentAsset.extension)) {
                                                if (mode !== "resize" && mode !== "crop") {
                                                    setMode("resize");
                                                }
                                                changeActiveSide("download");
                                                resetImageSettings(undefined, undefined);
                                            } else {
                                                downloadSelectedAssets(currentAsset.id);
                                            }
                                        }}
                                    />
                                )}

                                <IconClickable
                                    SVGElement={isMobile ? Utilities.relatedLight : Utilities.related}
                                    additionalClass={styles["menu-icon"]}
                                    onClick={() => {
                                        setMode("detail");
                                        resetValues();
                                        changeActiveSide("related");
                                    }}
                                />
                                {hasPermission(["admin", "super_admin"]) && (
                                    <IconClickable
                                        SVGElement={isMobile ? Utilities.notesLight : Utilities.notes}
                                        additionalClass={styles["menu-icon"]}
                                        onClick={() => {
                                            setMode("detail");
                                            resetValues();
                                            changeActiveSide("notes");
                                        }}
                                    />
                                )}

                                {hasPermission(["admin", "super_admin"]) && versionCount > 0 && (
                                    <IconClickable
                                        SVGElement={isMobile ? Utilities.versionsLight : Utilities.versions}
                                        additionalClass={styles["menu-icon"]}
                                        onClick={() => {
                                            setMode("detail");
                                            resetValues();
                                            changeActiveSide("versions");
                                        }}
                                    />
                                )}
                            </>
                        )}
                        {transcriptAccess && assetDetail?.type === "video" && (
                            <IconClickable
                                SVGElement={Utilities.transcript}
                                additionalClass={styles[""]}
                                onClick={() => {
                                    setMode("detail");
                                    resetValues();
                                    changeActiveSide("transcript");
                                }}
                            />
                        )}
                    </section>
                )
            }
            <RenameModal
                closeModal={() => setRenameModalOpen(false)}
                modalIsOpen={renameModalOpen}
                renameConfirm={confirmAssetRename}
                type={"Asset"}
                initialValue={assetDetail?.name?.substring(0, assetDetail?.name.lastIndexOf("."))}
            />
            <ShareModal
                modalIsOpen={activeOperation === "share"}
                closeModal={closeModalAndClearOpAsset}
                itemsAmount={operationLength}
                shareAssets={shareAssets}
                getShareLink={getShareLink}
            />
            {/* Delete modal */}
            <ConfirmModal
                closeModal={() => setDeleteModalOpen(false)}
                confirmAction={() => {
                    deleteAsset(activeAssetId);
                    setActiveAssetId("");
                    setDeleteModalOpen(false);
                }}
                confirmText={"Delete"}
                message={
                    <span>
                        Are you sure you want to &nbsp;<strong>Delete</strong>&nbsp; this asset?
                    </span>
                }
                modalIsOpen={deleteModalOpen}
            />
        </div>
    );
};

export default DetailOverlay;