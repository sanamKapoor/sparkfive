//🚧 work in progress 🚧
import { Utilities } from "../../../assets";
import { IProductSku } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import styles from "./product-filter.module.css";

interface ProductFilterProps {
  options: IProductSku[];
  setOptions: (val: unknown) => void;
  setFilters: (data: unknown) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  options,
  setOptions,
  setFilters,
}) => {
  const onSelectProduct = (data: IProductSku) => {
    const index = options.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      options[index].isSelected = true;
    }
    setOptions([...options]);
    setFilters((prevState) => {
      return {
        filterProductSku:
          prevState?.filterProductSku?.length > 0
            ? [...prevState?.filterProductSku, { ...data, value: data.id }]
            : [{ ...data, value: data.id }],
      };
    });
  };

  const onDeselectProduct = (data: IProductSku) => {
    const index = options.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      options[index].isSelected = false;
    }
    setOptions([...options]);

    const newFilters = options
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.id, ...item }));
    setFilters({
      filterProductSku: newFilters,
    });
  };

  return (
    <div className={`${styles.container}`}>
      {options.map((item) => (
        <div key={item.id} className={`${styles["outer-wrapper"]}`}>
          {item.isSelected ? (
            <IconClickable
              src={Utilities.radioButtonEnabled}
              onClick={() => onDeselectProduct(item)}
            />
          ) : (
            <IconClickable
              src={Utilities.radioButtonNormal}
              onClick={() => onSelectProduct(item)}
            />
          )}
          <span className={`${styles["select-name"]}`}>{item.sku}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductFilter;
