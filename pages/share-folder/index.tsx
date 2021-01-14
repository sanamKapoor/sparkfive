import Head from 'next/head'

// Components
import ShareFolderLayout from '../../components/common/layouts/share-folder-layout'
import ShareFolderMain from '../../components/share-folder'


const ShareFolder = () => (
  <>
    <Head>
      <title>Share Folder</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ShareFolderLayout>
      <ShareFolderMain />
    </ShareFolderLayout>
  </>
)

export default ShareFolder
