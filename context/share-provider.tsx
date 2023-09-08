import { useState } from "react";
import { ShareContext } from "../context";

export default ({ children }) => {
  const [folderInfo, setFolderInfo] = useState(false);
  const [activePasswordOverlay, setActivePasswordOverlay] = useState(true)

  const shareValue = {
    folderInfo,
    setFolderInfo,
    activePasswordOverlay,
    setActivePasswordOverlay
  };

  return (
    <ShareContext.Provider value={shareValue}>{children}</ShareContext.Provider>
  );
};
