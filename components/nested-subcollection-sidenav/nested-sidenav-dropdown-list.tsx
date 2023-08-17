import styles from "./nested-sidenav-dropdown.module.css";
import { Utilities } from "../../assets";
import React, { useState } from "react";
import Draggable from "react-draggable";
import NestedButton from "./button";
import Dropdown from "../common/inputs/dropdown";

const NestedSidenavDropdown = () => {
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isNatureOpen, setIsNatureOpen] = useState(false);
  const [isFoodOpen, setIsFoodOpen] = useState(false);

  const toggleArchitecture = () => {
    setIsArchitectureOpen(!isArchitectureOpen);
  };
  const toggleNature = () => {
    setIsNatureOpen(!isNatureOpen);
  };

  const toggleFood = () => {
    setIsFoodOpen(!isFoodOpen);
  };

  return (
    <div>
      <ul>
        <li className={styles.dropdownMenu}>
          <div
            className={`${styles["dropdown-lists"]} ${styles.active}`}
            onClick={toggleArchitecture}
          >
            <div className={styles.dropdownIcons}>
              {/* <img className={styles.rightIcon} src={Utilities.right} /> */}
              <img src={Utilities.folder} />
              <div className={styles["icon-descriptions"]}>
                <span>Architecture</span>
              </div>
            </div>
            <div className={styles["list1-right-contents"]}>
              <span>8</span>
            </div>
          </div>
          {isArchitectureOpen && (
            <div className={styles.subfolderList}>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>City</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>7</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>Renaissance</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>7</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <div className={styles.dropdownOptions}>
                <div className={styles["folder-lists"]}>
                  <div className={styles.dropdownIcons}>
                    <img className={styles.subfolder} src={Utilities.folder} />
                    <div className={styles["icon-descriptions"]}>
                      <span>Interior</span>
                    </div>
                  </div>
                  <div className={styles["list1-right-contents"]}>
                    <span>23</span>
                  </div>
                </div>
              </div>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>House</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>29</span>
                    </div>
                  </div>
                </div>
              </Draggable>

              <NestedButton>Add Subcollection</NestedButton>
            </div>
          )}
        </li>
        <li>
          <Draggable
            axis="both"
            defaultPosition={{ x: 0, y: 0 }}
            grid={[25, 25]}
            scale={1}
          >
            <div className={styles["folder-lists"]}>
              <div className={styles.dropdownIcons}>
                <img src={Utilities.folder} />
                <div className={styles["icon-descriptions"]}>
                  <span>Portraits</span>
                </div>
              </div>
              <div className={styles["list1-right-contents"]}>
                <span>44</span>
              </div>
            </div>
          </Draggable>
        </li>
        <li className={styles.dropdownMenu}>
          <div
            className={`${styles["dropdown-lists"]} ${styles.active}`}
            onClick={toggleNature}
          >
            <div className={styles.dropdownIcons}>
              {/* <img className={styles.rightIcon} src={Utilities.right} /> */}
              <img src={Utilities.folder} />
              <div className={styles["icon-descriptions"]}>
                <span>Nature</span>
              </div>
            </div>
            <div className={styles["list1-right-contents"]}>
              <span>93</span>
            </div>
          </div>
          {isNatureOpen && (
            <div className={styles.subfolderList}>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>City</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>7</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>Renaissance</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>7</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <div className={styles.dropdownOptions}>
                <div className={styles["folder-lists"]}>
                  <div className={styles.dropdownIcons}>
                    <img className={styles.subfolder} src={Utilities.folder} />
                    <div className={styles["icon-descriptions"]}>
                      <span>Interior</span>
                    </div>
                  </div>
                  <div className={styles["list1-right-contents"]}>
                    <span>23</span>
                  </div>
                </div>
              </div>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>House</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>29</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <NestedButton>Add Subcollection</NestedButton>
            </div>
          )}
        </li>
        <li>
          <Draggable
            axis="both"
            defaultPosition={{ x: 0, y: 0 }}
            grid={[25, 25]}
            scale={1}
          >
            <div className={styles["folder-lists"]}>
              <div className={styles.dropdownIcons}>
                <img src={Utilities.folder} />
                <div className={styles["icon-descriptions"]}>
                  <span>Events</span>
                </div>
              </div>
              <div className={styles["list1-right-contents"]}>
                <span>12</span>
              </div>
            </div>
          </Draggable>
        </li>
        <li>
          <Draggable
            axis="both"
            defaultPosition={{ x: 0, y: 0 }}
            grid={[25, 25]}
            scale={1}
          >
            <div className={styles["folder-lists"]}>
              <div className={styles.dropdownIcons}>
                <img src={Utilities.folder} />
                <div className={styles["icon-descriptions"]}>
                  <span>Travel</span>
                </div>
              </div>
              <div className={styles["list1-right-contents"]}>
                <span>34</span>
              </div>
            </div>
          </Draggable>
        </li>
        <li className={styles.dropdownMenu}>
          <div
            className={`${styles["dropdown-lists"]} ${styles.active}`}
            onClick={toggleFood}
          >
            <div className={styles.dropdownIcons}>
              {/* <img className={styles.rightIcon} src={Utilities.right} /> */}
              <img src={Utilities.folder} />
              <div className={styles["icon-descriptions"]}>
                <span>Food</span>
              </div>
            </div>
            <div className={styles["list1-right-contents"]}>
              <span>93</span>
            </div>
          </div>
          {isFoodOpen && (
            <div className={styles.subfolderList}>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>City</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>7</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>Renaissance</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>7</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <div className={styles.dropdownOptions}>
                <div className={styles["folder-lists"]}>
                  <div className={styles.dropdownIcons}>
                    <img className={styles.subfolder} src={Utilities.folder} />
                    <div className={styles["icon-descriptions"]}>
                      <span>Interior</span>
                    </div>
                  </div>
                  <div className={styles["list1-right-contents"]}>
                    <span>23</span>
                  </div>
                </div>
              </div>
              <Draggable
                axis="both"
                defaultPosition={{ x: 0, y: 0 }}
                grid={[25, 25]}
                scale={1}
              >
                <div className={styles.dropdownOptions}>
                  <div className={styles["folder-lists"]}>
                    <div className={styles.dropdownIcons}>
                      <img
                        className={styles.subfolder}
                        src={Utilities.folder}
                      />
                      <div className={styles["icon-descriptions"]}>
                        <span>House</span>
                      </div>
                    </div>
                    <div className={styles["list1-right-contents"]}>
                      <span>29</span>
                    </div>
                  </div>
                </div>
              </Draggable>
              <NestedButton>Add Subcollection</NestedButton>
            </div>
          )}
        </li>
        <li>
          <Draggable
            axis="both"
            defaultPosition={{ x: 0, y: 0 }}
            grid={[25, 25]}
            scale={1}
          >
            <div className={styles["folder-lists"]}>
              <div className={styles.dropdownIcons}>
                <img src={Utilities.folder} />
                <div className={styles["icon-descriptions"]}>
                  <span>Landscapes</span>
                </div>
              </div>
              <div className={styles["list1-right-contents"]}>
                <span>76</span>
              </div>
            </div>
          </Draggable>
        </li>
        <NestedButton>Add collection</NestedButton>
      </ul>
    </div>
  );
};

export default NestedSidenavDropdown;
