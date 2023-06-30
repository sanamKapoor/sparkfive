import styles from './asset-subheader.module.css'
import {useContext, useState} from 'react'

// Components
import SubHeader from '../../common/layouts/sub-header'
import AssetHeaderOps from '../../common/asset/asset-header-ops'

// Context
import { UserContext} from '../../../context'
import React from 'react'

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



  return (
    <>
        {amountSelected > 0  && <AssetHeaderOps isUnarchive={ activeSortFilter.mainFilter === 'archived'} isFolder={mode === 'folders'} iconColor='White' deletedAssets={deletedAssets}/>}
    </>
  )
}

export default AssetSubheader
