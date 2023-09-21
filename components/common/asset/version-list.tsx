import styles from './version-list.module.css'
import downloadUtils from '../../../utils/download'
import VersionListItem from './version-list-item'

const VersionList = ({
  versions,
  currentAsset,
  triggerUserEvent
}) => {

  const downloadVersion = async (asset) => {
    downloadUtils.downloadFile(asset.realUrl, asset.name)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Version History</h2>
      </div>
      <ul>
        <VersionListItem current key={currentAsset.id} asset={currentAsset} />
        {versions
          .sort((a, b) => a.displayVersion - b.displayVersion)
          .map((version, index) => (
            <VersionListItem
              key={version.id || index}
              asset={version}
              currentAction={() => {
                triggerUserEvent("revert", version);
              }}
              downloadAction={() => {
                downloadVersion(version);
              }}
              deleteAction={() => {
                triggerUserEvent("delete", version);
              }}
            />
          ))}
      </ul>
    </div>
  );
}

export default VersionList
