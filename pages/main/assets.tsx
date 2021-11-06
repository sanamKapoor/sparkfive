import Head from 'next/head'
import { useContext, useEffect } from "react"
import FilterProvider from '../../context/filter-provider'
import { ASSET_ACCESS } from '../../constants/permissions'

// Components
import MainLayout from '../../components/common/layouts/main-layout'
import AssetsLibrary from '../../components/main/assets-library'
import AssetUploadProcess from "../../components/asset-upload-process"
import AssetDownloadProcess from "../../components/asset-download-process"

import { AssetContext } from '../../context'

const AssetsPage = () => {
    const { uploadingStatus, uploadingAssets, downloadingStatus } = useContext(AssetContext)

    return <FilterProvider>
        <Head>
            <title>Assets</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
            {uploadingStatus !== 'none' && uploadingAssets.length > 0 && <AssetUploadProcess />}
            {downloadingStatus !== 'none' && <AssetDownloadProcess />}
            <AssetsLibrary />
        </MainLayout>
    </FilterProvider>
}

export default AssetsPage
