import styles from './version-list.module.css'
import assetApi from '../../../server-api/asset'
import { useState, useEffect } from 'react'
import downloadUtils from '../../../utils/download'
import VersionListItem from './version-list-item'
import toastUtils from '../../../utils/toast'

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
    const { data: newOrderedAssts } = await assetApi.revertVersion({ revertAssetId: version.id, versionGroup: version.versionGroup })
    const currentAsset = newOrderedAssts[0] // TODO: activate this asset in detail view
    const versionAssets = newOrderedAssts.splice(1)
    setVersions(versionAssets)
    toastUtils.success('Version successfully reverted to current')
  }

  const downloadVersion = async (asset) => {
    const { data: { realUrl } } = await assetApi.getRealUrl(asset.id)
    downloadUtils.downloadFile(realUrl, asset.name)
  }

  const verionsMockData = [
    {
      name: 'Australia(05).gif',
      author: 'Mike Johannson',
      date: '03/10/2022',
      size: '250 KB',
      src: '',
      id: '1',
      versionNumber: 'V6'
    },
    {
      name: 'Australia(05).gif',
      author: 'Mike Johannson',
      date: '03/10/2022',
      size: '250 KB',
      src: '',
      id: '2',
      versionNumber: 'V5'
    },
    {
      name: 'Australia(05).gif',
      author: 'Mike Johannson',
      date: '03/10/2022',
      size: '250 KB',
      src: '',
      id: '3',
      versionNumber: 'V4'
    },
    {
      name: 'Australia(05).gif',
      author: 'Mike Johannson',
      date: '03/10/2022',
      size: '250 KB',
      src: '',
      id: '4',
      versionNumber: 'V3'
    },
    {
      name: 'Australia(05).gif',
      author: 'Mike Johannson',
      date: '03/10/2022',
      size: '250 KB',
      src: '',
      id: '5',
      versionNumber: 'V2'
    },
    {
      name: 'Australia(05).gif',
      author: 'Mike Johannson',
      date: '03/10/2022',
      size: '250 KB',
      src: '',
      id: '6',
      versionNumber: 'V1'
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Version History</h2>
      </div>
      <ul>
        <VersionListItem
          current
          version={verionsMockData[0]}
        />

        {verionsMockData.map((version, index) => (
          <VersionListItem
            key={version.id || index}
            version={version}
            currentAction={() => { revertToCurrent(version) }}
            downloadAction={() => { downloadVersion(version) }}
            deleteAction={() => { }}
          />
        ))}
      </ul>
    </div>
  )
}

export default VersionList