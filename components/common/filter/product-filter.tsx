//🚧 work in progress 🚧
import { Utilities } from "../../../assets";
import { IProductSku } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import styles from "./product-filter.module.css";

interface ProductFilterProps {
  values: IProductSku[];
  setValues: (val: unknown) => void;
  setFilters: (data: unknown) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  values,
  setValues,
  setFilters,
}) => {
  const onSelectProduct = (data: IProductSku) => {
    const index = values.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      values[index].isSelected = true;
    }
    setValues([...values]);
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
    const index = values.findIndex((value) => value.id === data.id);
    if (index !== -1) {
      values[index].isSelected = false;
    }
    setValues([...values]);

    const newFilters = values
      .filter((item) => item.isSelected)
      .map((item) => ({ value: item.id, ...item }));
    setFilters({
      filterProductSku: newFilters,
    });
  };

  return (
    <div className={`${styles.container}`}>
      {values.map((item) => (
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
