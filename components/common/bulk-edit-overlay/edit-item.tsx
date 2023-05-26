import React, { useEffect, useState } from 'react';
import styles from "./edit-grid.module.css";
import { format } from 'date-fns';
import { Utilities } from '../../../assets';
import AssetImg from '../asset/asset-img';
import AssetIcon from '../asset/asset-icon';
import IconClickable from '../buttons/icon-clickable';
import Button from '../buttons/button';
import BaseModal from '../modals/base';
import EditDetail from './edit-detail';

const EditItem = ({assets, asset, thumbailUrl, realUrl, isEditSelected, index, toggleSelectedEdit, totalLength }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [curIndex, setCurIndex] = useState(index)
    const [curAsset, setCurAsset] = useState(assets[curIndex % totalLength])

    useEffect(() => {
      setCurAsset(assets[curIndex % totalLength]);
    }, [curIndex]);

  return (
    <li key={asset.id || index}>
      <>
        <div className={`${styles.container}`}>
          <div
            className={styles["image-wrapper"]}
            onClick={() => toggleSelectedEdit(asset.id)}
          >
            {thumbailUrl ? (
              <AssetImg
                assetImg={thumbailUrl}
                type={asset.type}
                name={asset.name}
              />
            ) : (
              <AssetIcon extension={asset.extension} bulkSize={true} />
            )}
            {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
        {asset.type === 'video' && <AssetVideo asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} bulkSize={true} />}
        {asset.type === 'application' && <AssetApplication extension={asset.extension} bulkSize={true} />}
        {asset.type === 'text' && <AssetText extension={asset.extension} bulkSize={true} />} */}
            <>
              <div
                className={`${styles["selectable-wrapper"]} ${
                  isEditSelected && styles["selected-wrapper"]
                }`}
              >
                <IconClickable
                  src={
                    isEditSelected
                      ? Utilities.radioButtonEnabled
                      : Utilities.radioButtonNormal
                  }
                  additionalClass={styles["select-icon"]}
                />
              </div>
            </>
            <div className={styles["image-button-wrapper"]}>
              <Button
                styleType={"primary"}
                text={"View Details"}
                type={"button"}
                onClick={() => {setCurIndex(index) ; setModalOpen(true)}}
              />
            </div>
          </div>
          <div
            data-tip
            data-for={`asset-${asset.id}`}
            className={styles["text-wrapper"]}
          >
            <div className={styles.name}>{asset.name}</div>
            <div className={styles.date}>
              {format(new Date(asset.createdAt), "MMM , yyyy, p")}
            </div>
          </div>
        </div>
      </>
      <BaseModal
        additionalClasses={[styles.detail]}
        closeModal={() => setModalOpen(false)}
        modalIsOpen={modalOpen}
        children={
          <EditDetail
            currentIndex={curIndex}
            setCurrentIndex={setCurIndex}
            currentAsset={curAsset}
            setCurrentAsset={setCurAsset}
            totalLength={totalLength}
          />
        }
        closeButtonOnly
      />
    </li>
  );
}
 
export default EditItem