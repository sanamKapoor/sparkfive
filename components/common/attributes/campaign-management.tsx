import { useEffect, useState } from "react";
import styles from "./tag-management.module.css";

// Components
import CreatableSelect from "../inputs/creatable-select";
import Select from "../inputs/select";
import Tag from "../misc/tag";
import Search from "./search-input";

// APIs
import campaignApi from "../../../server-api/attribute";
import Button from "../buttons/button";
import Input from "../inputs/input";
import ConfirmModal from "../modals/confirm-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";

// Utils
import { sorts } from "../../../config/data/attributes";
import toastUtils from "../../../utils/toast";

const CampaignManagement = () => {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [campaignList, setCampaignList] = useState([]);
  const [sort, setSort] = useState(sorts[0]);
  const [searchType, setSearchType] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(); // Id is pending to delete
  const [editMode, setEditMode] = useState(false); // Double click on tag to edit
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(); // Current edit tag
  const [currentEditValue, setCurrentEditValue] = useState(""); // Current edit value

  // Create the new tag
  const createTag = async (item) => {
    try {
      // Show loading
      setLoading(true);

      await campaignApi.createCampaigns({ campaigns: [item] });

      // Reload the list
      getCampaignList();
    } catch (err) {
      if (err.response?.status === 400)
        toastUtils.error(err.response.data.message);
      else
        toastUtils.error("Could not create campaign, please try again later.");

      // Show loading
      setLoading(false);
    }
  };

  // Get tag list
  const getCampaignList = async () => {
    // Show loading
    setLoading(true);

    let { data } = await campaignApi.getCampaigns({
      isAll: 1,
      sort: sort.value,
      searchType,
      searchKey,
    });
    setCampaignList(data);

    // Hide loading
    setLoading(false);
  };

  const deleteCampaignList = async (id) => {
    // Hide confirm modal
    setConfirmDeleteModal(false);

    // Show loading
    setLoading(true);

    // Call API to delete tag
    await campaignApi.deleteCampaigns({ campaignIds: [id] });

    // Refresh the list
    getCampaignList();
  };

  // Reset edit state
  const resetEditState = () => {
    setEditMode(false);
    setCurrentEditIndex(0);
    setCurrentEditValue("");
  };

  // Save updated changes
  const saveChanges = async (id) => {
    // Show loading
    setLoading(true);

    // Call API to delete tag
    await campaignApi.updateCampaigns({
      campaigns: [
        {
          id: id,
          name: currentEditValue,
        },
      ],
    });

    resetEditState();

    // Refresh the list
    getCampaignList();
  };

  useEffect(() => {
    getCampaignList();
  }, [sort, searchKey]);

  return (
    <div className={`${styles['main-wrapper']} ${styles['collection-management-wrapper']}`}>
      <h3>Campaigns</h3>

      <div className={styles["search-row"]}>
        <div className={styles["search-column-1"]}>
          <Search
            name={"start"}
            searchType={searchType}
            placeholder={"Starts with"}
            onSubmit={(key) => {
              setSearchType("start");
              setSearchKey(key);
            }}
            onClear={() => {
              setSearchKey("");
            }}
          />
        </div>
        <div className={styles["search-column-2"]}>
          <Search
            name={"exact"}
            searchType={searchType}
            placeholder={"Exact Match"}
            onSubmit={(key) => {
              setSearchType("exact");
              setSearchKey(key);
            }}
            onClear={() => {
              setSearchKey("");
            }}
          />
        </div>
        <div className={styles["search-column-3"]}>
          <Search
            name={"contain"}
            searchType={searchType}
            placeholder={"Contains"}
            onSubmit={(key) => {
              setSearchType("contain");
              setSearchKey(key);
            }}
            onClear={() => {
              setSearchKey("");
            }}
          />
        </div>
      </div>

      <div className={styles["operation-row"]}>
        <CreatableSelect
          altColor="blue"
          title=""
          addText="Add Campaign"
          onAddClick={() => setActiveDropdown("campaigns")}
          selectPlaceholder={"Enter a new campaign"}
          avilableItems={[]}
          setAvailableItems={() => {}}
          selectedItems={[]}
          setSelectedItems={() => {}}
          onAddOperationFinished={() => {}}
          onRemoveOperationFinished={() => {}}
          onOperationFailedSkipped={() => setActiveDropdown("")}
          isShare={false}
          asyncCreateFn={createTag}
          dropdownIsActive={activeDropdown === "campaigns"}
          selectClass={styles["campaign-select"]}
        />

        <Select
          options={sorts}
          onChange={(value) => {
            setSort(value);
          }}
          placeholder={"Select to sort"}
          styleType={`regular ${styles["sort-select"]}`}
          value={sort}
        />
      </div>

      <ul className={styles["tag-wrapper"]}>
        {campaignList.map((campaign, index) => (
          <li key={index} className={styles["tag-item"]}>
            {(editMode === false ||
              (editMode === true && currentEditIndex !== index)) && (
              <Tag
                altColor="blue"
                tag={
                  <>
                    <span className={styles["tag-item-text"]}>
                      {campaign.numberOfFiles}
                    </span>{" "}
                    <span>{campaign.name}</span>
                  </>
                }
                data={campaign}
                type="campaign"
                canRemove={true}
                editFunction={() => {
                  setCurrentEditIndex(index);
                  setCurrentEditValue(campaign.name);
                  setEditMode(true);
                }}
                removeFunction={() => {
                  setCurrentDeleteId(campaign.id);
                  setConfirmDeleteModal(true);
                }}
              />
            )}
            {editMode === true && currentEditIndex === index && (
              <div>
                <Input
                  placeholder={"Edit name"}
                  onChange={(e) => {
                    setCurrentEditValue(e.target.value);
                  }}
                  additionalClasses={styles["edit-input"]}
                  value={currentEditValue}
                  styleType={"regular-short"}
                />
                <Button
                  className={
                    "container submit exclude-min-height edit-submit-btn primary"
                  }
                  type="submit"
                  text="Save changes"
                  onClick={() => {
                    saveChanges(campaign.id);
                  }}
                />
                <Button
                  className={"container secondary edit-cancel-btn primary"}
                  type={"button"}
                  text="Cancel"
                  onClick={resetEditState}
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {loading && <SpinnerOverlay />}

      <ConfirmModal
        modalIsOpen={confirmDeleteModal}
        closeModal={() => {
          setConfirmDeleteModal(false);
        }}
        confirmAction={() => {
          deleteCampaignList(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={
          <span>
            This campaign will be deleted and removed from any file that has
            it.&nbsp; Are you sure you want to delete these?
          </span>
        }
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />
    </div>
  );
};

export default CampaignManagement;
