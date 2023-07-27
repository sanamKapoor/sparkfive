import { useState } from "react";
import { GuestUploadContext } from "../context";

export default ({ children }) => {
  const [logo, setLogo] = useState("");

  const updateLogo = (url: string) => {
    setLogo(url);
  };

  const loadingValue = {
    logo,
    updateLogo,
  };

  return (
    <GuestUploadContext.Provider value={loadingValue}>
      {children}
    </GuestUploadContext.Provider>
  );
};
