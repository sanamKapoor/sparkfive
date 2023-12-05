import clsx from 'clsx';
import update from 'immutability-helper';
import _ from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';

import { Utilities } from '../../../assets';
import GuestUploadApprovalOverlay from '../../../components/common/guest-upload-approval-overlay';
import { LoadingContext, UserContext } from '../../../context';
import { useMoveModal } from '../../../hooks/use-modal';
import { useAssetDetailCollecion } from '../../../hooks/use-asset-detail-collection'
import { useDebounce } from '../../../hooks/useDebounce';
import assetApi from '../../../server-api/asset';
import customFieldsApi from '../../../server-api/attribute';
import campaignApi from '../../../server-api/campaign';
import folderApi from '../../../server-api/folder';
import tagApi from '../../../server-api/tag';
import uploadApprovalApi from '../../../server-api/upload-approvals';
import toastUtils from '../../../utils/toast';
import assetGridStyles from '../../common/asset/asset-grid.module.css';
import AssetIcon from '../../common/asset/asset-icon';
import AssetImg from '../../common/asset/asset-img';
import AssetPdf from '../../common/asset/asset-pdf';
import AssetSubheader from '../../common/asset/asset-subheader';
import AssetThumbail from '../../common/asset/asset-thumbail';
import detailPanelStyles from '../../common/asset/detail-side-panel.module.css';
import ListItem from '../../common/asset/request-list-item';
import Button from '../../common/buttons/button';
import IconClickable from '../../common/buttons/icon-clickable';
import CreatableSelect from '../../common/inputs/creatable-select';
import Input from '../../common/inputs/input';
import Select from '../../common/inputs/select';
import TextArea from '../../common/inputs/text-area';
import CustomFieldSelector from '../../common/items/custom-field-selector';
import Base from '../../common/modals/base';
import ConfirmModal from '../../common/modals/confirm-modal';
import RenameModal from '../../common/modals/rename-modal';
import CollectionSubcollectionListing from '../collection-subcollection-listing';
import SingleCollectionSubcollectionListing from '../single-select-collection-subcollection'
import styles from './index.module.css';


interface Asset {
  id: string;
  name: string;
  type: string;
  thumbailUrl: string;
  realUrl: string;
  extension: string;
  version: number;
}
interface Item {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sharePath: null;
  sharePassword: null;
  shareStatus: null;
  status: string;
  thumbnailPath: null;
  thumbnailExtension: null;
  thumbnails: null;
  thumbnailStorageId: null;
  thumbnailName: null;
  assetsCount: string;
  assets: Asset[];
  size: string;
  length: number;
  parentId: string | null
}

const filterOptions = [
  {
    label: "Approved",
    value: 2,
  },
  {
    label: "Pending",
    value: 0,
  },
  {
    label: "Rejected",
    value: -1,
  },
];

// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
  let rs = [];
  list.map((field) => {
    let value = valueList.filter((valueField) => valueField.id === field.id);

    if (value.length > 0) {
      rs.push(value[0]);
    } else {
      let customField = { ...field };
      customField.values = [];
      rs.push(customField);
    }
  });

  return rs;
};

const UploadRequest = () => {
  const { user, hasPermission } = useContext(UserContext);
  const [top, setTop] = useState("calc(55px + 2rem)");
  const { setIsLoading } = useContext(LoadingContext);
  const [approvals, setApprovals] = useState([]);
  const [mode, setMode] = useState("list"); // Available options: list, view
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [inputTags, setInputTags] = useState([]);
  const [assetTags, setTags] = useState([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();
  const [tempTags, setTempTags] = useState([]); // For update tag in each asset
  const [tempCustoms, setTempCustoms] = useState([]); // For update custom in each asset
  const [tempComments, setTempComments] = useState(""); // For update tag in each asset
  const [currentApproval, setCurrentApproval] = useState();
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [approvalId, setApprovalId] = useState(); // Keep this to submit things related to current selected Approval
  const [currentViewStatus, setCurrentViewStatus] = useState(0); // 0: Pending, 1: Submitted, 2: Completed, -1: Rejected
  const [needRefresh, setNeedRefresh] = useState(false); // To check if need to refresh the list or not, used after saving tag/comments
  const [batchName, setBatchName] = useState("");
  const [selectedAllAssets, setSelectedAllAssets] = useState(false);
  const [selectedAllApprovals, setSelectedAllApprovals] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tempAssets, setTempAssets] = useState([]);
  const [tempApprovals, setTempApprovals] = useState([]);
  const [tempCampaigns, setTempCampaigns] = useState([]);
  const [tempFolders, setTempFolders] = useState([]);
  const [filter, setFilter] = useState();
  const [approvalIndex, setApprovalIndex] = useState();
  // Custom fields
  const [customs, setCustoms] = useState([]);
  const [activeCustomField, setActiveCustomField] = useState<number>();
  const [inputCustomFields, setInputCustomFields] = useState([]);
  const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, customs));

  // Campaigns
  const [inputCampaigns, setInputCampaigns] = useState([]);
  const [assetCampaigns, setCampaigns] = useState([]);

  // Folders
  const [inputFolders, setInputFolders] = useState([]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [requestInfo, setRequestInfo] = useState("");

  const debouncedBatchName = useDebounce(batchName, 500);

  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const {
    folders,
    selectedFolder,
    subFolderLoadingState,
    folderChildList,
    showDropdown,
    selectAllFolders,
    input,
    setInput,
    filteredData,
    getFolders,
    getSubFolders,
    toggleSelected: toggleSelectedFolders,
    toggleDropdown,
    toggleSelectAllChildList,
    setSelectedFolder,
    setShowDropdown,
    setSubFolderLoadingState,
    setFolderChildList,
    setSelectAllFolders,
    completeSelectedFolder,
  } = useMoveModal();


  const addFolderAssetView = async (newItem) => {

    if (isAdmin()) {
      // Admin can edit inline, dont need to hit save button
      setIsLoading(true);

      await assetApi.addFolder(
        assets[selectedAsset]?.asset.id,
        newItem
      );
      setIsLoading(false);
    } else {
      return { data: newItem };
    }

  };

  const updateAssetStateAssetView = (stateUpdate) => {
    updateAssetState({
      folders: { $set: stateUpdate },
    });
  };

  const deleteFolderAssetView = async (id,
    stateUpdate
  ) => {
    setIsLoading(true);

    await assetApi.removeFolder(
      assets[selectedAsset]?.asset.id,
      id
    );
    setIsLoading(false);

    updateAssetState({
      folders: { $set: stateUpdate },
    });
  };

  const {
    folders: foldersAssetView,
    resultedSearchFolders: resultedSearchFoldersAssetView,
    selectedFolder: selectedFolderAssetView,
    subFolderLoadingState: subFolderLoadingStateAssetView,
    folderChildList: folderChildListAssetView,
    showDropdown: showDropdownAssetView,
    input: inputAssetView,
    completeSelectedFolder: completeSelectedFolderAssetView,
    setInput: setInputAssetView,
    filteredData: filteredDataAssetView,
    getFolders: getFoldersAssetView,
    setFolderChildListItems: setFolderChildListItemsAssetView,
    getSubFolders: getSubFoldersAssetView,
    toggleSelected: toggleSelectedAssetView,
    toggleDropdown: toggleDropdownAssetView,
    setSelectedFolder: setSelectedFolderAssetView,
    setShowDropdown: setShowDropdownAssetView,
    setSubFolderLoadingState: setSubFolderLoadingStateAssetView,
    setFolderChildList: setFolderChildListAssetView,
    keyResultsFetch: keyResultsFetchAssetView,
    keyExists: keyExistsAssetView
  } = useAssetDetailCollecion(addFolderAssetView, updateAssetStateAssetView, tempFolders, deleteFolderAssetView)


  const updateName = async (value) => {
    if (approvalId) {
      await uploadApprovalApi.update(approvalId, { name: value });

      // @ts-ignore
      let currentApprovalData = { ...currentApproval };
      currentApprovalData.name = value;

      setCurrentApproval(currentApprovalData);

      setNeedRefresh(true);
    }
  };

  const toggleSelected = (index) => {
    let approvalList = [...approvals];
    approvalList.map((item, itemIndex) => {
      if (itemIndex === index) {
        item.isSelected = !item.isSelected;
      }
    });

    setApprovals(approvalList);
  };

  const fetchApprovals = async () => {
    setIsLoading(true);
    const { data } = await uploadApprovalApi.getUploadApprovals();
    setApprovals(data);
    setIsLoading(false);
  };

  // On view approval requests
  const onView = (index, uploadType) => {
    if (uploadType === "guest") {
      setRequestInfo(approvals[index]);
      setAssets(approvals[index] ? approvals[index].assets : []);
      setShowReviewModal(true);
    } else {
      setAssets(approvals[index] ? approvals[index].assets : []);
      setMode("view");
      setApprovalId(approvals[index].id);
      setCurrentViewStatus(approvals[index]?.status);
      setCurrentApproval(approvals[index]);
      setBatchName(approvals[index].name || "");
      setApprovalIndex(index);
    }
  };

  const onCancelView = (refresh = false) => {
    setShowConfirmModal(false);
    setSubmitted(false);
    setAssets([]);
    setMode("list");
    setApprovalId(undefined);
    setCurrentViewStatus(0);
    setNeedRefresh(false);
    setBatchName("");
    setSelectedAllAssets(false);
    setTempAssets([]);
    setApprovalIndex(undefined);
    setTempCustoms([]);
    setTempCampaigns([]);
    setTempFolders([]);


    // Asset view modal custom Hook states resetting to initials
    setSelectedFolderAssetView([]);
    setShowDropdownAssetView([]);
    setSubFolderLoadingStateAssetView(new Map());
    setFolderChildListAssetView(new Map())
    setInputAssetView("")
    completeSelectedFolderAssetView.clear();
    //

    if (refresh === true || needRefresh) {
      fetchApprovals();
    }
  };

  const onViewAsset = (index) => {
    setSelectedAsset(index);
    setDetailModal(true);

    // @ts-ignore
    setTempTags(assets[index]?.asset?.tags || []);

    // @ts-ignore
    setTempCustoms(mappingCustomFieldData(inputCustomFields, assets[index]?.asset?.customs || []));

    // @ts-ignore
    setTempCampaigns(assets[index]?.asset?.campaigns || []);

    // @ts-ignore
    setTempFolders(assets[index]?.asset?.folders || []);

    const originalSelectedFolders = (assets[index]?.asset?.folders ?? [])?.map(({ id, name, parentId, ...rest }: Item) => {
      completeSelectedFolderAssetView.set(id, { name, parentId: parentId || null })
      return id
    })
    setSelectedFolderAssetView((prev) => [...prev, ...originalSelectedFolders])


    // @ts-ignore
    setTempComments(assets[index]?.asset?.comments || "");
  };

  const goNext = () => {
    if ((selectedAsset || 0) < assets.length - 1) {
      setTempTags([]);
      setTempCustoms([]);
      setTempComments("");

      const next = (selectedAsset || 0) + 1;
      // @ts-ignore
      setSelectedAsset(next);

      // @ts-ignore
      setTempTags(assets[next]?.asset?.tags || []);
      // @ts-ignore
      setTempCustoms(assets[next]?.asset?.customs || []);
      // @ts-ignore
      setTempComments(assets[next]?.asset?.comments || "");

      // @ts-ignore
      setSelectedAsset(next);
    }
  };

  const goPrev = () => {
    if ((selectedAsset || 0) > 0) {
      setTempTags([]);
      setTempCustoms([]);
      setTempComments("");

      const next = (selectedAsset || 0) - 1;
      // @ts-ignore
      setSelectedAsset(next);

      // @ts-ignore
      setTempTags(assets[next]?.asset?.tags || []);
      // @ts-ignore
      setTempCustoms(assets[next]?.asset?.customs || []);
      // @ts-ignore
      setTempComments(assets[next]?.asset?.comments || "");

      // @ts-ignore
      setSelectedAsset(next);
    }
  };

  const onSaveSingleAsset = async () => {

    if (selectedAsset !== undefined) {
      setIsLoading(true);

      // @ts-ignore
      const assetArr = [assets[selectedAsset]];
      const saveTag = async () => {
        let promises = [];

        for (const { asset } of assetArr) {
          let tagPromises = [];
          let removeTagPromises = [];

          // Find the new tags
          // @ts-ignore
          const newTags = _.differenceBy(tempTags, assets[selectedAsset]?.asset?.tags || []);
          const removeTags = _.differenceBy(assets[selectedAsset]?.asset?.tags || [], tempTags);

          for (const tag of newTags) {
            tagPromises.push(assetApi.addTag(asset.id, tag));
          }

          for (const tag of removeTags) {
            removeTagPromises.push(assetApi.removeTag(asset.id, tag.id));
          }

          await Promise.all(tagPromises);
          await Promise.all(removeTagPromises);
        }

        return await Promise.all(promises);
      };

      const saveComment = async () => {
        let promises = [];

        for (const { asset } of assetArr) {
          promises.push(
            uploadApprovalApi.addComments(asset.id, {
              comments: tempComments,
              approvalId,
            }),
          );
        }

        return await Promise.all(promises);
      };

      await saveTag();
      await saveComment();

      // Update these tag and comments to asset
      let assetArrData = [...assets];
      // @ts-ignore
      assetArrData[selectedAsset].asset.tags = tempTags;
      // @ts-ignore
      assetArrData[selectedAsset].asset.comments = tempComments;

      setIsLoading(false);

      setNeedRefresh(true);

      toastUtils.success(`Save successfully`);
    }
  };

  // Save bulk tag from right pannel
  const saveBulkTag = async () => {

    try {

      setIsLoading(true);
      let submitApi = false;
      let currentAssetTags = [...assetTags];
      let currentAssetCampaigns = [...assetCampaigns];
      let currentAssetCustomFields = [...assetCustomFields];
      // let currentAssetFolders = [...assetFolders];
      let currentAssetFolders = [...completeSelectedFolder.entries()].map(([key, value], index) => {
        return {
          id: key,
          name: value.name
        }
      });

      for (const { asset, isSelected } of assets) {
        let tagPromises = [];
        let removeTagPromises = [];

        let campaignPromises = [];
        let removeCampaignPromises = [];
        let removeFolderPromises = [];
        let folderPromises = [];

        if (isSelected) {
          submitApi = true;
          const newTags = _.differenceBy(currentAssetTags, asset?.tags || []);
          const newCampaigns = _.differenceBy(
            currentAssetCampaigns,
            asset?.campaigns || []
          );
          const newFolders = _.differenceBy(
            currentAssetFolders,
            asset?.folders || []
          );

          // Online admin can add custom fields
          if (isAdmin()) {
            for (const customField of currentAssetCustomFields) {
              // Find corresponding custom field in asset
              const assetField = asset?.customs?.filter(
                (custom) => custom.id === customField.id
              );
              const oldCustoms = (assetField && assetField[0]?.values) || [];

              const newCustoms = _.differenceBy(
                customField.values,
                oldCustoms || []
              );

              const customPromises = [];

              for (const custom of newCustoms) {
                // Old custom, dont need to create the new one
                if (custom.id) {
                  customPromises.push(assetApi.addCustomFields(asset.id, custom));
                } else {
                  // Have to insert immediately here to prevent duplicate custom created due to multi asset handling
                  const rs = await assetApi.addCustomFields(asset.id, custom);
                  // Update back to asset tags array for the next asset usage
                  currentAssetCustomFields = currentAssetCustomFields.map(
                    (assetCustom) => {
                      if (assetCustom.id === customField.id) {
                        assetCustom = assetCustom.values.map((value) => {
                          if (value.name === custom.name) {
                            value = rs;
                          }

                          return value;
                        });
                      }
                      return assetCustom;
                    }
                  );
                }
              }

              await Promise.all(customPromises);
            }
          }

          // Save bulk by admin wont override any tag, it will add extra tags
          const removeTags = []; //isAdmin() ? [] : _.differenceBy(asset?.tags || [], assetTags)

          // Save bulk by admin wont override any capaign, it will add extra campaigns
          const removeCampaigns = []; //isAdmin() ? [] : _.differenceBy(asset?.campaigns || [], assetCampaigns)

          // Save bulk by admin wont override any folders, it will add extra folders
          const removeFolders = []; //isAdmin() ? [] : _.differenceBy(asset?.campaigns || [], assetCampaigns)

          for (const tag of removeTags) {
            removeTagPromises.push(assetApi.removeTag(asset.id, tag.id));
          }

          for (const tag of newTags) {
            // Old tag, dont need to create the new one
            if (tag.id) {
              tagPromises.push(assetApi.addTag(asset.id, tag));
            } else {
              // Have to insert immediately here to prevent duplicate tag created due to multi asset handling
              const rs = await assetApi.addTag(asset.id, tag);
              // Update back to asset tags array for the next asset usage
              currentAssetTags = currentAssetTags.map((assetTag) => {
                if (assetTag.name === tag.name) {
                  assetTag = rs.data;
                }
                return assetTag;
              });
            }
          }

          // Only admin can modify campaign
          if (isAdmin()) {
            for (const campaign of removeCampaigns) {
              removeCampaignPromises.push(
                assetApi.removeCampaign(asset.id, campaign.id)
              );
            }

            for (const campaign of newCampaigns) {
              // Old campaign, dont need to create the new one
              if (campaign.id) {
                campaignPromises.push(assetApi.addCampaign(asset.id, campaign));
              } else {
                // Have to insert immediately here to prevent duplicate campaign created due to multi asset handling
                const rs = await assetApi.addCampaign(asset.id, campaign);
                // Update back to asset tags array for the next asset usage
                currentAssetCampaigns = currentAssetCampaigns.map(
                  (assetCampaign) => {
                    if (assetCampaign.name === campaign.name) {
                      assetCampaign = rs.data;
                    }
                    return assetCampaign;
                  }
                );
              }
            }
          }

          // Only admin can modify folders
          if (isAdmin()) {
            for (const folder of removeFolders) {
              removeFolderPromises.push(
                assetApi.removeFolder(asset.id, folder.id)
              );
            }

            for (const folder of newFolders) {
              // Old folder, dont need to create the new one
              if (folder.id) {
                folderPromises.push(assetApi.addFolder(asset.id, folder));
              } else {
                // Have to insert immediately here to prevent duplicate campaign created due to multi asset handling
                const rs = await assetApi.addFolder(asset.id, folder);
                // Update back to asset tags array for the next asset usage
                currentAssetFolders = currentAssetFolders.map((assetFolder) => {
                  if (assetFolder.name === folder.name) {
                    assetFolder = rs.data;
                  }
                  return assetFolder;
                });
              }
            }
          }
        }

        await Promise.all(tagPromises);
        await Promise.all(removeTagPromises);

        // Only admin can modify campaign
        if (isAdmin()) {
          await Promise.all(campaignPromises);
          await Promise.all(removeCampaignPromises);
        }

        // Only admin can modify folder
        if (isAdmin()) {
          await Promise.all(folderPromises);
          await Promise.all(removeFolderPromises);
        }
      }

      // Save tags to asset
      let assetArr = [...assets];
      assetArr.map((asset) => {
        if (asset.isSelected) {
          // Admin update does not override the tags
          if (isAdmin()) {
            const newTags = _.differenceBy(
              currentAssetTags,
              asset.asset.tags || []
            );
            asset.asset.tags = asset?.asset?.tags?.concat(newTags);

            const newCampaigns = _.differenceBy(
              currentAssetCampaigns,
              asset.asset.campaigns || []
            );
            asset.asset.campaigns = asset?.asset?.campaigns?.concat(newCampaigns);

            const newFolders = _.differenceBy(
              currentAssetFolders,
              asset.asset.folders || []
            );
            asset.asset.folders = asset?.asset?.folders?.concat(newFolders);
          } else {
            asset.asset.tags = currentAssetTags;
          }
        }
      });

      if (submitApi) {
        toastUtils.success(`Save successfully`);
      } else {
        toastUtils.error(`Please select assets`);
      }
      // Reset tags
      setTags([]);
      setNeedRefresh(true);

    } catch (err) {
      //TODO handle error
    } finally {
      setSelectedFolder([]);
      setShowDropdown([]);
      setSubFolderLoadingState(new Map());
      setFolderChildList(new Map())
      setSelectAllFolders({})
      setInput("")
      completeSelectedFolder.clear();
      setActiveDropdown("")
      setIsLoading(false);
    }
  };

  const submit = async () => {
    setIsLoading(true);
    await uploadApprovalApi.submit(approvalId, { message, name: batchName });

    setSubmitted(true);

    toastUtils.success(`Save successfully`);

    setNeedRefresh(true);

    setIsLoading(false);
  };

  const getTagsInputData = async () => {
    try {
      const tagsResponse = await tagApi.getTags();
      setInputTags(tagsResponse.data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const getCustomFieldsInputData = async () => {
    try {
      const { data } = await customFieldsApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputCustomFields(data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const getCampaignsInputData = async () => {
    try {
      const { data } = await campaignApi.getCampaigns();

      setInputCampaigns(data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  const getFoldersInputData = async () => {
    try {
      const { data } = await folderApi.getFoldersSimple();

      setInputFolders(data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  // Rename asset
  const confirmAssetRename = async (newValue) => {
    try {
      setIsLoading(true);

      // @ts-ignore
      const editedName = `${newValue}.${assets[selectedAsset]?.asset.extension}`;

      // Call API to upload asset
      // @ts-ignore
      await assetApi.updateAsset(assets[selectedAsset]?.asset.id, {
        updateData: { name: editedName },
      });

      // TODO: Update assets

      // Update asset list
      let currentAssets = [...assets];
      // @ts-ignore
      currentAssets[selectedAsset].asset.name = newValue;
      setAssets(currentAssets);

      setNeedRefresh(true);

      setIsLoading(false);

      toastUtils.success("Asset name updated");
    } catch (err) {
      // console.log(err);
      toastUtils.error("Could not update asset name");
    }
  };

  // Check if there is any asset is selected
  const hasSelectedAssets = () => {
    if (selectedAllAssets) {
      return true;
    }

    const selectedArr = assets.filter((asset) => asset.isSelected);

    return selectedArr.length > 0;
  };

  // Select all assets
  const selectAllAssets = (value = true) => {
    setSelectedAllAssets(value);
    let assetList = [...assets];
    assetList.map((asset) => {
      asset.isSelected = value;
    });

    setAssets(assetList);

    // Reset temp assets
    if (value === false) {
      setTempAssets([]);
    }
  };

  // Toggle select assets
  const toggleSelectedAsset = (id) => {
    const assetIndex = assets.findIndex((assetItem) => assetItem.asset.id === id);
    const selectedValue = !assets[assetIndex].isSelected;
    // Toggle unselect when selected all will disable selected all
    if (!selectedValue && selectedAllAssets) {
      setSelectedAllAssets(false);
    }
    setAssets(
      update(assets, {
        [assetIndex]: {
          isSelected: { $set: !assets[assetIndex].isSelected },
        },
      }),
    );
  };

  // Check if there is any approval is selected
  const hasSelectedApprovals = () => {
    if (selectedAllApprovals) {
      return true;
    }

    const selectedArr = approvals.filter((approval) => approval.isSelected);

    return selectedArr.length > 0;
  };

  // Select all approvals
  const selectAllApprovals = (value = true) => {
    setSelectedAllApprovals(value);
    let approvalList = [...approvals];
    approvalList.map((approval) => {
      approval.isSelected = value;
    });

    setApprovals(approvalList);

    // Reset temp assets
    if (value === false) {
      setTempApprovals([]);
    }
  };

  const TagWrapper = ({ status }) => {
    const getStatusName = (status) => {
      switch (status) {
        case -1:
        case "rejected": {
          return "Rejected";
        }

        case 0: {
          return "Pending";
        }

        case 1: {
          return "Pending";
        }

        case 2:
        case "approved": {
          return "Approved";
        }

        default: {
          return "Pending";
        }
      }
    };
    return (
      <div
        className={clsx(styles["tag-wrapper"], {
          [styles["green"]]: status === 2 || status === "approved",
          [styles["yellow"]]: status === 0 || status === "pending",
          [styles["red"]]: status === -1 || status === "rejected",
        })}
      >
        <span>{getStatusName(status)}</span>
      </div>
    );
  };

  const hasBothTagAndComments = (asset) => {
    return asset?.tags?.length > 0 && asset?.comments;
  };

  const hasTagOrComments = (asset) => {
    return asset?.tags?.length > 0 || asset?.comments;
  };

  const isAdmin = () => {
    return user.role.id === "admin" || user.role.id === "super_admin";
  };

  const updateAssetTagsState = (updatedTags) => {
    setIsLoading(false);

    // Update these tag and comments to asset
    let assetArrData = [...assets];
    // @ts-ignore
    assetArrData[selectedAsset].asset.tags = updatedTags;

    setAssets(assetArrData);

    setNeedRefresh(true);

    toastUtils.success("Update tag successfully");
  };

  const updateAssetState = (updatedData) => {
    setIsLoading(false);

    // @ts-ignore
    if (selectedAsset >= 0) {
      // @ts-ignore
      setAssets(update(assets, { [selectedAsset]: { asset: updatedData } }));
    }

    setActiveDropdown("");

    setNeedRefresh(true);

    toastUtils.success("Update custom fields successfully");
  };

  const approve = async (approvalId, assetIds) => {
    setIsLoading(true);
    await uploadApprovalApi.approve(approvalId, { assetIds });
    // Update status to assets list
    let assetArrData = [...assets];
    // @ts-ignore
    assetArrData.map((asset) => {
      if (assetIds.includes(asset.asset.id)) {
        asset.asset.status = 2;
      }
    });
    setAssets(assetArrData);
    setNeedRefresh(true);
    setIsLoading(false);
    setDetailModal(false);
    toastUtils.success("Approve asset successfully");
  };

  const filterUploadItems = (data) => {
    const approvalIds = data.filter((item) => item.uploadType === "approval").map((item) => item.id);
    const guestUploadIds = data
      .filter((item) => item.uploadType === "guest")
      .map((item) => ({ id: item.id, assets: item.assets }));
    return { approvalIds, guestUploadIds };
  };

  const bulkApprove = async (data) => {
    setIsLoading(true);
    const ids = filterUploadItems(data);

    const assetIds = ids["guestUploadIds"].map((item) => item.assets.map((a) => a.asset)).flat(2);

    const updateObject = {
      assetIds,
      attributes: {},
      status: "approved",
    };

    await uploadApprovalApi.bulkApprove({ approvalIds: ids.approvalIds });
    await assetApi.updateMultipleAttributes(updateObject, {});

    // Update status to approval list
    let approvalArrData = [...approvals];
    // @ts-ignore
    approvalArrData.map((approval) => {
      const approvalId = ids["approvalIds"].includes(approval.id) || ids["guestUploadIds"].includes(approval.id);
      if (approvalId && approval.uploadType === "approval") {
        approval.status = 2;
      } else if (approvalId && approval.uploadType === "guest") {
        approval.status = "Completed";
      }
    });

    setApprovals(approvalArrData);
    setIsLoading(false);
    setDetailModal(false);
    toastUtils.success("Approve asset successfully");
  };

  const reject = async (approvalId, assetIds) => {
    setIsLoading(true);

    await uploadApprovalApi.reject(approvalId, { assetIds });

    // Update status to assets list
    let assetArrData = [...assets];
    // @ts-ignore
    assetArrData.map((asset) => {
      if (assetIds.includes(asset.asset.id)) {
        asset.asset.status = -1;
      }
    });

    setAssets(assetArrData);

    setNeedRefresh(true);

    setIsLoading(false);

    setDetailModal(false);

    toastUtils.success("Reject assets successfully");
  };

  const bulkReject = async (data) => {
    setIsLoading(true);

    const ids = filterUploadItems(data);

    await uploadApprovalApi.bulkReject({ rejectIds: ids.approvalIds });

    const assetIds = ids["guestUploadIds"].map((item) => item.assets.map((a) => a.asset)).flat(2);

    const updateObject = {
      assetIds,
      attributes: {},
      status: "rejected",
    };

    await assetApi.updateMultipleAttributes(updateObject, {});

    // Update status to approval list
    let approvalArrData = [...approvals];

    // @ts-ignore
    approvalArrData.map((approval) => {
      const approvalId = ids["approvalIds"].includes(approval.id) || ids["guestUploadIds"].includes(approval.id);
      if (approvalId && approval.uploadType === "approval") {
        approval.status = -1;
      } else if (approvalId && approval.uploadType === "guest") {
        approval.status = "Rejected";
      }
    });

    setApprovals(approvalArrData);

    setIsLoading(false);

    setDetailModal(false);
    const isAdmin = () => {
      return user?.role?.id === "admin" || user?.role?.id === "super_admin";
    };

    toastUtils.success("Reject assets successfully");
  };

  const bulkDelete = async (data) => {
    //use status: 'deleted' for guest bulk delete
    setIsLoading(true);
    const ids = filterUploadItems(data);

    const assetIds = ids["guestUploadIds"].map((item) => item.assets.map((a) => a.asset)).flat(2);

    const updateObject = {
      assetIds,
      attributes: {},
      status: "deleted",
    };

    await uploadApprovalApi.bulkDelete({ deleteIds: ids["approvalIds"] });
    await assetApi.updateMultipleAttributes(updateObject, {});

    // Update status to approval list
    let approvalArrData = [...approvals];

    approvalArrData = approvalArrData.filter((approval) => {
      const approvalId = ids["approvalIds"].includes(approval.id) || ids["guestUploadIds"].includes(approval.id);
      return !approvalId;
    });

    setApprovals(approvalArrData);

    setIsLoading(false);

    setDetailModal(false);

    toastUtils.success("Delete approval successfully");
  };

  const getSelectedAssets = () => {
    return assets.filter((asset) => asset.isSelected).map((asset) => asset.asset.id);
  };

  const getSelectedApprovals = () => {
    return approvals
      .filter((approval) => approval.isSelected)
      .map((approval) => ({
        id: approval.id,
        uploadType: approval.uploadType,
        assets: approval.assets,
      }));
  };

  // On change custom fields (add/remove)
  const onChangeCustomField = (index, data) => {
    // Hide select list
    setActiveCustomField(undefined);
    //
    //
    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: data },
        },
      }),
    );
  };

  const onChangeTempCustomField = (index, data) => {
    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setTempCustoms(
      update(tempCustoms, {
        [index]: {
          values: { $set: data },
        },
      }),
    );
  };

  // On custom field select one changes
  const onChangeSelectOneCustomField = async (selected, index) => {
    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: [selected] },
        },
      }),
    );
  };

  // On temp custom field select one changes
  const onChangeSelectOneTempCustomField = async (selected, index) => {
    // Show loading
    setIsLoading(true);

    // Call API to add custom fields
    await assetApi.addCustomFields(assets[selectedAsset]?.asset.id, {
      ...selected,
    });

    // Hide select list
    setActiveCustomField(undefined);

    // Update asset custom field (local)
    setTempCustoms(
      update(tempCustoms, {
        [index]: {
          values: { $set: [selected] },
        },
      }),
    );

    // Hide loading
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApprovals();
    getTagsInputData();
    getCampaignsInputData();
    getFoldersInputData();
    getCustomFieldsInputData();
  }, []);

  useEffect(() => {
    if (approvalIndex !== undefined) {
      // @ts-ignore
      const currentData = approvals[approvalIndex] ? approvals[approvalIndex].assets : [];
      if (filter && currentData.length > 0) {
        // @ts-ignore
        switch (filter.value) {
          case -1: {
            const newAssets = [...currentData].filter(({ asset }) => asset.status === -1);
            setAssets(newAssets);
            break;
          }
          case 0: {
            const newAssets = [...currentData].filter(({ asset }) => asset.status === 0);
            setAssets(newAssets);
            break;
          }
          case 2: {
            const newAssets = [...currentData].filter(({ asset }) => asset.status === 2);
            setAssets(newAssets);
            break;
          }
        }
      } else {
        // @ts-ignore
        setAssets(currentData);
      }
    }
  }, [filter]);

  useEffect(() => {
    updateName(debouncedBatchName);
  }, [debouncedBatchName]);

  useEffect(() => {
    if (inputCustomFields.length > 0) {
      const updatedMappingCustomFieldData = mappingCustomFieldData(inputCustomFields, customs);

      setAssetCustomFields(
        update(assetCustomFields, {
          $set: updatedMappingCustomFieldData,
        }),
      );

      setCustoms(updatedMappingCustomFieldData);
    }
  }, [inputCustomFields]);

  const onChangeWidth = () => {
    let remValue = "7rem";
    if (window.innerWidth <= 900) {
      remValue = "1rem + 1px";
    }

    let el = document.getElementById("top-bar");
    let header = document.getElementById("main-header");
    let subHeader = document.getElementById("sub-header");
    if (el) {
      let style = getComputedStyle(el);

      const headerTop = document.getElementById("top-bar")?.offsetHeight || 55;
      setTop(
        `calc(${headerTop}px + ${header?.clientHeight || 0}px + ${remValue} - ${style.paddingBottom
        } - ${style.paddingTop})`
      );
    }
  };

  useEffect(() => {
    onChangeWidth();

    setTimeout(() => {
      onChangeWidth();
    }, 500);

    window.addEventListener("resize", onChangeWidth);

    return () => window.removeEventListener("resize", onChangeWidth);
  }, []);

  const handleDeleteApproval = async (data, uploadType) => {
    setIsLoading(true);
    if (uploadType === "guest") {
      const updateObject = {
        assetIds: data.assets.map((item) => item.asset),
        attributes: {},
        status: "deleted",
      };
      await assetApi.updateMultipleAttributes(updateObject, {});
    } else {
      await uploadApprovalApi.bulkDelete({ deleteIds: [data.id] });
    }

    // Update status to approval list
    let approvalArrData = [...approvals];

    approvalArrData = approvalArrData.filter((approval) => approval.id !== data.id);

    setApprovals(approvalArrData);

    setIsLoading(false);

    setDetailModal(false);

    toastUtils.success("Delete approval successfully");
  };

  return (
    <>
      <AssetSubheader
        activeFolder={""}
        getFolders={() => { }}
        mode={"assets"}
        amountSelected={selectedAssets.length}
        activeFolderData={null}
        backToFolders={() => { }}
        setRenameModalOpen={() => { }}
        activeSortFilter={{}}
        titleText={"Upload Requests"}
        showAssetAddition={false}
      />
      <div className={`row ${mode === "view" ? styles["root-row"] : ""}`} style={{ marginTop: top }}>
        <div className={styles["uploadContainer"]}>
          <main className={`${styles.container}`}>
            {mode === "view" && (
              <div className={`${styles["button-wrapper"]} m-b-25`}>
                <div className={styles["topTitle"]}>
                  <div className={styles["main-title"]}>
                    <p>
                      <Button
                        type="button"
                        text={"Upload Requests"}
                        onClick={onCancelView}
                        className={"back-button"}
                      ></Button>
                      <span>
                        <img src={Utilities.arrowNav} alt="arrow" className={styles.close} />
                      </span>
                    </p>
                    {currentApproval?.name || "Untitled"}
                  </div>
                  <div className={styles["main-subtitle"]}>
                    Submitted { } on{" "}
                    {moment(currentApproval?.createdAt).format("MMM DD, YYYY")}
                  </div>
                </div>

                <div className={styles["upload-section"]}>
                  {assets.length > 0 && (currentViewStatus === 0 || isAdmin()) && !selectedAllAssets && (
                    <Button
                      type="button"
                      text="Select All"
                      className="container secondary select-all"
                      onClick={selectAllAssets}
                    />
                  )}

                  <div className={styles["upload-request-button"]}>
                    {assets.length > 0 && (currentViewStatus === 0 || isAdmin()) && hasSelectedAssets() && (
                      <Button
                        type="button"
                        text="Deselect"
                        className="container secondary"
                        onClick={() => {
                          selectAllAssets(false);
                        }}
                      />
                    )}

                    {assets.length > 0 && currentViewStatus === 0 && (
                      <Button
                        type="button"
                        text="Submit Batch"
                        className="container primary"
                        onClick={() => {
                          if (!batchName) {
                            toastUtils.error("Please enter the batch name to submit");
                          } else {
                            setShowConfirmModal(true);
                          }
                        }}
                      />
                    )}
                    {assets.length > 0 && isAdmin() && hasSelectedAssets() && (
                      <Button
                        type="button"
                        text="Reject Selected"
                        className="container primary"
                        onClick={() => {
                          setTempAssets(getSelectedAssets());
                          setShowRejectConfirm(true);
                        }}
                      />
                    )}
                    {assets.length > 0 && isAdmin() && hasSelectedAssets() && (
                      <Button
                        type="button"
                        text="Approve Selected"
                        className="container primary"
                        onClick={() => {
                          setTempAssets(getSelectedAssets());
                          setShowApproveConfirm(true);
                        }}
                      />
                    )}

                    {mode === "view" && isAdmin() && (
                      <div className={styles["filter-wrapper"]}>
                        <Select
                          containerClass={`${styles["filter-input"]} ${styles["filter-main-box"]}`}
                          additionalClass={`${styles["filter-by-status"]} ${styles["filter-inner-box"]}`}
                          isClearable={true}
                          options={filterOptions}
                          onChange={(value) => {
                            setFilter(value);
                          }}
                          placeholder={"Filter By Status"}
                          styleType="regular"
                          value={filter}
                        />
                      </div>
                    )}

                    <Button type="button" text={"Back"} className="container secondary" onClick={onCancelView} />
                  </div>
                </div>
              </div>
            )}

            {mode === "list" && (
              <div className={styles["asset-list"]}>
                <div className={`${styles["button-wrapper"]} m-b-25`}>
                  <div
                    className={`${styles["main-title"]} ${styles["approval-pending-title"]}`}
                  >
                    <h2>Upload Requests</h2>
                  </div>
                  <div className={styles["upload-section"]}>
                    {approvals.length > 0 && !selectedAllApprovals && (
                      <Button
                        type="button"
                        text="Select All"
                        className="container secondary"
                        onClick={selectAllApprovals}
                      />
                    )}
                    <div className={styles["upload-request-button"]}>
                      {approvals.length > 0 && hasSelectedApprovals() && (
                        <Button
                          type="button"
                          text="Deselect"
                          className="container secondary"
                          onClick={() => {
                            selectAllApprovals(false);
                          }}
                        />
                      )}

                      {approvals.length > 0 && hasSelectedApprovals() && (
                        <Button
                          type="button"
                          text="Delete"
                          className="container primary"
                          onClick={() => {
                            setTempApprovals(getSelectedApprovals());
                            setShowDeleteConfirm(true);
                          }}
                        />
                      )}

                      {isAdmin() && approvals.length > 0 && isAdmin() && hasSelectedApprovals() && (
                        <Button
                          type="button"
                          text="Reject Selected"
                          className="container primary"
                          onClick={() => {
                            setTempApprovals(getSelectedApprovals());
                            setShowRejectConfirm(true);
                          }}
                        />
                      )}
                      {isAdmin() && approvals.length > 0 && isAdmin() && hasSelectedApprovals() && (
                        <Button
                          type="button"
                          text="Approve Selected"
                          className="container primary"
                          onClick={() => {
                            setTempApprovals(getSelectedApprovals());
                            setShowApproveConfirm(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`${assetGridStyles["list-wrapper"]} ${approvals.length === 0 ? "mb-32" : ""
                    }`}
                >
                  <ul className={"regular-list"}>
                    {approvals.length === 0 && (
                      <p className={`${styles["upload-approval-desc"]}`}>
                        There are no upload requests for you to reviews
                      </p>
                    )}
                    {approvals.map((approval, index) => {
                      return (
                        <li className={assetGridStyles["regular-item"]} key={approval.id || index}>
                          <ListItem
                            handleDeleteApproval={handleDeleteApproval}
                            data={approval}
                            index={index}
                            toggleSelected={() => {
                              toggleSelected(index);
                            }}
                            onView={onView}
                            isAdmin={isAdmin()}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {mode === "view" && (
              <div className={styles["asset-view-list"]}>
                <div className={assetGridStyles["list-wrapper"]}>
                  <ul
                    className={`${assetGridStyles["grid-list"]} ${assetGridStyles["regular"]} ${styles["grid-list"]}`}
                  >
                    {assets.map((assetItem, index) => {
                      if (assetItem.status !== "fail") {
                        return (
                          <li className={assetGridStyles["grid-item"]} key={assetItem.asset.id || index}>
                            <AssetThumbail
                              {...assetItem}
                              sharePath={""}
                              activeFolder={""}
                              showAssetOption={false}
                              showViewButtonOnly={true}
                              showSelectedAsset={true}
                              isShare={false}
                              type={""}
                              toggleSelected={() => {
                                toggleSelectedAsset(assetItem.asset.id);
                              }}
                              openArchiveAsset={() => { }}
                              openDeleteAsset={() => { }}
                              openMoveAsset={() => { }}
                              openCopyAsset={() => { }}
                              openShareAsset={() => { }}
                              downloadAsset={() => { }}
                              openRemoveAsset={() => { }}
                              handleVersionChange={() => { }}
                              loadMore={() => { }}
                              onView={() => {
                                onViewAsset(index);
                              }}
                              customComponent={<TagWrapper status={assetItem.asset.status} />}
                              infoWrapperClass={styles["asset-grid-info-wrapper"]}
                              textWrapperClass={
                                hasTagOrComments(assetItem.asset)
                                  ? hasBothTagAndComments(assetItem.asset)
                                    ? styles["asset-grid-text-wrapper-2-icon"]
                                    : styles["asset-grid-text-wrapper"]
                                  : "w-100"
                              }
                              customIconComponent={
                                <div className={`${styles["icon-wrapper"]} d-flex`}>
                                  {assetItem?.asset?.comments && (
                                    <IconClickable
                                      additionalClass={styles["edit-icon"]}
                                      SVGElement={Utilities.comment}
                                      onClick={() => { }}
                                    />
                                  )}
                                  {assetItem?.asset?.tags?.length > 0 && (
                                    <IconClickable
                                      additionalClass={styles["edit-icon"]}
                                      src={Utilities.greenTag}
                                      onClick={() => { }}
                                    />
                                  )}
                                </div>
                              }
                            />
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            )}
          </main>

          {mode === "view" && assets.length > 0 && (
            <div
              className={
                rightPanelOpen
                  ? `.col-30 ${styles["right-panel"]}`
                  : `.col-30 ${styles["right-panel"]} ${styles["close"]}`
              }
            >
              <div className={detailPanelStyles.container}>
                <h2 className={styles["detail-title"]}>{isAdmin() ? "Batch Details" : "Tagging"}</h2>

                {(currentViewStatus !== 0 || isAdmin()) && (
                  <div className={detailPanelStyles["field-wrapper"]}>
                    <div className={`secondary-text ${detailPanelStyles.field} ${styles["field-name"]}`}>Message</div>
                    <p>{currentApproval?.message}</p>
                  </div>
                )}

                {!isAdmin() && currentViewStatus == 0 && (
                  <div className={detailPanelStyles["first-section"]}>
                    <div className={`${detailPanelStyles["field-wrapper"]} ${styles["batchSidePanel"]}`}>
                      <div className={`secondary-text ${detailPanelStyles.field} ${styles["field-name"]}`}>
                        Batch Name
                      </div>
                      <Input
                        onChange={(e) => {
                          setBatchName(e.target.value);
                        }}
                        placeholder={"Batch Name"}
                        value={batchName}
                        styleType={"regular-height-short"}
                      />
                    </div>
                  </div>
                )}

                {(currentViewStatus === 0 || isAdmin()) && (
                  <>
                    <div className={detailPanelStyles["field-wrapper"]}>
                      <div className={styles["creatable-select-container"]}>
                        <CreatableSelect
                          title="Tags"
                          addText="Add Tags"
                          onAddClick={() => setActiveDropdown("tags")}
                          selectPlaceholder={
                            "Enter a new tag or select an existing one"
                          }
                          avilableItems={inputTags}
                          setAvailableItems={setInputTags}
                          selectedItems={assetTags}
                          setSelectedItems={setTags}
                          allowEdit={currentViewStatus === 0 || isAdmin()}
                          creatable={true}
                          onAddOperationFinished={(stateUpdate) => {
                            setActiveDropdown("");
                          }}
                          onRemoveOperationFinished={async (
                            index,
                            stateUpdate
                          ) => { }}
                          onOperationFailedSkipped={() => setActiveDropdown("")}
                          isShare={false}
                          asyncCreateFn={(newItem) => {
                            return { data: newItem };
                          }}
                          dropdownIsActive={activeDropdown === "tags"}
                          ignorePermission={true}
                        />
                      </div>
                    </div>

                    {isAdmin() && (
                      <CollectionSubcollectionListing
                        activeDropdown={activeDropdown}
                        setActiveDropdown={setActiveDropdown}
                        folders={folders}
                        selectedFolder={selectedFolder}
                        subFolderLoadingState={subFolderLoadingState}
                        folderChildList={folderChildList}
                        showDropdown={showDropdown}
                        selectAllFolders={selectAllFolders}
                        input={input}
                        setInput={setInput}
                        filteredData={filteredData}
                        getFolders={getFolders}
                        getSubFolders={getSubFolders}
                        toggleSelected={toggleSelectedFolders}
                        toggleDropdown={toggleDropdown}
                        toggleSelectAllChildList={toggleSelectAllChildList}
                        completeSelectedFolder={completeSelectedFolder}
                      />
                    )}

                    {isAdmin() && (
                      <div className={detailPanelStyles["field-wrapper"]}>
                        <div className={styles["creatable-select-container"]}>
                          <CreatableSelect
                            title="Campaigns"
                            addText="Add to Campaign"
                            onAddClick={() => setActiveDropdown("campaigns")}
                            selectPlaceholder={
                              "Enter a new campaign or select an existing one"
                            }
                            avilableItems={inputCampaigns}
                            setAvailableItems={setInputCampaigns}
                            selectedItems={assetCampaigns}
                            setSelectedItems={setCampaigns}
                            creatable={isAdmin()}
                            onAddOperationFinished={(stateUpdate) => {
                              setActiveDropdown("");
                            }}
                            onRemoveOperationFinished={async (
                              index,
                              stateUpdate
                            ) => { }}
                            onOperationFailedSkipped={() =>
                              setActiveDropdown("")
                            }
                            isShare={false}
                            asyncCreateFn={(newItem) => {
                              return { data: newItem };
                            }}
                            dropdownIsActive={activeDropdown === "campaigns"}
                            altColor="yellow"
                            ignorePermission={true}
                          />
                        </div>
                      </div>
                    )}

                    {isAdmin() &&
                      inputCustomFields.map((field, index) => {
                        if (field.type === "selectOne") {
                          return (
                            <div className={detailPanelStyles["field-wrapper"]} key={index}>
                              <div className={`secondary-text ${styles.field}`}>{field.name}</div>
                              <CustomFieldSelector
                                data={assetCustomFields[index]?.values[0]?.name}
                                options={field.values}
                                isShare={false}
                                onLabelClick={() => { }}
                                handleFieldChange={(option) => {
                                  onChangeSelectOneCustomField(option, index);
                                }}
                              />
                            </div>
                          );
                        }

                        if (field.type === "selectMultiple") {
                          return (
                            <div
                              className={detailPanelStyles["field-wrapper"]}
                              key={index}
                            >
                              <div
                                className={styles["creatable-select-container"]}
                              >
                                <CreatableSelect
                                  creatable={false}
                                  title={field.name}
                                  addText={`Add ${field.name}`}
                                  onAddClick={() => setActiveCustomField(index)}
                                  selectPlaceholder={"Select an existing one"}
                                  avilableItems={field.values}
                                  setAvailableItems={() => { }}
                                  selectedItems={
                                    assetCustomFields.filter(
                                      (assetField) => assetField.id === field.id
                                    )[0]?.values || []
                                  }
                                  setSelectedItems={(data) => {
                                    onChangeCustomField(index, data);
                                  }}
                                  onAddOperationFinished={(stateUpdate) => { }}
                                  onRemoveOperationFinished={async (
                                    index,
                                    stateUpdate,
                                    removeId
                                  ) => { }}
                                  onOperationFailedSkipped={() =>
                                    setActiveCustomField(undefined)
                                  }
                                  isShare={false}
                                  asyncCreateFn={(newItem) => {
                                    // Show loading
                                    return { data: newItem };
                                  }}
                                  dropdownIsActive={activeCustomField === index}
                                  ignorePermission={true}
                                />
                              </div>
                            </div>
                          );
                        }
                      })}

                    <Button className={` container bulk-tag`} type="button" text="Save changes" onClick={saveBulkTag} />
                  </>
                )}
              </div>
            </div>
          )}

          {mode === "view" && (
            <div className={styles.back} onClick={() => setRightPanelOpen(!rightPanelOpen)}>
              <IconClickable src={rightPanelOpen ? Utilities.closePaneReverse : Utilities.closePanelDark} />
            </div>
          )}
        </div>
      </div>

      <Base
        modalIsOpen={showDetailModal}
        closeModal={() => {
          setDetailModal(false);
        }}
        confirmText={""}
        headText={"Test"}
        closeButtonOnly={true}
        disabledConfirm={false}
        additionalClasses={["visible-block", styles["approval-detail-modal"]]}
        showCancel={false}
        confirmAction={() => { }}
        overlayAdditionalClass={styles["batch-outer"]}
      >
        <div className={`row ${styles["modal-wrapper"]}`}>
          <div className={`${styles["left-bar"]}`}>
            <div className={styles["file-name"]}>
              <span>{assets[selectedAsset]?.asset.name}</span>
              {(currentViewStatus === 0 || isAdmin()) && (
                <IconClickable
                  additionalClass={styles["edit-icon"]}
                  SVGElement={Utilities.edit}
                  onClick={() => {
                    setShowRenameModal(true);
                  }}
                />
              )}
            </div>
            <div className={styles["date"]}>
              {moment(assets[selectedAsset]?.asset?.createdAt).format("MMM DD, YYYY, hh:mm a")}
            </div>
            <div className={styles["centerImg"]}>
              {assets[selectedAsset]?.asset.type === "image" && (
                <AssetImg
                  name={assets[selectedAsset]?.asset.name}
                  assetImg={assets[selectedAsset]?.thumbailUrl}
                />
              )}
              {assets[selectedAsset]?.asset.type !== "image" &&
                assets[selectedAsset]?.asset.type !== "video" &&
                assets[selectedAsset]?.thumbailUrl &&
                (assets[selectedAsset]?.asset.extension.toLowerCase() ===
                  "pdf" ? (
                  <AssetPdf asset={assets[selectedAsset]?.asset} />
                ) : (
                  <AssetImg
                    name={assets[selectedAsset]?.asset.name}
                    assetImg={assets[selectedAsset]?.thumbailUrl}
                  />
                ))}
              {assets[selectedAsset]?.asset.type !== "image" &&
                assets[selectedAsset]?.asset.type !== "video" &&
                !assets[selectedAsset]?.thumbailUrl && (
                  <div className={styles.assetIconContainer}>
                    <AssetIcon
                      extension={assets[selectedAsset]?.asset.extension}
                    />
                  </div>
                )}
              {assets[selectedAsset]?.asset.type === "video" && (
                <video controls>
                  <source
                    src={
                      assets[selectedAsset]?.previewUrl ??
                      assets[selectedAsset]?.realUrl
                    }
                    type={
                      assets[selectedAsset]?.previewUrl
                        ? "video/mp4"
                        : `video/${assets[selectedAsset]?.asset.extension}`
                    }
                  />
                  Sorry, your browser doesn't support video playback.
                </video>
              )}
            </div>

            {(isAdmin() || currentViewStatus !== 0) && (
              <div className={`${detailPanelStyles["field-wrapper"]} ${detailPanelStyles["comments-wrapper"]}`}>
                <div className={`secondary-text ${detailPanelStyles.field} ${styles["field-name"]}`}>Comments</div>
                <p>{tempComments}</p>
              </div>
            )}
            <div className={styles["navigation-wrapper"]}>
              <span>
                {(selectedAsset || 0) + 1} of {assets.length} in Batch
              </span>
              <IconClickable
                src={Utilities.arrowPrev}
                onClick={() => {
                  goPrev();
                }}
              />
              <IconClickable
                src={Utilities.arrowNext}
                onClick={() => {
                  goNext();
                }}
              />
            </div>
          </div>
          <div className={`${styles["right-side"]}`}>
            <div className={`${detailPanelStyles.container} ${styles["right-form"]}`}>
              <h2 className={styles["detail-title"]}>Add Attributes to Selected Assets</h2>

              <div className={detailPanelStyles["field-wrapper"]}>
                <div className={styles["creatable-select-container"]}>
                  <CreatableSelect
                    title="Tags"
                    addText="Add Tags"
                    onAddClick={() => {
                      if (currentViewStatus === 0 || isAdmin()) {
                        setActiveDropdown("tags");
                      }
                    }}
                    selectPlaceholder={
                      "Enter a new tag or select an existing one"
                    }
                    avilableItems={inputTags}
                    setAvailableItems={setInputTags}
                    selectedItems={tempTags}
                    setSelectedItems={setTempTags}
                    allowEdit={currentViewStatus === 0 || isAdmin()}
                    creatable={true}
                    menuPosition={"fixed"}
                    onAddOperationFinished={(stateUpdate) => {
                      setActiveDropdown("");

                      if (isAdmin()) {
                        updateAssetTagsState(stateUpdate);
                      }
                    }}
                    onRemoveOperationFinished={async (index, stateUpdate) => {
                      if (isAdmin()) {
                        setIsLoading(true);
                        await assetApi.removeTag(
                          assets[selectedAsset]?.asset.id,
                          tempTags[index].id
                        );
                        updateAssetTagsState(stateUpdate);
                      }
                    }}
                    onOperationFailedSkipped={() => setActiveDropdown("")}
                    isShare={false}
                    asyncCreateFn={(newItem) => {
                      if (isAdmin()) {
                        // Admin can edit inline, dont need to hit save button
                        setIsLoading(true);
                        return assetApi.addTag(
                          assets[selectedAsset]?.asset.id,
                          newItem
                        );
                      } else {
                        return { data: newItem };
                      }
                    }}
                    dropdownIsActive={activeDropdown === "tags"}
                    ignorePermission={true}
                  />
                </div>
              </div>
              {
                isAdmin() && (
                  <SingleCollectionSubcollectionListing
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    folders={foldersAssetView}
                    selectedFolder={selectedFolderAssetView}
                    subFolderLoadingState={subFolderLoadingStateAssetView}
                    showDropdown={showDropdownAssetView}
                    input={inputAssetView}
                    completeSelectedFolder={completeSelectedFolderAssetView}
                    setInput={setInputAssetView}
                    filteredData={filteredDataAssetView}
                    getFolders={getFoldersAssetView}
                    getSubFolders={getSubFoldersAssetView}
                    toggleSelected={toggleSelectedAssetView}
                    toggleDropdown={toggleDropdownAssetView}
                    keyResultsFetch={keyResultsFetchAssetView}
                    keyExists={keyExistsAssetView}
                  />
                )
              }
              {
                isAdmin() && (
                  <div className={detailPanelStyles["field-wrapper"]}>
                    <div className={styles["creatable-select-container"]}>
                      <CreatableSelect
                        title="Campaigns"
                        addText="Add to Campaign"
                        onAddClick={() => setActiveDropdown("campaigns")}
                        selectPlaceholder={
                          "Enter a new campaign or select an existing one"
                        }
                        avilableItems={inputCampaigns}
                        setAvailableItems={setInputCampaigns}
                        selectedItems={tempCampaigns}
                        setSelectedItems={setTempCampaigns}
                        creatable={isAdmin()}
                        menuPosition={"fixed"}
                        onAddOperationFinished={(stateUpdate) => {
                          updateAssetState({
                            campaigns: { $set: stateUpdate },
                          });
                        }}
                        onRemoveOperationFinished={async (index, stateUpdate) => {
                          await assetApi.removeCampaign(
                            assets[selectedAsset]?.asset?.id,
                            tempCampaigns[index]?.id
                          );
                          updateAssetState({
                            campaigns: { $set: stateUpdate },
                          });
                        }}
                        onOperationFailedSkipped={() => setActiveDropdown("")}
                        isShare={false}
                        asyncCreateFn={(newItem) => {
                          if (isAdmin()) {
                            // Admin can edit inline, dont need to hit save button
                            setIsLoading(true);

                            return assetApi.addCampaign(
                              assets[selectedAsset]?.asset.id,
                              newItem
                            );
                          } else {
                            return { data: newItem };
                          }
                        }}
                        dropdownIsActive={activeDropdown === "campaigns"}
                        altColor="yellow"
                        ignorePermission={true}
                      />
                    </div>
                  </div>
                )
              }

              {
                isAdmin() &&
                inputCustomFields.map((field, index) => {
                  if (field.type === "selectOne") {
                    return (
                      <div className={detailPanelStyles["field-wrapper"]} key={index}>
                        <div className={`secondary-text ${styles.field}`}>{field.name}</div>
                        <CustomFieldSelector
                          data={tempCustoms[index]?.values[0]?.name}
                          options={field.values}
                          isShare={false}
                          onLabelClick={() => { }}
                          handleFieldChange={(option) => {
                            onChangeSelectOneTempCustomField(option, index);
                          }}
                        />
                      </div>
                    );
                  }

                  if (field.type === "selectMultiple") {
                    return (
                      <div
                        className={detailPanelStyles["field-wrapper"]}
                        key={index}
                      >
                        <div className={styles["creatable-select-container"]}>
                          <CreatableSelect
                            creatable={false}
                            title={field.name}
                            addText={`Add ${field.name}`}
                            onAddClick={() => setActiveCustomField(index)}
                            selectPlaceholder={"Select an existing one"}
                            avilableItems={field.values}
                            setAvailableItems={() => { }}
                            menuPosition={"fixed"}
                            selectedItems={
                              tempCustoms.filter(
                                (assetField) => assetField.id === field.id
                              )[0]?.values || []
                            }
                            setSelectedItems={(data) => {
                              onChangeTempCustomField(index, data);
                            }}
                            onAddOperationFinished={(stateUpdate) => {
                              setActiveDropdown("");

                              if (isAdmin()) {
                                updateAssetState({
                                  customs: {
                                    [index]: { values: { $set: stateUpdate } },
                                  },
                                });
                              }
                            }}
                            onRemoveOperationFinished={async (
                              index,
                              stateUpdate,
                              removeId
                            ) => {
                              if (isAdmin()) {
                                setIsLoading(true);
                                await assetApi.removeCustomFields(
                                  assets[selectedAsset]?.asset.id,
                                  removeId
                                );

                                updateAssetState({
                                  customs: {
                                    [index]: { values: { $set: stateUpdate } },
                                  },
                                });

                                setIsLoading(false);
                              }
                            }}
                            onOperationFailedSkipped={() =>
                              setActiveCustomField(undefined)
                            }
                            isShare={false}
                            asyncCreateFn={(newItem) => {
                              // Show loading
                              setNeedRefresh(true);
                              if (isAdmin()) {
                                // Admin can edit inline, dont need to hit save button
                                setIsLoading(true);
                                return assetApi.addCustomFields(
                                  assets[selectedAsset]?.asset.id,
                                  { ...newItem }
                                );
                              } else {
                                return { data: newItem };
                              }
                            }}
                            dropdownIsActive={activeCustomField === index}
                            ignorePermission={true}
                          />
                        </div>
                      </div>
                    );
                  }
                })
              }

              {
                !isAdmin() && currentViewStatus === 0 && (
                  <div className={detailPanelStyles["field-wrapper"]}>
                    <div
                      className={`secondary-text ${detailPanelStyles.field} ${styles["field-name"]}`}
                    >
                      Comments
                    </div>
                    <TextArea
                      type={"textarea"}
                      rows={9}
                      placeholder={"Add comments"}
                      value={tempComments}
                      onChange={(e) => {
                        setTempComments(e.target.value);
                      }}
                      styleType={"regular-short"}
                      disabled={currentViewStatus !== 0}
                      maxLength={200}
                    />
                  </div>
                )
              }

              <div className={"m-b-25"}></div>
            </div >

            {currentViewStatus === 0 && (
              <Button
                className={`${styles["add-tag-btn"]} container m-l-20 primary`}
                type="button"
                text="Save changes"
                onClick={onSaveSingleAsset}
              />
            )}

            {
              isAdmin() && (
                <div
                  className={`${styles["admin-button-wrapper"]} m-l-20 secondary`}
                >
                  <Button
                    className={`${styles["add-tag-btn"]} container reject-btn`}
                    type="button"
                    text="Reject"
                    onClick={() => {
                      setTempAssets([assets[selectedAsset]?.asset.id]);
                      setShowRejectConfirm(true);
                    }}
                  />

                  <Button
                    className={`${styles["add-tag-btn"]} container primary`}
                    type="button"
                    text="Approve"
                    onClick={() => {
                      setTempAssets([assets[selectedAsset]?.asset.id]);
                      setShowApproveConfirm(true);
                    }}
                  />
                </div>
              )
            }
          </div >
        </div >
      </Base >

      <Base
        modalIsOpen={showConfirmModal}
        closeModal={() => { }}
        confirmText={""}
        headText={""}
        disabledConfirm={false}
        additionalClasses={["visible-block"]}
        showCancel={false}
        confirmAction={() => { }}
        overlayAdditionalClass={styles["msgAdminModal"]}
      >
        <div className={styles["confirm-modal-wrapper"]}>
          {!submitted && (
            <>
              <div className={`${styles["modal-field-title"]} ${styles["titleAdmin"]}`}>Message for Admin</div>

              <TextArea
                type={"textarea"}
                rows={4}
                placeholder={"Add message"}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                styleType={"regular-short"}
                maxLength={200}
              />

              <div className={styles["modal-field-subtitle"]}>
                Are you sure you want to submit your assets for approval?
              </div>
            </>
          )}

          {submitted && <img src={Utilities.grayClose} alt={"close"} className={styles["modalClose"]} />}
          {submitted && (
            <p className={styles["modal-field-title"]}>
              Thanks for submitting your assets for approval. <br />
              The admin will be notified of your submission and will be able to review it
            </p>
          )}

          <div>
            {!submitted && (
              <>
                <Button
                  className={`${styles["keep-edit-btn"]} container secondary`}
                  type="button"
                  text="Keep editing"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setMessage("");
                  }}
                />
                <Button className={`${styles["add-tag-btn"]} primary`} type="button" text="Submit" onClick={submit} />
              </>
            )}
            {submitted && (
              <Button
                className={`${styles["add-tag-btn"]} container primary`}
                type="button"
                text="Back to Sparkfive"
                onClick={() => {
                  onCancelView(true);
                }}
              />
            )}
          </div>
        </div>
      </Base>

      <RenameModal
        closeModal={() => setShowRenameModal(false)}
        modalIsOpen={showRenameModal}
        renameConfirm={confirmAssetRename}
        type={"Asset"}
        initialValue={assets[selectedAsset]?.asset?.name?.substring(
          0,
          assets[selectedAsset]?.asset?.name.lastIndexOf("."),
        )}
      />

      <ConfirmModal
        closeModal={() => setShowApproveConfirm(false)}
        confirmAction={() => {
          if (mode === "list") {
            bulkApprove(tempApprovals);
            setShowApproveConfirm(false);
          } else {
            approve(approvalId, tempAssets);
            setShowApproveConfirm(false);
          }
        }}
        confirmText={"Approve"}
        message={"Are you sure you would like to approve this asset?"}
        modalIsOpen={showApproveConfirm}
      />

      <ConfirmModal
        closeModal={() => setShowRejectConfirm(false)}
        confirmAction={() => {
          if (mode === "list") {
            bulkReject(tempApprovals);
            setShowRejectConfirm(false);
          } else {
            reject(approvalId, tempAssets);
            setShowRejectConfirm(false);
          }
        }}
        confirmText={"Reject"}
        message={"Are you sure you would like to reject this asset?"}
        modalIsOpen={showRejectConfirm}
      />

      <ConfirmModal
        closeModal={() => setShowDeleteConfirm(false)}
        confirmAction={() => {
          bulkDelete(tempApprovals);
          setShowDeleteConfirm(false);
        }}
        confirmText={"Delete"}
        message={"Are you sure you would like to delete this batch?"}
        modalIsOpen={showDeleteConfirm}
      />

      {
        showReviewModal && (
          <GuestUploadApprovalOverlay
            handleBackButton={() => {
              fetchApprovals();
              setShowReviewModal(false);
            }}
            selectedAssets={assets}
            loadingAssets={false}
            requestInfo={requestInfo}
          />
        )
      }
    </>
  );
};

export default UploadRequest;
