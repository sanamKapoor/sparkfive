import { useContext, useEffect, useState } from "react";
import styles from "./edit-detail.module.css";
import { Utilities } from "../../../assets";

import CreatableSelect from "../inputs/creatable-select";
import CustomFieldSelector from "../items/custom-field-selector";
import Button from "../buttons/button";
import IconClickable from "../buttons/icon-clickable";
import AssetImg from "../asset/asset-img";
import SidePanelBulk from "./side-panel-bulk";
import customFieldsApi from "../../../server-api/attribute";
import assetApi from "../../../server-api/asset";
import tagApi from "../../../server-api/tag";
import projectApi from "../../../server-api/project";
import campaignApi from "../../../server-api/campaign";
import attributeApi from "../../../server-api/attribute";
import folderApi from "../../../server-api/folder";
import update from "immutability-helper";
import { UserContext } from "../../../context";
import toastUtils from "../../../utils/toast";
import ProjectCreationModal from "../modals/project-creation-modal";
import ProductAddition from "../asset/product-addition";
import SidePanel from "../../common/asset/detail-side-panel";
import EditSidePanel from "./edit-side-panel";
import { format } from "date-fns";
import fileSize from "filesize";
import AssetPdf from "../asset/asset-pdf";
import AssetIcon from "../asset/asset-icon";

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

const EditDetail = ({
  onClose,
  currentIndex,
  setCurrentIndex,
  currentAsset: asset,
  totalLength,
  setCurrentAsset,
}) => {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [inputTags, setInputTags] = useState([]);
  const [inputFolders, setInputFolders] = useState([]);
  const [inputCustomFields, setInputCustomFields] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assetProjects, setAssetProjects] = useState([]);
  const [assetTags, setTags] = useState([]);
  const [assetCampaigns, setCampaigns] = useState([]);
  const [assetFolders, setFolders] = useState([]);
  const [originalInputs, setOriginalInputs] = useState({
    campaigns: [],
    projects: [],
    tags: [],
    customs: [],
    folders: [],
  });

  const [assetCustomFields, setAssetCustomFields] = useState(
    mappingCustomFieldData(inputCustomFields, originalInputs.customs)
  );
  const [addMode, setAddMode] = useState(true);

  const { advancedConfig } = useContext(UserContext);
  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);

  const [channel, setChannel] = useState(null);

  const [inputCampaigns, setInputCampaigns] = useState([]);
  const [assetFolder, setAssetFolder] = useState(null);

  const [inputProjects, setInputProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState("");

  const [assetProduct, setAssetProduct] = useState(null);
  const [assetProducts, setAssetProducts] = useState([]);

  const [warningMessage, setWarningMessage] = useState("");

  // Custom fields
  const [activeCustomField, setActiveCustomField] = useState<number>();

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects();
      const campaignsResponse = await campaignApi.getCampaigns();
      const folderResponse = await folderApi.getFoldersSimple();
      const tagsResponse = await tagApi.getTags();
      const customFieldsResponse = await attributeApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputProjects(projectsResponse.data);
      setInputCampaigns(campaignsResponse.data);
      setInputFolders(folderResponse.data);
      setInputTags(tagsResponse.data);
      setInputCustomFields(customFieldsResponse.data);
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  useEffect(() => {
    getInputData();
  }, []);

  const handlePrevNav = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < 1 ? totalLength : prevIndex - 1
    );
  };

  const handleNextNav = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalLength ? 1 : prevIndex + 1
    );
  };

  const getCustomFieldsInputData = async () => {
    try {
      const { data } = await customFieldsApi.getCustomFields({
        isAll: 1,
        sort: "createdAt,asc",
      });

      setInputCustomFields(data);

      return data;
    } catch (err) {
      // TODO: Maybe show error?
    }
  };
  const getInitialAttributes = async () => {
    try {
      // Get custom fields list
      await getCustomFieldsInputData();

      const {
        data: { tags, projects, campaigns, customs, folders },
      } = await assetApi.getBulkProperties({ ...[asset?.asset?.id] });

      setOriginalInputs({
        campaigns,
        projects,
        tags,
        customs,
        folders,
      });
    } catch (err) {
      // TODO: Maybe show error?
    } finally {
      setLoading(false);
    }
  };

  // On change custom fields (add/remove)
  const onChangeCustomField = (index, data) => {
    // Show loading
    // setIsLoading(true)

    // Hide select list
    // setActiveCustomField(undefined)

    // Update asset custom field (local)
    setAssetCustomFields(
      update(assetCustomFields, {
        [index]: {
          values: { $set: data },
        },
      })
    );

    // Show loading
    // setIsLoading(false)
  };

  const addProductBlock = () => {
    setAssetProducts([...assetProducts, null]);
  };

  const handleProjectChange = (selected, actionMeta) => {
    if (
      !selected ||
      assetProjects.findIndex(
        (selectedItem) => selected.label === selectedItem.name
      ) !== -1
    )
      return;
    if (actionMeta.action === "create-option") {
      setNewProjectName(selected.value);
    } else if (selected) {
      setAssetProjects(update(assetProjects, { $push: [selected] }));
    }
    setActiveDropdown("");
  };

  const customFieldAttributes = (customFields) => {
    let values = [];
    customFields.map((field) => {
      values = values.concat(field.values);
    });

    return values;
  };

  const getRemoveAttributes = ({
    campaigns,
    projects,
    tags,
    customs,
    folders,
  }) => {
    const filterFn = (chosenList) => (origItem) =>
      chosenList.findIndex((chosenItem) => chosenItem.id === origItem.id) ===
      -1;
    return {
      removeCampaigns: originalInputs.campaigns.filter(filterFn(campaigns)),
      removeProjects: originalInputs.projects.filter(filterFn(projects)),
      removeTags: originalInputs.tags.filter(filterFn(tags)),
      removeCustoms: customFieldAttributes(originalInputs.customs).filter(
        filterFn(customs)
      ),
      removeFolders: originalInputs.folders.filter(filterFn(folders)),
    };
  };

  const saveChanges = async () => {
    try {
      let filters = {};
      setWarningMessage("");
      setLoading(true);
      const mapAttributes = ({ id, name }) => ({ id, name });

      const campaigns = assetCampaigns.map(mapAttributes);
      const projects = assetProjects.map(mapAttributes);
      const tags = assetTags.map(mapAttributes);
      const customs =
        customFieldAttributes(assetCustomFields).map(mapAttributes);
      const folders = assetFolders.map(mapAttributes);
      const updateObject = {
        assetIds: asset?.asset,
        attributes: {},
      };

      if (addMode) {
        updateObject.attributes = {
          channel,
          folders,
          campaigns,
          projects,
          tags,
          customs,
          products: [],
        };

        if (assetProducts.length > 0)
          updateObject.attributes.products = assetProducts
            .map((item) => {
              if (item) {
                return { product: item, productTags: item.tags };
              } else {
                return null;
              }
            })
            .filter((item) => item !== null);
        // if (assetFolder) updateObject.attributes.folders = [{ name: assetFolder.name, id: assetFolder.id }]
      } else {
        updateObject.attributes = getRemoveAttributes({
          campaigns,
          projects,
          tags,
          customs,
          folders,
        });
      }

      updateObject.activeFolder = activeFolder;

      console.log(updateObject);

      await assetApi.updateMultipleAttributes(updateObject, filters);
      await getInitialAttributes();
      toastUtils.success("Asset edits saved");
    } catch (err) {
      console.log(err);
      toastUtils.error("An error occurred, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const updateAsset = async (inputData) => {
    try {
      // Optimistic data set
      //   setCurrentAsset({
      //     ...assetDetail,
      //     ...inputData.updateData,
      //   });
      const { data } = await assetApi.updateAsset(asset?.asset?.id, inputData);
      //   setAssetDetail(data);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.name}>{asset?.asset.fileName}</div>
        <div className={styles["image-wrapper"]}>
          {asset?.asset.type === "image" && (
            <AssetImg
              imgClass="img-preview"
              name={asset?.asset.name}
              assetImg={
                asset?.asset.extension === "tiff" ||
                asset?.asset.extension === "tif" ||
                asset?.asset.extension === "svg" ||
                asset?.asset.extension === "svg+xml" ||
                asset?.asset.extension === "heif" ||
                asset?.asset.extension === "heic" ||
                asset?.asset.extension === "cr2" ||
                asset?.asset.extension === "ai"
                  ? asset?.thumbailUrl
                  : asset?.realUrl
              }
            />
          )}
          {asset?.asset.type !== "image" &&
            asset?.asset.type !== "video" &&
            asset?.thumbailUrl &&
            (asset?.asset.extension.toLowerCase() === "pdf" ? (
              <AssetPdf asset={asset?.asset} />
            ) : (
              <AssetImg
                name={asset?.asset.name}
                assetImg={asset?.thumbailUrl}
                imgClass="img-preview"
              />
            ))}
          {asset?.asset.type !== "image" &&
            asset?.asset.type !== "video" &&
            !asset?.thumbailUrl && (
              <AssetIcon extension={asset?.asset.extension} />
            )}
          {asset?.asset.type === "video" && (
            <video controls>
              <source
                src={asset?.previewUrl ?? asset?.realUrl}
                type={
                  asset?.previewUrl
                    ? "video/mp4"
                    : `video/${asset?.asset?.extension}`
                }
              />
              Sorry, your browser doesn't support video playback.
            </video>
          )}
        </div>
        <div className={styles.arrows}>
          <span>
            {(currentIndex % totalLength) + 1} of {totalLength}
          </span>
          <div>
            <span className={styles["arrow-prev"]}>
              <IconClickable
                src={Utilities.arrowPrev}
                onClick={handlePrevNav}
              />
            </span>
            <span className={styles["arrow-next"]}>
              <IconClickable
                src={Utilities.arrowNext}
                onClick={handleNextNav}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.side}>
        <div className={styles.editClose}>
          <IconClickable src={Utilities.bigblueClose} onClick={onClose} />
        </div>
        {/* <h3>Add Attributes to Selected Assets</h3> */}
        {/* <div className={styles["first-section"]}>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Last Updated</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset?.updatedAt ? format(new Date(asset?.asset?.updatedAt), "MM/dd/yyyy") : ''}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Uploaded</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {format(new Date(asset?.asset?.createdAt), "MM/dd/yyyy")}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Extension</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.extension?.toUpperCase()}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Dimensions</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset?.dimensionWidth &&
                asset?.asset?.dimensionHeight &&
                `${asset?.asset?.dimensionWidth} x ${asset?.asset?.dimensionHeight}`}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Size</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {fileSize(asset?.asset.size)}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Resolution</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset?.dpi === 0 ? '' : asset?.asset?.dpi + ''}
            </div>
          </div>
        </div> */}
        <div className={styles["second-section"]}>
          <EditSidePanel
            asset={asset?.asset}
            updateAsset={updateAsset}
            setAssetDetail={(a) => setCurrentAsset({ ...asset, a })}
            isShare={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditDetail;
