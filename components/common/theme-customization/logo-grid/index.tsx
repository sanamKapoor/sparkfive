// @ts-ignore
import styles from "./index.module.css";
export default function LogoGrid({ data = [], selectedItem, onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      {data.map((item, index) => {
        return (
          <div
            className={item.asset?.id === selectedItem?.asset?.id ? styles["item-selected"] : styles.item}
            key={index}
            onClick={() => {
              onSelect(item);
            }}
          >
            <img src={item.thumbailUrl} alt={"image"} />
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  data: any[];
  selectedItem: any;
  onSelect: (item: any) => void;
}
