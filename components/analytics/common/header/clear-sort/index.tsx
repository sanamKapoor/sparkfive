import React from 'react'
import Button from '../../../../common/buttons/button';
import styles from "../index.module.css";

const ClearSort = ({ onClick }) => {
  return (
    <div className={`${styles["clear-sort"]}`}>
      <Button text="Clear sorting" className={"clear-sort-btn"} onClick={onClick} />
    </div>
  );
};

export default ClearSort