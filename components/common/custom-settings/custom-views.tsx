import { useContext, useState } from "react";
import { Utilities } from "../../../assets";
import { UserContext } from "../../../context";
import teamAPI from "../../../server-api/team";
import advancedConfigParams from "../../../utils/advance-config-params";
import IconClickable from "../buttons/icon-clickable";
import styles from "./main.module.css";

const CustomViews = () => {
  const [loading, setLoading] = useState(false);
  const { advancedConfig, setAdvancedConfig } = useContext(UserContext);
  const [defaultLandingPage, setDefaultLandingPage] = useState("");
  const [collectionSortView, setCollectionSortView] = useState("");
  const [assetSortView, setAssetSortView] = useState("");
  const [hideFilterElements, setHideFilterElements] = useState(
    advancedConfigParams.hideFilterElements
  );

  const saveAdvanceConfig = async (config) => {
    setLoading(true);
    await teamAPI.saveAdvanceConfigurations({ config });

    const updatedConfig = { ...advancedConfig, ...config };
    setAdvancedConfig(updatedConfig);

    getAdvanceConfigurations(updatedConfig);
  };

  const getAdvanceConfigurations = (conf = advancedConfig) => {
    setDefaultLandingPage(conf.defaultLandingPage);
    setCollectionSortView(conf.collectionSortView);
    setAssetSortView(conf.assetSortView);
    // setaiTagging(conf.aiTagging)
    setLoading(false);
    return true;
  };

  const toggleHideElementProperty = (prop) => {
    const elemsState = { ...hideFilterElements };
    elemsState[prop] = !elemsState[prop];
    saveAdvanceConfig({ hideFilterElements: elemsState });
  };

  return (
    <div className={styles.container}>
      <h3>Custom Views</h3>

      <div>
        <div className={styles.row}>
          <span className={styles.label}>Default Landing Page</span>
          <div className={styles["field-radio-wrapper"]}>
            <div className={styles.radio}>
              <div>All Tab</div>
              <IconClickable
                src={
                  defaultLandingPage === "allTab"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() =>
                  saveAdvanceConfig({ defaultLandingPage: "allTab" })
                }
              />
            </div>
            <div className={styles.radio}>
              <div>Collection Tab</div>
              <IconClickable
                src={
                  defaultLandingPage !== "allTab"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() =>
                  saveAdvanceConfig({ defaultLandingPage: "collection" })
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Collection Sort</div>
          <div className={styles["field-radio-wrapper"]}>
            <div className={styles.radio}>
              <div>Alphabetical</div>
              <IconClickable
                src={
                  collectionSortView === "alphabetical"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() =>
                  saveAdvanceConfig({ collectionSortView: "alphabetical" })
                }
              />
            </div>
            <div className={styles.radio}>
              <div>Newest</div>
              <IconClickable
                src={
                  collectionSortView !== "alphabetical"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() =>
                  saveAdvanceConfig({ collectionSortView: "newest" })
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Asset Sort</div>
          <div className={styles["field-radio-wrapper"]}>
            <div className={styles.radio}>
              <div>Alphabetical</div>
              <IconClickable
                src={
                  assetSortView === "alphabetical"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() =>
                  saveAdvanceConfig({ assetSortView: "alphabetical" })
                }
              />
            </div>
            <div className={styles.radio}>
              <div>Newest</div>
              <IconClickable
                src={
                  assetSortView !== "alphabetical"
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => saveAdvanceConfig({ assetSortView: "newest" })}
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Hide Filter Elements</div>
          <div className={styles["field-radio-wrapper"]}>
            <div className={styles.radio}>
              <div>Campaigns</div>
              <IconClickable
                src={
                  hideFilterElements.campaigns
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => toggleHideElementProperty("campaigns")}
              />
            </div>
            <div className={styles.radio}>
              <div>Products</div>
              <IconClickable
                src={
                  hideFilterElements.products
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => toggleHideElementProperty("products")}
              />
            </div>
            <div className={styles.radio}>
              <div>Videos</div>
              <IconClickable
                src={
                  hideFilterElements.videos
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => toggleHideElementProperty("videos")}
              />
            </div>
            <div className={styles.radio}>
              <div>AI Tags</div>
              <IconClickable
                src={
                  hideFilterElements.aiTags
                    ? Utilities.radioButtonEnabled
                    : Utilities.radioButtonNormal
                }
                additionalClass={styles["select-icon"]}
                onClick={() => toggleHideElementProperty("aiTags")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomViews;
