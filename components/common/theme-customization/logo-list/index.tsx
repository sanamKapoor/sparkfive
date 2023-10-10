import styles from "./index.module.css";
export default function LogoList({ data, onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className={styles.item}
            onClick={() => {
              onSelect(item);
            }}
          >
            <img className={styles.logo} src={item.url} alt={"logo"} />
            <div className={styles.name}>{item.name}</div>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  data: any;
  onSelect: (value: any) => void;
}
