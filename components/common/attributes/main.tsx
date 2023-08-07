import { useState } from "react";
import styles from "./main.module.css";

// Components
import { capitalCase } from "change-case";
import { AttributeTabs } from "../../../types/common/tabs";
import Button from "../buttons/button";
import CampaignManagement from "./campaign-management";
import CollectionManagement from "./collection-management";
import CustomFieldsManagement from "./custom-fields-management";
import ProductManagment from "./product-management";
import TagManagement from "./tag-management";

const Main: React.FC = () => {
  const [activeList, setActiveList] = useState<AttributeTabs>(
    AttributeTabs.TAGS
  );

  return (
    <>
      <div className={styles.buttons}>
        <Button
          text={capitalCase(AttributeTabs.TAGS)}
          className={
            activeList === AttributeTabs.TAGS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(AttributeTabs.TAGS)}
        />
        <Button
          text={capitalCase(AttributeTabs.CUSTOM_FIELDS)}
          className={
            activeList === AttributeTabs.CUSTOM_FIELDS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(AttributeTabs.CUSTOM_FIELDS)}
        />
        <Button
          text={capitalCase(AttributeTabs.COLLECTIONS)}
          className={
            activeList === AttributeTabs.COLLECTIONS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(AttributeTabs.COLLECTIONS)}
        />
        <Button
          text={capitalCase(AttributeTabs.PRODUCTS)}
          className={
            activeList === AttributeTabs.PRODUCTS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(AttributeTabs.PRODUCTS)}
        />

        <Button
          text={capitalCase(AttributeTabs.CAMPAIGNS)}
          className={
            activeList === AttributeTabs.CAMPAIGNS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(AttributeTabs.CAMPAIGNS)}
        />
      </div>

      <div className={styles.content}>
        {activeList === AttributeTabs.TAGS && <TagManagement />}
        {activeList === AttributeTabs.CUSTOM_FIELDS && (
          <CustomFieldsManagement />
        )}
        {activeList === AttributeTabs.COLLECTIONS && <CollectionManagement />}
        {activeList === AttributeTabs.PRODUCTS && <ProductManagment />}
        {activeList === AttributeTabs.CAMPAIGNS && <CampaignManagement />}
      </div>
    </>
  );
};

export default Main;
