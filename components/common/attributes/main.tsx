import { useState } from "react";
import styles from "./main.module.css";

// Components
import SectionButton from "../../common/buttons/section-button";
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
        <SectionButton
          text="Tags"
          active={activeList === "tags"}
          onClick={() => setActiveList("tags")}
        />
        <SectionButton
          text="Custom Fields"
          active={activeList === "customFields"}
          onClick={() => setActiveList("customFields")}
        />
        <SectionButton
          text="Collections"
          active={activeList === "collections"}
          onClick={() => setActiveList("collections")}
        />
        <SectionButton
          text="Products"
          active={activeList === "products"}
          onClick={() => setActiveList("products")}
        />

        <SectionButton
          text="Campaigns"
          active={activeList === "campaigns"}
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
