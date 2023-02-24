import styles from './asset-subheader.module.css'
import {useContext, useState} from 'react'

// Components
import SubHeader from '../../common/layouts/sub-header'
import AssetHeaderOps from '../../common/asset/asset-header-ops'

// Context
import { UserContext} from '../../../context'

const AssetSubheader = ({
  amountSelected = 0,
  backToFolders,
  activeFolderData,
  setRenameModalOpen,
  activeSortFilter,
  mode,
  deletedAssets = false,
    titleText = "",
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
    </SubHeader>
  )
}

export default AssetSubheader
