import {useContext} from "react";

import styles from './index.module.css'



// Component
import Main from "../../../common/ocr-text-recognition/main";
import NoPermissionNotice from "../../../common/misc/no-permission-notice";


import { UserContext } from '../../../../context'

const OCR = () => {
    const { user } = useContext(UserContext)
  return (
    <div className={styles.container}>
        {!user?.team?.ocr && <NoPermissionNotice noPaddingLeft={true}/>}
        {user?.team?.ocr && <Main />}
    </div>
  )
}

export default OCR
