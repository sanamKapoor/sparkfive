import { useEffect, useState } from "react";
import { Utilities } from "../../../assets";
import styles from "./edit-detail.module.css";

import assetApi from "../../../server-api/asset";
import {
  default as attributeApi,
  default as customFieldsApi,
} from "../../../server-api/attribute";
import campaignApi from "../../../server-api/campaign";
import folderApi from "../../../server-api/folder";
import projectApi from "../../../server-api/project";
import tagApi from "../../../server-api/tag";
import AssetImg from "../asset/asset-img";
import IconClickable from "../buttons/icon-clickable";
import EditSidePanel from "./edit-side-panel";

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

  const [channel, setChannel] = useState(null);

  const [inputCampaigns, setInputCampaigns] = useState([]);

  const [inputProjects, setInputProjects] = useState([]);

  const [newProjectName, setNewProjectName] = useState("");

  const [assetProducts, setAssetProducts] = useState([]);

  const [warningMessage, setWarningMessage] = useState("");

  // Custom fields

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

  const updateAsset = async (inputData) => {
    try {
      const { data } = await assetApi.updateAsset(asset?.asset?.id, inputData);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.name}>{asset?.asset.fileName}</div>
        <div className={styles["image-wrapper"]}>
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
        <h3>Add Attributes to Selected Assets</h3>
        <div className={styles["first-section"]}>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Last Updated</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.updatedAt}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Uploaded</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.createdAt}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Extension</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.extension}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Dimensions</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.Dimensions}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Size</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.size}
            </div>
          </div>
          <div className={styles["field-wrapper"]}>
            <div className={`secondary-text ${styles.field}`}>Resolution</div>
            <div className={`normal-text ${styles["meta-text"]}`}>
              {asset?.asset.dpi}
            </div>
          </div>
        </div>
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
