import Head from 'next/head'
import FilterProvider from '../../../../../context/filter-provider'

// Components
import ShareFolderLayout from '../../../../../components/common/layouts/share-folder-layout'
import ShareFolderMain from '../../../../../components/share-folder'


const ShareFolder = () => (
  <FilterProvider isPublic={true}>
    <Head>
      <title>Shared Collection</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ShareFolderLayout>
      <ShareFolderMain />
    </ShareFolderLayout>
  </FilterProvider>
)

export default ShareFolder
