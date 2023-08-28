


import styles from "./Accounttable.module.css";
import React from "react";
import { Utilities } from "../../../../../assets";
const AccountTableHead=() => {
    return (
        <>
      <tr className={styles.headdata}>
            <th className={styles.username}>
                <div className={styles.thead}> <span> Company</span>
               <img className={styles.image} src={Utilities.updown} /></div>
               
            </th>
            <th className={styles.headcontent}>
            <div className={styles.thead}> <span> Senior admin</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th className={styles.headcontent}>
            <div className={styles.thead}> <span> Last login</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th>
            <div className={styles.thead}> <span> Created at</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th>
            <div className={styles.thead}> <span> Last upload</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th>
            <div className={styles.thead}> <span> Storage used</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th>
            <div className={styles.thead}> <span> Files upload</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th>
            <div className={styles.thead}> <span> Plan</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            
            <th className={styles.status}>
            <div className={styles.thead}> <span> Status</span>
               <img className={styles.image} src={Utilities.updown} />
               </div>
            </th>
            <th className={styles.action}>
          Action
            </th>
        </tr>
      </>

    )
}
export default AccountTableHead;