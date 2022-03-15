import styles from './version-list.module.css'
import assetApi from '../../../server-api/asset'
import { useState, useEffect } from 'react'
import downloadUtils from '../../../utils/download'


const VersionList = ({ versionGroup }) => {
  const [versions, setVersions] = useState([])

  useEffect(() => {
    if (versionGroup) {
      getVersions()
    }
  }, [versionGroup])

  const getVersions = async () => {
    try {
      const { data } = await assetApi.getVersions(versionGroup)
      setVersions(data)
    } catch (err) {
      console.log(err)
    }
  }

  const revertToCurrent = async (version) => {
    const { data: newOrderedAssts }  = await assetApi.revertVersion({revertAssetId: version.id, versionGroup: version.versionGroup})
    const currentAsset = newOrderedAssts[0] // TODO: activate this asset in detail view
    const versionAssets = newOrderedAssts.splice(1)
    setVersions(versionAssets)
  }

  const downloadVersion = async (asset) => {
    const {data: { realUrl } } = await assetApi.getRealUrl(asset.id)
    downloadUtils.downloadFile(realUrl, asset.name)
  }

  return (
    <div className={styles.container}>
      <ul>
        {versions.map((version, index) => (
          <li key={version.id || index}>
            <span>{version.name}</span>
            <a href='#' onClick={() => { revertToCurrent(version)}}>Make Current</a>
            <a href='#' onClick={() => { downloadVersion(version)}}>Download</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VersionList