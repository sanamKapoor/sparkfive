import GuestUploadLayout from "../../components/common/layouts/guest-upload-layout";
import GuestUpload from "../../components/guest-upload";

import { useState } from "react";
import { AppImg, GeneralImg } from "../../assets";
import AppLayout from "../../components/common/layouts/app-layout";
import GuestUploadContextProvider from "../../context/share-upload-link-provider";

const GuestUploadPage = () => {
  const [logo, setLogo] = useState<string>(GeneralImg.logo);
  const [banner, setBanner] = useState<string>(AppImg.guestCover);
  return (
    <>
      <GuestUploadContextProvider>
        <AppLayout title="Guest Upload">
          <GuestUploadLayout logo={logo} banner={banner}>
            <GuestUpload
              logo={logo}
              setLogo={setLogo}
              banner={banner}
              setBanner={setBanner}
            />
          </GuestUploadLayout>
        </AppLayout>
      </GuestUploadContextProvider>
    </>
  );
};

export default GuestUploadPage;
