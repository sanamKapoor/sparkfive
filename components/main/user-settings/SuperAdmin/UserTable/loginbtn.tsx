import PropTypes from "prop-types";
import styles from "./loginbtn.module.css";

const Logginbtn = ({ buttonText }) => {
  return (
    <>
      <button className={styles.login}>{buttonText}</button>
    </>
  );
};

//TODO: convert to a typescript interface
Logginbtn.propTypes = {
  buttonText: PropTypes.string.isRequired,
};

export default Logginbtn;
