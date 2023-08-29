import styles from "./loginbtn.module.css";
import React from "react";
import PropTypes from "prop-types";
const Logginbtn = ({buttonText}) => {
  return (
    <>
      <button className={styles.login}>{buttonText}</button>
    </>
  );
};
Logginbtn.propTypes = {
  buttonText: PropTypes.string.isRequired, 
}

export default Logginbtn;
