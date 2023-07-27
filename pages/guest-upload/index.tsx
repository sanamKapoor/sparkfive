import GuestUploadLayout from "../../components/common/layouts/guest-upload-layout";
import GuestUpload from "../../components/guest-upload";

import AppLayout from "../../components/common/layouts/app-layout";
import GuestUploadContextProvider from "../../context/share-upload-link-provider";

const GuestUploadPage = () => (
  <>
    <GuestUploadContextProvider>
      <AppLayout title="Guest Upload">
        <GuestUploadLayout>
          <GuestUpload />
        </GuestUploadLayout>
      </AppLayout>
    </GuestUploadContextProvider>
  </>
);

export default GuestUploadPage;
