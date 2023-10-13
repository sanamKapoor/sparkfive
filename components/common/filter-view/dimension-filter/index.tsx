import styles from "./index.module.css";

// Components

interface DimensionsFilterProps {
  limits: {
    maxHeight: number;
    minHeight: number;
    maxWidth: number;
    minWidth: number;
  };
}

const DimensionsFilter: React.FC<DimensionsFilterProps> = ({ limits }) => {
  const { maxHeight, minHeight, maxWidth, minWidth } = limits;
  return (
    <div className={`${styles.container}`}>
      <div>
        <p>Width</p>
        <input value={minWidth} />
        <p> - </p>
        <input value={maxWidth} />
      </div>
      <div>
        <p>Height</p>
        <input value={minHeight} />
        <p> - </p>
        <input value={maxHeight} />
      </div>
    </div>
  );
};

export default DimensionsFilter;
