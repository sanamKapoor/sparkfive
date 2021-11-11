import Head from 'next/head'

import FilterProvider from '../../../context/filter-provider'
import { ASSET_ACCESS } from '../../../constants/permissions'

// Components
import MainLayout from '../../../components/common/layouts/main-layout'

import DeletedAssetsLibrary from '../../../components/common/custom-settings/deleted-assets'

const AssetsPage = () => {

    return <FilterProvider>
        <Head>
            <title>User Settings</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <MainLayout requiredPermissions={[ASSET_ACCESS]}>
            <DeletedAssetsLibrary />
        </MainLayout>
    </FilterProvider>
}

export default AssetsPage
