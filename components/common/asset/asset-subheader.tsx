import styles from './asset-subheader.module.css'
import {useContext, useState} from 'react'

// Components
import SubHeader from '../../common/layouts/sub-header'
import AssetHeaderOps from '../../common/asset/asset-header-ops'
import AssetAddition from '../../common/asset/asset-addition'

// Context
import { UserContext} from '../../../context'

import { ASSET_UPLOAD_NO_APPROVAL, ASSET_UPLOAD_APPROVAL } from '../../../constants/permissions'

const AssetSubheader = ({
  amountSelected = 0,
  backToFolders,
  activeFolderData,
  activeFolder,
  setRenameModalOpen,
  getFolders,
  activeSortFilter,
  mode,
  deletedAssets = false,
    titleText = "",
    showAssetAddition = true,
}) => {

    const {  hasPermission } = useContext(UserContext)


  return (
    <SubHeader pageTitle={activeFolderData ? activeFolderData.name : (titleText ||'Asset Library')} additionalClass={styles['asset-subheader']}
      editable={activeFolderData} onAltEditionClick={() => setRenameModalOpen(true)}
      PreComponent={activeFolderData ? () => (
        <div className={styles['additional-folder-wrapper']} onClick={backToFolders}>
          <div className={styles.back}>
            {'<'}
          </div>
          <h4>Collection</h4>
        </div>
      ) : null}
    >
      <div className={styles.padding}>
      </div>
        {amountSelected > 0  && <AssetHeaderOps isUnarchive={activeSortFilter.mainFilter === 'archived'} isFolder={mode === 'folders'} iconColor='White' deletedAssets={deletedAssets}/>}
        {(amountSelected === 0 || mode === 'folders') && showAssetAddition && hasPermission([ASSET_UPLOAD_NO_APPROVAL, ASSET_UPLOAD_APPROVAL]) && <AssetAddition activeFolder={activeFolder} getFolders={getFolders} />}
    </SubHeader>
  )
}

export default AssetSubheader
