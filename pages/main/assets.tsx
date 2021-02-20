import Head from 'next/head'
import FilterProvider from '../../context/filter-provider'
import { ASSET_ACCESS } from '../../constants/permissions'

// Components
import MainLayout from '../../components/common/layouts/main-layout'
import AssetsLibrary from '../../components/main/assets-library'

const AssetsPage = () => (
  <FilterProvider>
    <Head>
      <title>Assets</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <MainLayout requiredPermissions={[ASSET_ACCESS]}>
      <AssetsLibrary />
    </MainLayout>
  </FilterProvider>
)

export default AssetsPage
