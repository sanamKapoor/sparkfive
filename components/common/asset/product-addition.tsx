import update from "immutability-helper";
import { useContext, useEffect, useState } from "react";
import ReactSelect from "react-select";
import ReactCreatableSelect from "react-select/creatable";
import { Utilities } from "../../../assets";
import { FilterContext } from "../../../context";
import assetApi from "../../../server-api/asset";
import productApi from "../../../server-api/product";
import tagApi from "../../../server-api/tag";
import styles from "./product-addition.module.css";

import productFields from "../../../resources/data/product-fields.json";

// Components
import IconClickable from "../buttons/icon-clickable";
import Tag from "../misc/tag";

const ProductAddition = ({
  FieldWrapper,
  isShare,
  activeDropdown,
  setActiveDropdown,
  assetId,
  updateAssetState = () => {},
  product,
  isBulkEdit = false,
  noTitle = false,
  onAdd = (product) => {},
  onDelete = () => {},
  setAssetProduct = (prod) => {},
  skuActiveDropdownValue = "sku",
  productFieldActiveDropdownValue = "product_field",
  productVendorActiveDropdownValue = "product_vendor",
  productCategoryActiveDropdownValue = "product_category",
  productRetailerActiveDropdownValue = "product_retailer",
}) => {
  const [inputProducts, setInputProducts] = useState([]);
  const [inputCategories, setInputCategories] = useState([]);
  const [inputVendors, setInputVendors] = useState([]);
  const [inputRetailers, setInputRetailers] = useState([]);
  const [valueLabel, setValueLabel] = useState("");

  const { loadProductFields } = useContext(FilterContext);

  useEffect(() => {
    // Get input data
    if (!isShare) {
      getData(productApi.getProducts(), setInputProducts);
      getData(
        tagApi.getTags({ type: productCategoryActiveDropdownValue }),
        setInputCategories
      );
      getData(
        tagApi.getTags({ type: productVendorActiveDropdownValue }),
        setInputVendors
      );
      getData(
        tagApi.getTags({ type: productRetailerActiveDropdownValue }),
        setInputRetailers
      );
    }
  }, []);

  const getData = async (asyncDataFn, setFn) => {
    try {
      const { data } = await asyncDataFn;
      setFn(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onValueChange = (selected, actionMeta, createFn, changeFn) => {
    if (actionMeta.action === "create-option") {
      createFn(selected.value);
    } else {
      changeFn(selected);
    }
  };

  const addProduct = async (productSku) => {
    if (isBulkEdit) {
      setAssetProduct({ sku: productSku, tags: [] });
      setActiveDropdown("");
    } else {
      try {
        const sku = productSku;
        const { data: newProduct } = await assetApi.addProduct(assetId, {
          sku,
        });
        onAdd(newProduct);
        changeProductState(newProduct);
        setInputProducts(update(inputProducts, { $push: [newProduct] }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deleteProduct = async () => {
    if (isBulkEdit) {
      setAssetProduct(null);
    } else {
      try {
        await assetApi.updateAsset(assetId, {
          updateData: { productId: null },
        });
        onDelete();
        changeProductState(null);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const changeProduct = async (product) => {
    if (isBulkEdit) {
      setAssetProduct(product);
      setActiveDropdown("");
    } else {
      try {
        await assetApi.addProduct(assetId, { id: product.id });
        onAdd(product);
        changeProductState(product);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const changeProductState = (product) => {
    let stateUpdate;
    if (!product) {
      stateUpdate = {
        productId: { $set: undefined },
        product: { $set: undefined },
      };
    } else {
      stateUpdate = {
        productId: { $set: product.id },
        product: { $set: product },
      };
    }
    updateAssetState(stateUpdate);
  };

  const addProductTag = async (name) => {
    if (isBulkEdit) {
      setAssetProduct(
        update(product, { tags: { $push: [{ name, type: activeDropdown }] } })
      );
    } else {
      try {
        const { data: newTag } = await productApi.addTag(product.id, {
          name,
          type: activeDropdown,
        });
        changeValueState(newTag, true);
        loadProductFields();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const changeProductTag = async (selected) => {
    if (isBulkEdit) {
      if (
        !selected ||
        product.tags.findIndex(
          (selectedItem) => selected.label === selectedItem.name
        ) !== -1
      )
        return;
      setAssetProduct(update(product, { tags: { $push: [selected] } }));
    } else {
      try {
        // Skip if already on product
        if (product.tags.some((tag) => tag.id === selected.id)) return;
        await productApi.addTag(product.id, { id: selected.id });
        changeValueState(selected);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const removeProductTag = async (id, name) => {
    if (isBulkEdit) {
      const index = product.tags.findIndex((tag) => tag.name === name);
      setAssetProduct(update(product, { tags: { $splice: [[index, 1]] } }));
    } else {
      try {
        // Skip if already on product
        await productApi.deleteTag(product.id, id);
        const deleteTagIndex = product.tags.findIndex((tag) => tag.id === id);
        updateAssetState({
          product: {
            tags: { $splice: [[deleteTagIndex, 1]] },
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const changeValueState = (tag, isNew = false) => {
    let stateUpdateObj = {
      product: {
        tags: { $push: [tag] },
      },
    };
    if (activeDropdown === productVendorActiveDropdownValue) {
      if (isNew) setInputVendors(update(inputVendors, { $push: [tag] }));
    }
    if (activeDropdown === productCategoryActiveDropdownValue) {
      if (isNew) setInputCategories(update(inputCategories, { $push: [tag] }));
    }
    if (activeDropdown === productRetailerActiveDropdownValue) {
      if (isNew) setInputRetailers(update(inputRetailers, { $push: [tag] }));
    }
    updateAssetState(stateUpdateObj);
  };

  const onFieldChange = (selected) => {
    setValueLabel(selected.label);
    setActiveDropdown(selected.value);
  };

  const ProductProperty = ({ label, value, isMulti = false }) => (
    <div className={styles["field-item-container"]}>
      <div>{label}</div>
      {isMulti ? (
        <ProductValueMulti valueList={value} />
      ) : (
        <div>
          <span>{value.name}</span>
          <span
            className={styles.remove}
            onClick={() => removeProductTag(value.id, value.name)}
          >
            x
          </span>
        </div>
      )}
    </div>
  );

  const ProductValueMulti = ({ valueList }) => (
    <ul className={`tags-list ${styles["multi-list"]}`}>
      {valueList.map((value) => (
        <li key={value.id} className={styles["multi-item"]}>
          <Tag
            data={value}
            altColor="orange"
            tag={value.name}
            canRemove={!isShare}
            removeFunction={() => removeProductTag(value.id, value.name)}
          />
        </li>
      ))}
    </ul>
  );

  let valueInput = undefined;
  if (activeDropdown === productCategoryActiveDropdownValue)
    valueInput = inputCategories;
  if (activeDropdown === productVendorActiveDropdownValue)
    valueInput = inputVendors;
  if (activeDropdown === productRetailerActiveDropdownValue)
    valueInput = inputRetailers;

  const categories = product?.tags?.filter(
    ({ type }) => type === productCategoryActiveDropdownValue
  );
  const vendors = product?.tags?.filter(
    ({ type }) => type === productVendorActiveDropdownValue
  );
  const retailers = product?.tags?.filter(
    ({ type }) => type === productRetailerActiveDropdownValue
  );

  // Filter out fields if they are already present on the product
  const filteredFields = productFields.filter(({ value }) => {
    if (value === productCategoryActiveDropdownValue && categories?.length > 0)
      return false;
    if (value === productVendorActiveDropdownValue && vendors?.length > 0)
      return false;

    return true;
  });

  const colourStyles = {
    option: (styles, { isFocused }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "#FAF8F5" : null,
        padding: "10px",
      };
    },
  };

  return (
    <FieldWrapper>
      {noTitle === false && (
        <div className={`secondary-text ${styles.field}`}>Product</div>
      )}
      <div className={`normal-text ${styles["sku-container"]}`}>
        <p className={styles["sku-name"]}>
          {product && product.sku && (
            <span className={styles.label}>{product.sku}</span>
          )}
          {product && product.sku && !isShare && (
            <span className={styles.remove} onClick={deleteProduct}>
              x
            </span>
          )}
        </p>
        {!isShare && (
          <>
            {activeDropdown === skuActiveDropdownValue ? (
              <div className={`tag-select ${styles["select-wrapper"]}`}>
                <ReactCreatableSelect
                  options={inputProducts.map((product) => ({
                    ...product,
                    label: product.sku,
                    value: product.id,
                  }))}
                  placeholder={"Enter new SKU or select an existing one"}
                  onChange={(selected, actionMeta) =>
                    onValueChange(
                      selected,
                      actionMeta,
                      addProduct,
                      changeProduct
                    )
                  }
                  styles={colourStyles}
                  menuPlacement={"top"}
                  isClearable={true}
                />
              </div>
            ) : (
              <>
                {!product && (
                  <div
                    className={`add ${styles["select-add"]}`}
                    onClick={() => setActiveDropdown("sku")}
                  >
                    <IconClickable src={Utilities.add} />
                    <span>Add SKU</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {product && (
        <div className={`normal-text ${styles["field-container"]}`}>
          {categories?.length > 0 && (
            <ProductProperty
              label={"Category"}
              value={categories}
              isMulti={true}
            />
          )}
          {vendors?.length > 0 && (
            <ProductProperty label={"Vendor"} value={vendors} isMulti={true} />
          )}
          {retailers?.length > 0 && (
            <ProductProperty
              label={"Retailer"}
              value={retailers}
              isMulti={true}
            />
          )}

          {!isShare && (
            <>
              {activeDropdown === productFieldActiveDropdownValue ? (
                <div className={`tag-select ${styles["select-wrapper"]}`}>
                  <ReactSelect
                    options={filteredFields}
                    placeholder={"Select Field"}
                    onChange={onFieldChange}
                    styles={colourStyles}
                    menuPlacement={"top"}
                    isClearable={true}
                  />
                </div>
              ) : (
                <div
                  className={`add ${styles["select-add"]}`}
                  onClick={() => setActiveDropdown("product_field")}
                >
                  <IconClickable src={Utilities.add} />
                  <span>Add Field</span>
                </div>
              )}
              {valueInput && (
                <div className={`tag-select ${styles["select-wrapper"]}`}>
                  {valueLabel}
                  <ReactCreatableSelect
                    options={valueInput.map((tag) => ({
                      ...tag,
                      label: tag.name,
                      value: tag.id,
                    }))}
                    placeholder={"Enter new value or select an existing one"}
                    onChange={(selected, actionMeta) =>
                      onValueChange(
                        selected,
                        actionMeta,
                        addProductTag,
                        changeProductTag
                      )
                    }
                    styles={colourStyles}
                    menuPlacement={"top"}
                    isClearable={true}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </FieldWrapper>
  );
};

export default ProductAddition;
