import { useEffect, useState } from "react";
import styles from "./tag-management.module.css";

// Components
import CreatableSelect from "../inputs/creatable-select";
import Select from "../inputs/select";
import Tag from "../misc/tag";
import Search from "./search-input";

// APIs
import productApi from "../../../server-api/attribute";
import Button from "../buttons/button";
import Input from "../inputs/input";
import ConfirmModal from "../modals/confirm-modal";
import SpinnerOverlay from "../spinners/spinner-overlay";

// Utils
import { productSorts } from "../../../config/data/attributes";
import toastUtils from "../../../utils/toast";

const ProductManagement = () => {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [productList, setProductList] = useState([]);
  const [sort, setSort] = useState(productSorts[0]);
  const [searchType, setSearchType] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState(); // Id is pending to delete
  const [editMode, setEditMode] = useState(false); // Double click on tag to edit
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(); // Current edit tag
  const [currentEditValue, setCurrentEditValue] = useState(""); // Current edit value

  // Create the new tag
  const createProduct = async (item) => {
    try {
      // Show loading
      item.sku = item.name;
      delete item.name;
      setLoading(true);
      await productApi.createProducts({ products: [item] });

      // Reload the list
      getProductList();
    } catch (err) {
      if (err.response?.status === 400)
        toastUtils.error(err.response.data.message);
      else toastUtils.error("Could not create folder, please try again later.");

      // Show loading
      setLoading(false);
    }
  };

  // Get folder list
  const getProductList = async () => {
    // Show loading
    setLoading(true);

    let { data } = await productApi.getProducts({
      isAll: 1,
      sort: sort.value,
      searchType,
      searchKey,
    });
    setProductList(data);

    // Hide loading
    setLoading(false);
  };

  const deleteProductList = async (id) => {
    // Hide confirm modal
    setConfirmDeleteModal(false);

    // Show loading
    setLoading(true);
    // Call API to delete folder
    await productApi.deletProducts({ productIds: [id] });

    // Refresh the list
    getProductList();
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
    await productApi.updateProducts({
      products: [
        {
          id: id,
          sku: currentEditValue,
        },
      ],
    });

    resetEditState();

    // Refresh the list
    getProductList();
  };

  useEffect(() => {
    getProductList();
  }, [sort, searchKey]);

  return (
    <div className={`${styles['main-wrapper']} ${styles['collection-management-wrapper']}`}>
      <h3>Products</h3>
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
          addText="Add Product"
          onAddClick={() => setActiveDropdown("products")}
          selectPlaceholder={"Enter a product sku"}
          avilableItems={[]}
          setAvailableItems={() => {}}
          selectedItems={[]}
          setSelectedItems={() => {}}
          onAddOperationFinished={() => {}}
          onRemoveOperationFinished={() => {}}
          onOperationFailedSkipped={() => setActiveDropdown("")}
          isShare={false}
          asyncCreateFn={createProduct}
          dropdownIsActive={activeDropdown === "products"}
          selectClass={styles["campaign-select"]}
        />

        <Select
          options={productSorts}
          onChange={(value) => {
            setSort(value);
          }}
          placeholder={"Select to sort"}
          styleType={`regular ${styles["sort-select"]}`}
          value={sort}
        />
      </div>
      <ul className={styles["tag-wrapper"]}>
        {productList.map((folder, index) => (
          <li key={index} className={styles["tag-item"]}>
            {(editMode === false ||
              (editMode === true && currentEditIndex !== index)) && (
              <Tag
                altColor="blue"
                tag={
                  <>
                    <span className={styles["tag-item-text"]}>
                      {folder.numberOfFiles}
                    </span>{" "}
                    <span>{folder.sku}</span>
                  </>
                }
                data={folder}
                type="product"
                canRemove={true}
                editFunction={() => {
                  setCurrentEditIndex(index);
                  setCurrentEditValue(folder.sku);
                  setEditMode(true);
                }}
                removeFunction={() => {
                  setCurrentDeleteId(folder.id);
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
                  type={"submit"}
                  text="Save changes"
                  onClick={() => {
                    saveChanges(folder.id);
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
          deleteProductList(currentDeleteId);
        }}
        confirmText={"Delete"}
        message={
          <span>
            This folder will be deleted and removed from any file that has
            it.&nbsp; Are you sure you want to delete these?
          </span>
        }
        closeButtonClass={styles["close-modal-btn"]}
        textContentClass={styles["confirm-modal-text"]}
      />
    </div>
  );
};

export default ProductManagement;
