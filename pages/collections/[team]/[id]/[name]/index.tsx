import Head from 'next/head'
import {useContext} from "react";
import FilterProvider from '../../../../../context/filter-provider'

// Components
import ShareFolderLayout from '../../../../../components/common/layouts/share-folder-layout'
import ShareFolderMain from '../../../../../components/share-folder'
import AssetDownloadProcess from "../../../../../components/asset-download-process";

import { AssetContext } from '../../../../../context'


const ShareFolder = () => {
    const { downloadingStatus } = useContext(AssetContext)


  return <FilterProvider isPublic={true}>
    <Head>
      <title>Shared Collection</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ShareFolderLayout>
        {downloadingStatus !== 'none' && <AssetDownloadProcess/>}
      <ShareFolderMain />
    </ShareFolderLayout>
  </FilterProvider>
}

export default ShareFolder
