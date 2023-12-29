import GuestUploadLayout from "../../components/common/layouts/guest-upload-layout";
import GuestUpload from "../../components/guest-upload";

import { useEffect, useState } from "react";
import { AppImg, GeneralImg } from "../../assets";
import AppLayout from "../../components/common/layouts/app-layout";
import GuestUploadContextProvider from "../../context/share-upload-link-provider";
import { pages } from "../../constants/analytics";
import usePageInfo from "../../hooks/usePageInfo";
import analyticsApi from "../../server-api/analytics";


const GuestUploadPage = () => {
  const [logo, setLogo] = useState<string>(GeneralImg.logo);
  const [banner, setBanner] = useState<string>(AppImg.guestCover);

  const data = usePageInfo();

  useEffect(() => {
    analyticsApi.capturePageVisit({ name: pages.GUEST_UPLOAD, ...data })
  }, []);

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
