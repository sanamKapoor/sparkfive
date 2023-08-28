
import styles from "./Tabledata.module.css";
import React from "react";
import { Utilities } from "../../../../../assets";
import Logginbtn from "./loginbtn";
import Expiredbtn from "./expiredbtn";
import Activebtn from "./activebtn";
const TableData=() => {
    return (
        <>
      <tr className={styles.tabledata}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Seraphina Alexandra Montgomery-Smith</span>
                <span className={styles.useremail}>shawnce@att.net</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>Admin</span>
            </td>
            <td>
            <span className={styles.username}>Donquadtech</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Premium Plus</span>
            </td>
            <td>
            <Activebtn />
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata} ${styles.active}`}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Matthew Daniel</span>
                <span className={styles.useremail}>shawnce@att.net</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>User</span>
            </td>
            <td>
            <span className={styles.username}>Y-corporation</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Premium Plus</span>
            </td>
            <td>
            <Activebtn />
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata} `}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Michael Alexander</span>
                <span className={styles.useremail}>adamk@me.com</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>Admin</span>
            </td>
            <td>
            <span className={styles.username}>Donware</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Basic</span>
            </td>
            <td>
            <Expiredbtn/>
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata} ${styles.active}`}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Michael Alexander</span>
                <span className={styles.useremail}>adamk@me.com</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>Admin</span>
            </td>
            <td>
            <span className={styles.username}>Plusstrip</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Premium Plus</span>
            </td>
            <td>
            <Activebtn />
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={styles.tabledata}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Daniel Mason</span>
                <span className={styles.useremail}>cgcra@yahoo.com</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>User</span>
            </td>
            <td>
            <span className={styles.username}>Iselectrics</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Basic</span>
            </td>
            <td>
            <Activebtn />
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata} ${styles.active}`}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Lucas Elijah</span>
                <span className={styles.useremail}>seano@icloud.com</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>User</span>
            </td>
            <td>
            <span className={styles.username}>Sunnamplex</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Basic</span>
            </td>
            <td>
            <Expiredbtn/>
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={styles.tabledata}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Samuel Jackson</span>
                <span className={styles.useremail}>shawnce@att.net</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>User</span>
            </td>
            <td>
            <span className={styles.username}>Opentech</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Basic</span>
            </td>
            <td>
            <Activebtn />
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata} ${styles.active}`}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Jayden Samuel</span>
                <span className={styles.useremail}>garyjb@sbcglobal.net</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>Admin</span>
            </td>
            <td>
            <span className={styles.username}>Zencorporation</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Basic</span>
            </td>
            <td>
            <Activebtn />
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata}`}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>Mason Henry</span>
                <span className={styles.useremail}>jesse@comcast.net</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>User</span>
            </td>
            <td>
            <span className={styles.username}>Golddex</span>
            </td>
            <td>
            <span className={styles.useremail}>Golddex</span>
            </td>
            <td>
            <Expiredbtn/>
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
        <tr className={`${styles.tabledata} ${styles.active}`}>
            <td>
                <div className={styles.content}>
                <span className={styles.username}>David Michael</span>
                <span className={styles.useremail}>papathan@yahoo.ca</span>
                </div>
            </td>
            <td>
               <span className={styles.useremail}>08/23/23</span>
            </td>
            <td>
               <span className={styles.useremail}>05/14/23</span>
            </td>
            <td>
               <span className={styles.useremail}>User</span>
            </td>
            <td>
            <span className={styles.username}>Sumace</span>
            </td>
            <td>
            <span className={styles.useremail}>DAM Premium Plus</span>
            </td>
            <td>
            <Expiredbtn/>
            </td>
            <td className={styles.logbtn}>
            <Logginbtn />
            </td>
        </tr>
      </>

    )
}
export default TableData;