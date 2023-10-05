import { useState } from "react";
import { AppImg } from "../assets";
import { GuestUploadContext } from "../context";

export default ({ children }) => {
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState(AppImg.guestCover);

  const updateLogo = (url: string) => {
    setLogo(url);
  };

  //TODO: check and fix re-rendering issue here every time
  const loadingValue = {
    logo,
    updateLogo,
    banner,
    setBanner,
  };

  return (
    <GuestUploadContext.Provider value={loadingValue}>
      {children}
    </GuestUploadContext.Provider>
  );
};
