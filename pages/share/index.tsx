import Head from 'next/head'
import {useContext} from "react";

// Components
import ShareLayout from '../../components/common/layouts/share-layout'
import ShareMain from '../../components/share'


import { AssetContext } from '../../context'
import AssetDownloadProcess from "../../components/asset-download-process";

const SharePage = () => {
    const { downloadingStatus } = useContext(AssetContext)

    return <>
        <Head>
            <title>Assets</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ShareLayout>
            {downloadingStatus !== 'none' && <AssetDownloadProcess/>}
            <ShareMain />
        </ShareLayout>
    </>
}

export default SharePage
