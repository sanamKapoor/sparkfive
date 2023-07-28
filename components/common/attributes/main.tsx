import { useState } from "react";
import styles from "./main.module.css";

// Components
import Button from "../buttons/button";
import CampaignManagement from "./campaign-management";
import CollectionManagement from "./collection-management";
import CustomFieldsManagement from "./custom-fields-management";
import ProductManagment from "./product-management";
import TagManagement from "./tag-management";

const Main = () => {
  const [activeList, setActiveList] = useState("tags");

  return (
    <>
      <div className={styles.buttons}>
        <Button
          text="Tags"
          className={
            activeList === "tags"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("tags")}
        />
        <Button
          text="Custom Fields"
          className={
            activeList === "customFields"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("customFields")}
        />
        <Button
          text="Collections"
          className={
            activeList === "collections"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("collections")}
        />
        <Button
          text="Products"
          className={
            activeList === "products"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("products")}
        />

        <Button
          text="Campaigns"
          className={
            activeList === "campaigns"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("campaigns")}
        />
      </div>

      <div className={styles.content}>
        {activeList === "tags" && <TagManagement />}
        {activeList === "customFields" && <CustomFieldsManagement />}
        {activeList === "collections" && <CollectionManagement />}
        {activeList === "products" && <ProductManagment />}
        {activeList === "campaigns" && <CampaignManagement />}
      </div>
    </>
  );
};

export default Main;
