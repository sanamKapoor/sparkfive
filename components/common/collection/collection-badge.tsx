import styles from "./collection-badge.module.css";

const CollectionBadge = ({ collection }) => {
  return (
    <div className={styles.container}>
      <span>{collection}</span>
    </div>
  );
};

export default CollectionBadge;
