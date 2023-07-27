import Head from "next/head";

import GuestUploadLayout from "../../components/common/layouts/guest-upload-layout";
import GuestUpload from "../../components/guest-upload";

import GuestUploadContextProvider from "../../context/share-upload-link-provider";

const GuestUploadPage = () => (
  <>
    <Head>
      <title>Guest Upload</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <GuestUploadContextProvider>
      <GuestUploadLayout>
        <GuestUpload />
      </GuestUploadLayout>
    </GuestUploadContextProvider>
  </>
);

export default GuestUploadPage;
