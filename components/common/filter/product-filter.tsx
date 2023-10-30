import { CommonFilterProps } from "../../../interfaces/filters";
import OptionsData from "../filter-option-popup/options-data";

interface ProductFilterProps extends CommonFilterProps {}

const ProductFilter: React.FC<ProductFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  return (
    <OptionsData
      filterKey="filterProductSku"
      dataKey="sku"
      compareKey="id"
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
    />
  );
};

export default ProductFilter;
