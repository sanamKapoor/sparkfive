import { useContext, useEffect } from "react";
import { FilterContext } from "../../../context";
import useFilters from "../../../hooks/use-filters";
import {
  CommonFilterProps,
  FilterAttributeVariants,
} from "../../../interfaces/filters";
import OptionsData from "../filter-option-popup/options-data";

interface ProductFilterProps extends CommonFilterProps {}

const ProductFilter: React.FC<ProductFilterProps> = ({
  options,
  setOptions,
}) => {
  const { activeSortFilter } = useContext(FilterContext);

  const { fetchValuesById } = useFilters([]);

  const fetchFilters = async () => {
    const newValues = await fetchValuesById(FilterAttributeVariants.PRODUCTS);
    setOptions(newValues);
  };

  useEffect(() => {
    fetchFilters();
  }, [activeSortFilter]);

  return (
    <OptionsData
      filterKey="filterProductSku"
      dataKey="sku"
      compareKey="id"
      options={options}
      setOptions={setOptions}
    />
  );
};

export default ProductFilter;
