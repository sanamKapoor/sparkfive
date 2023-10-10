import { Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import Divider from "../filter-option-popup/divider";
import OptionDataItem from "../filter-option-popup/option-data-item";
import styles from "../filter-option-popup/options-data.module.css";

interface ResolutionFilterProps {
  data: any; //TODO
}

const ResolutionFilter: React.FC<ResolutionFilterProps> = ({ data }) => {
  return (
    <>
      <div>
        <IconClickable src={Utilities.radioButtonNormal} />
        <span>All High-Res (above 250 DPI)</span>
      </div>
      <div className={styles["outer-wrapper"]}>
        {data.map((item) => (
          <div className={styles["grid-item"]} key={item.id}>
            <OptionDataItem name={item.dpi} count={item.count} />
          </div>
        ))}
      </div>
      <Divider />
    </>
  );
};

export default ResolutionFilter;
