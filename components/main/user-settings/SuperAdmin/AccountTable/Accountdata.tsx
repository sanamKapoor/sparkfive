import styles from "./Accountdata.module.css";
import React from "react";
import { Utilities } from "../../../../../assets";
import Expiredbtn from "../UserTable/expiredbtn";
import Logginbtn from "../UserTable/loginbtn";
import Activebtn from "../UserTable/activebtn";
const AccountData = () => {
  return (
    <>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Iselectrics</span>
        </td>
        <td>
          <div className={styles.content}>
            <span className={styles.username}>
              Seraphina Alexandra Montgomery-Smith
            </span>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Premium Plus</span>
        </td>
        <td>
          <Activebtn />
        </td>
        <td className={styles.logbtn}>
         <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Plusstrip</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>1.11GB</span>
        </td>
        <td>
          <span className={styles.username}>122</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Premium Plus</span>
        </td>
        <td>
          <Activebtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Toughzap</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Premium Plus</span>
        </td>
        <td>
          <Expiredbtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Zencorporation</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Basic</span>
        </td>
        <td>
          <Activebtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Sunnamplex</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Basic</span>
        </td>
        <td>
          <Expiredbtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Isdom</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>18.82GB</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Premium Plus</span>
        </td>
        <td>
          <Activebtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>dambase</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Basic</span>
        </td>
        <td>
          <Expiredbtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Y-corporation</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Basic</span>
        </td>
        <td>
          <Activebtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Sumace</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Basic</span>
        </td>
        <td>
          <Expiredbtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
      <tr className={styles.tabledata}>
        <td>
          <span className={styles.useremail}>Sumace</span>
        </td>
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
          <span className={styles.useremail}>No date</span>
        </td>
        <td>
          <span className={styles.username}>0B</span>
        </td>
        <td>
          <span className={styles.username}>0</span>
        </td>
        <td>
          <span className={styles.useremail}>DAM Basic</span>
        </td>
        <td>
          <Activebtn />
        </td>
        <td className={styles.logbtn}>
        <Logginbtn buttonText="Settings" /> 
        </td>
      </tr>
    </>
  );
};
export default AccountData;
