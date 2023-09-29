import React, { useState } from "react";
import styles from "./collection-modal.module.css";
import { Utilities } from "../../assets";
import Search from "../common/inputs/search";
import NestedButton from "./button";
import Button from "../common/buttons/button";
const data = [
  {
    folderName: "Architecture",
    subfolders: [
      {
        name: "City",
      },
      {
        name: "Renaissance",
      },
      {
        name: "Interior",
      },
      {
        name: "House",
      },
    ],
  },
  {
    folderName: "Portraits",
    subfolders: [],
  },
  {
    folderName: "Nature",
    subfolders: [],
  },
  {
    folderName: "Events",
    subfolders: [],
  },
  {
    folderName: "Travel",
    subfolders: [],
  },
  {
    folderName: "Food",
    subfolders: [],
  },
  {
    folderName: "Landscapes",
    subfolders: [],
  },
];

const collectionModal = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (index: any) => {
    if (selectedItem === index) {
      setSelectedItem(null);
    } else {
      setSelectedItem(index);
    }
  };

  return (
    <div className={styles.nestedsidenav}>
      <div className={`${styles["collection-modal"]}`}>
        <div className={`${styles["collection-heading"]}`}>
          <span>Add an asset to another collection</span>
        </div>
        <div className={`${styles["search-btn"]}`}>
          <Search placeholder="search collection" />
        </div>
        <div className={`${styles["modal-heading"]}`}>
          <span>Collection(21)</span>
        </div>
        <div>
          {data.map((folder, index) => (
            <div key={index}>
              <div className={`${styles["flex"]} ${styles.nestedbox}`}>
                <img
                  className={styles.rightIcon}
                  src={Utilities.arrowBlue}
                  alt="Right Arrow Icon"
                />
                <div className={styles.w100}>
                  <div
                    className={`${styles["dropdownMenu"]} ${
                      selectedItem === index ? styles["active"] : ""
                    }`}
                    onClick={() => handleItemClick(index)}
                  >
                    <div className={styles.flex}>
                      <img src={Utilities.folder} alt="Folder Icon" />
                      <div className={styles["icon-descriptions"]}>
                        <span>{folder.folderName}</span>
                      </div>
                    </div>
                    <div>
                      <div className={styles["list1-right-contents"]}>
                        {selectedItem === index && (
                          <img src={Utilities.checkBlue} alt="Check Icon" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.folder}>
                <div className={styles.subfolderList}>
                  {folder.subfolders.map((subfolder, subIndex) => (
                    <div
                      key={subIndex}
                      className={styles.dropdownOptions}
                      onClick={() => handleItemClick(index)} // Handle click event for subfolder
                    >
                      <div className={styles["folder-lists"]}>
                        <div className={styles.dropdownIcons}>
                          <img
                            className={styles.subfolder}
                            src={Utilities.folder}
                            alt="Folder Icon"
                          />
                          <div className={styles["icon-descriptions"]}>
                            <span>{subfolder.name}</span>
                          </div>
                        </div>
                        <div className={styles["list1-right-contents"]}>
                          {selectedItem === index && <span></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <NestedButton type={"Collection"}>Add collection</NestedButton>
        <div className={styles["modal-btns"]}>
          <Button
            className="container primary main-modal-btn"
            text="Add to collection"
          ></Button>
          <Button className="container secondary" text="Cancel"></Button>
        </div>
      </div>
    </div>
  );
};

export default collectionModal;
