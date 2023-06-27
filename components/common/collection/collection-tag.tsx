import styles from "./collection-tag.module.css";

const CollectionTag = ({ collection }) => {
    return (
        <div className={styles.container}>
            <span>{collection}</span>
        </div>
    )
}

export default CollectionTag