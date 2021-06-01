import Head from 'next/head'

import GuestUploadLayout from "../../components/common/layouts/guest-upload-layout";
import GuestUpload from "../../components/guest-upload";

const GuestUploadPage = () => (
    <>
        <Head>
            <title>Guest Upload</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <GuestUploadLayout>
            <GuestUpload />
        </GuestUploadLayout>
    </>
)

export default GuestUploadPage
