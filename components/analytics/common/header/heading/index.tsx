import React from "react";
import styles from "../index.module.css";

const Heading = ({ mainText, smallHeading = false }) => {
  return (
    <span className={smallHeading ? styles.smallHeading : styles.heading}>{mainText}</span>
  );
};

export default Heading;
