import React, { useState } from "react";
import styles from "./Tags.module.css";
import Select from "../common/inputs/select";
import { sorts } from "../../config/data/attributes";
import Tagmodal from "../main/Select-Tag-Modal/select-tag-modal";
import FilterModal from "../main/filter-modal/filter-modal";
const Tags = () => {
  const [isMOdalOpen,setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={styles.allTags}>
    <div className={`${styles['filter-tags-list']}`}>
    <Select 
        onChange={(value) => {  } }
        placeholder={'Tags'}
        styleType={`regular ${styles['tag-select']}`} options={sorts}/> 
         <Select 
        onChange={(value) => {  } }
        placeholder={'AI Tags'}
        styleType={`regular ${styles['tag-select']}`} options={sorts}/> 
          <Select 
        onChange={(value) => {  } }
        placeholder={'Campaigns'}
        styleType={`regular ${styles['tag-select']}`} options={sorts}/> 
          <Select 
        onChange={(value) => {  } }
        placeholder={'File Types'}
        styleType={`regular ${styles['tag-select']}`} options={sorts}/> 
          <Select 
        onChange={(value) => {  } }
        placeholder={'Product'}
        styleType={`regular ${styles['tag-select']}`} options={sorts}/> 
      </div>
      <div className={styles.morefilter}>
        <button className={styles.moreFilter} onClick={openModal} >More filters</button>
        {isMOdalOpen && (
        <FilterModal onClose={closeModal}/>
        )}
        </div>
      
   
    </div>
  );
};
export default Tags;
