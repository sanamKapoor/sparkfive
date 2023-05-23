import styles from './no-permission-notice.module.css'

const NoPermissionNotice = ({ noPaddingLeft = false}) => (
  <p className={`${noPaddingLeft ? styles["notice-no-left-padding"] : styles.notice}`}>You don't have permission to access this resource</p>
)

export default NoPermissionNotice
