import React, { useState } from "react";
import { Utilities } from "../../../assets";
import styles from "./more-option.module.css"; // Import the CSS module

const MoreOption = () => {
  const [activeItem, setActiveItem] = useState(null);
  const handleItemClick = (index:number) => {
    setActiveItem(index);
  };

  return (
    <>
      <div className={`${styles['modal-wrapper']}`}>
        <ul>
          <li
            className={`${styles['list-items']} ${
              activeItem === 0 ? styles['active'] : ''
            }`}
            onClick={() => handleItemClick(0)}
          >
            Download
          </li>
          <li
            className={`${styles['list-items']} ${
              activeItem === 1 ? styles['active'] : ''
            }`}
            onClick={() => handleItemClick(1)}
          >
            Share
          </li>
          <li
            className={`${styles['list-items']} ${
              activeItem === 2 ? styles['active'] : ''
            }`}
            onClick={() => handleItemClick(2)}
          >
            Delete
          </li>
          <li
            className={`${styles['list-items']} ${
              activeItem === 3 ? styles['active'] : ''
            }`}
            onClick={() => handleItemClick(3)}
          >
            Change Thumbnail
          </li>
          <li
            className={`${styles['list-items']} ${
              activeItem === 4 ? styles['active'] : ''
            }`}
            onClick={() => handleItemClick(4)}
          >
            Filter settings
          </li>
        </ul>
      </div>
    </>
  );
};

export default MoreOption;
