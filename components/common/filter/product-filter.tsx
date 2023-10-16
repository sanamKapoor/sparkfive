//🚧 work in progress 🚧
import { Utilities } from "../../../assets";
import { IProductFilter } from "../../../interfaces/filters";
import IconClickable from "../buttons/icon-clickable";
import styles from "./product-filter.module.css";

interface ProductFilterProps {
  productFilters: IProductFilter;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ productFilters }) => {
  return (
    <div className={`${styles.container}`}>
      {productFilters.sku.map((item) => (
        <div key={item.id}  className={`${styles['outer-wrapper']}`}>
          <IconClickable src={Utilities.radioButtonNormal} />
          <span className={`${styles["select-name"]}`}>{item.sku}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductFilter;
