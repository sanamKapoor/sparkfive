import styles from "./TableHead.module.css";
import React from "react";
import { Utilities } from "../../../../../assets";
const TableHead = () => {
  function handleImageClick() {
    console.log("Image clicked!");
  }

  return (
    <>
      <tr className={styles.headdata}>
        <th className={styles.username}>
          <div className={styles.thead}>
            {" "}
            <span> User name</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th className={styles.headcontent}>
          <div className={styles.thead}>
            {" "}
            <span> Last Login</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th className={styles.headcontent}>
          <div className={styles.thead}>
            {" "}
            <span> Created at</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            {" "}
            <span> Role</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            {" "}
            <span> Company</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            {" "}
            <span> Plan</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th className={styles.status}>
          <div className={styles.thead}>
            {" "}
            <span> Status</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={handleImageClick}
            />
          </div>
        </th>
        <th className={styles.action}>Action</th>
      </tr>
    </>
  );
};
export default TableHead;
