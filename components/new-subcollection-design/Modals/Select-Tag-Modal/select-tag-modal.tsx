import styles from "./select-tag-modal.module.css";
import React, { useState } from "react";
import { Utilities } from "../../../assets";
import Button from "../../common/buttons/button";
import NestedSelect from "../../common/inputs/nested-select";
import Select from "../../common/inputs/select";
import { sorts } from "../../../config/data/attributes";

const Tagmodal = ({ onClose }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCircleClick = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className={styles.modalContainer}>
       <div className={styles.tagModal}>
      <div className={styles.modalHead}>
        <span>Select Tags</span>
        <div className={styles.buttons}>
          <button onClick={onClose} className={styles.clear}>clear</button>
          <img  src={Utilities.closeIcon} />
        </div>
      </div>
      <div className={styles.searchWrapper}>
        <input
          placeholder="Search tags"
          className={styles.searchInput}
          type="search"
        />
        <img className={styles.searchIcon} src={Utilities.searchIcon} />
      </div>
      <div className={styles.tagOuter}>
        <div className={styles.gridItem}>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>80s</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Painting</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Abstract</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Fluorescent</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Social Media User</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Binge Watcher</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Soccer Mom</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>College Student</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>School</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Stones</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>80s</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Painting</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Abstract</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Fluorescent</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Social Media User</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Binge Watcher</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Soccer Mom</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>College Student</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>School</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Stones</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>80s</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Painting</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Abstract</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Fluorescent</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Social Media User</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Binge Watcher</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Soccer Mom</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>College Student</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>School</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
          <div className={styles.TagsInfo}>
            <div className={`${styles["tag-desc"]}`}>
              <div
                className={`${styles.circle} ${
                  isChecked ? styles.checked : ""
                }`}
                onClick={handleCircleClick}
              >
                {isChecked && <img src={Utilities.checkIcon} />}
              </div>
              <span>Stones</span>
            </div>
            <div className={`${styles["total-count"]}`}>
              <span>21</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles['rule-tag']}`}>
      <label>Rule:</label>
      <Select 
        onChange={(value) => {  } }
      
        placeholder={'Any selected'}
        styleType={`regular ${styles['tag-select']} fontSize: '16px', fontWeight: 'bold' `} options={sorts}/>     
        </div>
           
      <div className={styles.modalBtn}>
        <Button className={"apply"} text={"Apply"}></Button>
        <Button className={"cancel"} text={"Cancel"}></Button>
      </div>
     

    </div>
    </div>
   
  );
  
};

export default Tagmodal;
