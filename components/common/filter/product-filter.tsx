//🚧 work in progress 🚧
import { useState } from "react";
import productFields from "../../../resources/data/product-fields.json";
import Select from "../../common/inputs/select";
import styles from "./product-filter.module.css";

interface ProductFilterProps {
  productFilters: any; //TODO
  fieldsValue?: any;
  skuValue?: any;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  productFilters,
  fieldsValue,
  skuValue,
}) => {
  const [typeValue, setType] = useState(null);

  let valueFilters = [];
  if (typeValue?.value === "product_category")
    valueFilters = productFilters.categories;
  if (typeValue?.value === "product_vendor")
    valueFilters = productFilters.vendors;
  if (typeValue?.value === "product_retailer")
    valueFilters = productFilters.retailers;

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.field} product-select`}>
        <h5>Sku</h5>
        <Select
          options={productFilters.sku.map((field) => ({
            ...field,
            value: field.sku,
            label: field.sku,
          }))}
          value={skuValue}
          isMulti={true}
          styleType="regular"
          onChange={(selected) =>
            // setSortFilterValue("filterProductSku", selected)
            console.log("selected sku: ", selected)
          }
          placeholder="Select Value"
        />
      </div>
      <div className={`${styles.field} product-select`}>
        <h5>Field</h5>
        <Select
          options={productFields.map((field) => ({
            ...field,
            label: `Product ${field.label}`,
          }))}
          value={typeValue}
          styleType="regular"
          onChange={(selected) => setType(selected)}
          placeholder="Select Product Field"
        />
      </div>
      <div className={`${styles.field} product-select`}>
        <h5>Value</h5>
        <Select
          options={valueFilters.map((value) => ({
            ...value,
            label: value.name,
            value: value.id,
          }))}
          value={fieldsValue}
          isMulti={true}
          styleType="regular"
          onChange={(selected) =>
            // setSortFilterValue("filterProductFields", selected)
            console.log("selected value: ", selected)
          }
          placeholder="Select Value"
        />
      </div>
    </div>
  );
};

export default ProductFilter;
