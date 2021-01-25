import { useState } from 'react'
import { ShareContext } from '../context'

export default ({ children }) => {
  const [folderInfo, setFolderInfo] = useState(false)

  const shareValue = {
    folderInfo,
    setFolderInfo
  }

  return (
    <ShareContext.Provider value={shareValue}>
      {children}
    </ShareContext.Provider>
  )
}