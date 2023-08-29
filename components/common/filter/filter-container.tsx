import styles from "./filter-container.module.css";
import update from "immutability-helper";
import { FilterContext, AssetContext, UserContext } from "../../../context";
import React, { useState, useEffect, useContext } from "react";
import { Utilities } from "../../../assets";

import customFieldsApi from "../../../server-api/attribute";
import shareCollectionApi from "../../../server-api/share-collection";

// Components
import FilterSelector from "./filter-selector";
import DateUploaded from "./date-uploaded";
import ProductFilter from "./product-filter";
import DimensionsFilter from "./dimensions-filter";
import ResolutionFilter from "./resolution-filter";

const FilterContainer = ({
  openFilter,
  setOpenFilter,
  activeSortFilter,
  setActiveSortFilter,
  clearFilters,
  isFolder = false,
  isShare = false,
  filterWidth,
}) => {
  const [expandedMenus, setExpandedMenus] = useState(
    isFolder ? ["folders"] : ["tags"]
  );
  const [stickyMenuScroll, setStickyMenuScroll] = useState(false);
  const [customFieldList, setCustomFieldList] = useState([]);
  const { advancedConfig } = useContext(UserContext);
  const [hideFilterElements] = useState(advancedConfig.hideFilterElements);
  const [nonAiTags, setNonAiTags] = useState([]);
  const [aiTags, setAiTags] = useState([]);

  const {
    folders,
    campaigns,
    channels,
    fileTypes,
    projects,
    tags,
    assetOrientations,
    assetResolutions,
    assetDimensionLimits: { maxHeight, minHeight, maxWidth, minWidth },
    productFields,
    loadAssetDimensionLimits,
    loadAssetOrientations,
    loadCampaigns,
    loadChannels,
    loadFileTypes,
    loadProjects,
    loadTags,
    loadProductFields,
    loadFolders,
    loadSharedFolders,
    loadAssetResolutions,
    isPublic,
    sharePath,
    customFields,
    loadCustomFields,
    setCustomFields,
    renderFlag,
    setRenderedFlag,
  } = useContext(FilterContext);

  const { activeFolder } = useContext(AssetContext);

  const getCustomFields = async () => {
    try {

      const { data } = isPublic
        ? await shareCollectionApi.getCustomFields({
          assetsCount: "yes",
          assetLim: "yes",
          sharePath,
        })
        : await customFieldsApi.getCustomFieldsWithCount({
          assetsCount: "yes",
          assetLim: "yes",
          sharePath,
        });

      setCustomFieldList(data);

      let fields = [];

      // Expand those custom field
      data.map((item, index) => {
        fields.push(`customFields-${index}`);
      });
      //
      // setExpandedMenus(update(expandedMenus, {
      //     $push: fields
      // }))

      let filter = {};
      let fieldValues = {};
      data.map((value, index) => {
        // Select one will use `all-px` query field also
        filter[`all-p${value.id}`] = {
          $set: value.type === "selectOne" ? "all" : "all",
        }; // Available: none, all
        filter[`custom-p${value.id}`] = { $set: [] };
        fieldValues[value.id] = [];
      });

      setCustomFields(fieldValues);
      // Add filter
      setRenderedFlag(true);
      if (!renderFlag) {
        setActiveSortFilter(update(activeSortFilter, filter));
      }
    } catch (err) {
      // TODO: Maybe show error?
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setStickyMenuScroll(window.scrollY > 215);
    });

    getCustomFields();
  }, []);

  useEffect(() => {
    const _nonAiTags = (tags || []).filter((tag) => tag.type !== "AI");
    const _aiTags = (tags || []).filter((tag) => tag.type === "AI");
    setNonAiTags(_nonAiTags);
    setAiTags(_aiTags);
  }, [tags]);

  const handleOpenFilter = () => {
    if (openFilter) {
      setOpenFilter(false);
    } else {
      setOpenFilter(true);
    }
  };

  const setSortFilterValue = (key, value) => {
    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value,
    });
  };

  const handleExpand = (menu) => {
    let index = expandedMenus.findIndex((item) => item === menu);
    if (index !== -1) {
      setExpandedMenus(
        update(expandedMenus, {
          $splice: [[index, 1]],
        })
      );
    } else {
      setExpandedMenus(
        update(expandedMenus, {
          $push: [menu],
        })
      );
    }
  };

  const reloadTags = () => {
    loadTags({ includeAi: true });
  };

  return (
    <>
      {renderFlag && (
        <div
          className={`${styles.container}  ${stickyMenuScroll && styles["sticky-menu"]
            }`}
          style={{ width: filterWidth }}
        >
          <section className={styles["top-bar"]}>
            <div>
              <h3>Filters</h3>
            </div>
            <div className={styles.closefilter}>
              <p
                className={`${styles["clear-container"]}`}
                onClick={clearFilters}
              >
                Clear
              </p>
              <div
                className={`${styles["close-container"]}`}
                onClick={() => {
                  handleOpenFilter();
                }}
              >
                &#10005;
              </div>
            </div>
          </section>
          <div
            className={`${styles["section-container"]} ${isFolder ? styles["limit-height-container"] : ""
              }`}
            id={"scroll-search-bottom-container"}
          >
            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("tags")}
                >
                  <h4>Tags</h4>
                  {expandedMenus.includes("tags") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("tags") && (
                  <FilterSelector
                    numItems={10}
                    anyAllSelection={activeSortFilter.allNonAiTags}
                    setAnyAll={(value) =>
                      setActiveSortFilter(
                        update(activeSortFilter, {
                          allNonAiTags: { $set: value },
                        })
                      )
                    }
                    loadFn={reloadTags}
                    filters={nonAiTags.map((tag) => ({
                      ...tag,
                      label: tag.name,
                      value: tag.id,
                    }))}
                    value={activeSortFilter.filterNonAiTags}
                    setValue={(selected) =>
                      setSortFilterValue("filterNonAiTags", selected)
                    }
                    addtionalClass={"tags-container"}
                    noneOption={true}
                  />
                )}
              </section>
            )}
            {!isFolder &&
              !hideFilterElements.aiTags &&
              advancedConfig.aiTagging && (
                <section>
                  <div
                    className={styles["expand-bar"]}
                    onClick={() => handleExpand("aiTags")}
                  >
                    <h4>AI Tags</h4>
                    {expandedMenus.includes("aiTags") ? (
                      <img
                        src={Utilities.arrowUpGrey}
                        className={styles["expand-icon"]}
                      />
                    ) : (
                      <img
                        src={Utilities.arrowGrey}
                        className={styles["expand-icon"]}
                      />
                    )}
                  </div>
                  {expandedMenus.includes("aiTags") && (
                    <FilterSelector
                      numItems={10}
                      anyAllSelection={activeSortFilter.allAiTags}
                      setAnyAll={(value) =>
                        setActiveSortFilter(
                          update(activeSortFilter, {
                            allAiTags: { $set: value },
                          })
                        )
                      }
                      loadFn={reloadTags}
                      filters={aiTags.map((tag) => ({
                        ...tag,
                        label: tag.name,
                        value: tag.id,
                      }))}
                      value={activeSortFilter.filterAiTags}
                      setValue={(selected) =>
                        setSortFilterValue("filterAiTags", selected)
                      }
                      addtionalClass={"tags-container"}
                    />
                  )}
                </section>
              )}

            {customFieldList.map((field, index) => {
              return (
                <div key={index}>
                  {!isFolder && (
                    <section>
                      <div
                        className={styles["expand-bar"]}
                        onClick={() => handleExpand(`customFields-${index}`)}
                      >
                        <h4>{field.name}</h4>
                        {expandedMenus.includes(`customFields-${index}`) ? (
                          <img
                            src={Utilities.arrowUpGrey}
                            className={styles["expand-icon"]}
                          />
                        ) : (
                          <img
                            src={Utilities.arrowGrey}
                            className={styles["expand-icon"]}
                          />
                        )}
                      </div>
                      {expandedMenus.includes(`customFields-${index}`) && (
                        <FilterSelector
                          numItems={10}
                          anyAllSelection={
                            field.type === "selectMultiple"
                              ? activeSortFilter[`all-p${field.id}`]
                              : ""
                          }
                          setAnyAll={
                            field.type === "selectMultiple"
                              ? (value) =>
                                setActiveSortFilter(
                                  update(activeSortFilter, {
                                    [`all-p${field.id}`]: { $set: value },
                                  })
                                )
                              : () => { }
                          }
                          loadFn={() => loadCustomFields(field.id)}
                          filters={
                            customFields[field.id]
                              ? customFields[field.id].map((tag) => ({
                                ...tag,
                                label: tag.name,
                                value: tag.id,
                              }))
                              : []
                          }
                          value={activeSortFilter[`custom-p${field.id}`]}
                          setValue={(selected) =>
                            setSortFilterValue(`custom-p${field.id}`, selected)
                          }
                          addtionalClass={"tags-container"}
                          internalFilter
                          mappingValueName={"id"}
                        />
                      )}
                    </section>
                  )}
                </div>
              );
            })}
            {/*{!isFolder &&*/}
            {/*    <section>*/}
            {/*        <div className={styles['expand-bar']} onClick={() => handleExpand('channels')}>*/}
            {/*            <h4>Channels</h4>*/}
            {/*            {expandedMenus.includes('channels') ?*/}
            {/*                <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :*/}
            {/*                <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}*/}
            {/*        </div>*/}
            {/*        {expandedMenus.includes('channels') &&*/}
            {/*            <FilterSelector*/}
            {/*                capitalize={true}*/}
            {/*                searchBar={false}*/}
            {/*                numItems={8}*/}
            {/*                loadFn={loadChannels}*/}
            {/*                filters={channels.map(channel => ({ ...channel, label: channel.name, value: channel.name }))}*/}
            {/*                value={activeSortFilter.filterChannels}*/}
            {/*                setValue={(selected) => setSortFilterValue('filterChannels', selected)}*/}
            {/*            />}*/}
            {/*    </section>*/}
            {/*}*/}
            {!isFolder && !hideFilterElements.campaigns && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("campaigns")}
                >
                  <h4>Campaigns</h4>
                  {expandedMenus.includes("campaigns") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("campaigns") && (
                  <FilterSelector
                    oneColumn={true}
                    anyAllSelection={activeSortFilter.allCampaigns}
                    setAnyAll={(value) =>
                      setActiveSortFilter(
                        update(activeSortFilter, {
                          allCampaigns: { $set: value },
                        })
                      )
                    }
                    loadFn={loadCampaigns}
                    numItems={5}
                    filters={campaigns.map((campaign) => ({
                      ...campaign,
                      label: campaign.name,
                      value: campaign.id,
                    }))}
                    value={activeSortFilter.filterCampaigns}
                    setValue={(selected) =>
                      setSortFilterValue("filterCampaigns", selected)
                    }
                  />
                )}
              </section>
            )}
            {!activeFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("folders")}
                >
                  <h4>Collections</h4>
                  {expandedMenus.includes("folders") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("folders") && (
                  <FilterSelector
                    oneColumn={true}
                    loadFn={() => {
                      isShare
                        ? loadSharedFolders(isFolder, sharePath)
                        : loadFolders(isFolder);
                    }}
                    numItems={isFolder ? folders.length : 5}
                    filters={folders.map((folder) => ({
                      ...folder,
                      label: folder.name,
                      value: folder.id,
                    }))}
                    value={activeSortFilter.filterFolders}
                    setValue={(selected) =>
                      setSortFilterValue("filterFolders", selected)
                    }
                    scrollBottomAfterSearch={isFolder}
                  />
                )}
              </section>
            )}
            {/*{!isFolder &&*/}
            {/*    <section>*/}
            {/*        <div className={styles['expand-bar']} onClick={() => handleExpand('projects')}>*/}
            {/*            <h4>Projects</h4>*/}
            {/*            {expandedMenus.includes('projects') ?*/}
            {/*                <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :*/}
            {/*                <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}*/}
            {/*        </div>*/}
            {/*        {expandedMenus.includes('projects') &&*/}
            {/*            <FilterSelector*/}
            {/*                oneColumn={true}*/}
            {/*                loadFn={loadProjects}*/}
            {/*                numItems={5}*/}
            {/*                anyAllSelection={activeSortFilter.allProjects}*/}
            {/*                setAnyAll={(value) => setActiveSortFilter(update(activeSortFilter, { allProjects: { $set: value } }))}*/}
            {/*                filters={projects.map(project => ({ ...project, label: project.name, value: project.id }))}*/}
            {/*                value={activeSortFilter.filterProjects}*/}
            {/*                setValue={(selected) => setSortFilterValue('filterProjects', selected)}*/}
            {/*            />}*/}
            {/*    </section>*/}
            {/*}*/}
            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("file-types")}
                >
                  <h4>File Types</h4>
                  {expandedMenus.includes("file-types") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("file-types") && (
                  <FilterSelector
                    loadFn={loadFileTypes}
                    searchBar={false}
                    numItems={60}
                    filters={fileTypes.map((fileType) => ({
                      ...fileType,
                      label: fileType.name,
                      value: fileType.name,
                    }))}
                    value={activeSortFilter.filterFileTypes}
                    setValue={(selected) =>
                      setSortFilterValue("filterFileTypes", selected)
                    }
                  />
                )}
              </section>
            )}
            {!isFolder && !hideFilterElements.products && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("product")}
                >
                  <h4>Product</h4>
                  {expandedMenus.includes("product") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("product") && (
                  <ProductFilter
                    loadFn={loadProductFields}
                    productFilters={productFields}
                    setSortFilterValue={setSortFilterValue}
                    fieldsValue={activeSortFilter.filterProductFields}
                    skuValue={activeSortFilter.filterProductSku}
                  />
                )}
              </section>
            )}
            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("modifiedDate")}
                >
                  <h4>Last Updated</h4>
                  {expandedMenus.includes("date") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("modifiedDate") && (
                  <DateUploaded
                    handleBeginDate={(date) =>
                      setSortFilterValue("fileModifiedBeginDate", date)
                    }
                    handleEndDate={(date) =>
                      setSortFilterValue("fileModifiedEndDate", date)
                    }
                    beginDate={activeSortFilter.fileModifiedBeginDate}
                    endDate={activeSortFilter.fileModifiedEndDate}
                  />
                )}
              </section>
            )}
            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("date")}
                >
                  <h4>Date Uploaded</h4>
                  {expandedMenus.includes("date") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("date") && (
                  <DateUploaded
                    handleBeginDate={(date) =>
                      setSortFilterValue("beginDate", date)
                    }
                    handleEndDate={(date) =>
                      setSortFilterValue("endDate", date)
                    }
                    beginDate={activeSortFilter.beginDate}
                    endDate={activeSortFilter.endDate}
                  />
                )}
              </section>
            )}
            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("orientation")}
                >
                  <h4>Orientation</h4>
                  {expandedMenus.includes("orientation") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("orientation") && (
                  <FilterSelector
                    searchBar={false}
                    loadFn={loadAssetOrientations}
                    numItems={4}
                    filters={assetOrientations.map((orientation) => ({
                      ...orientation,
                      label: orientation.name,
                      value: orientation.name,
                    }))}
                    value={activeSortFilter.filterOrientations}
                    setValue={(selected) =>
                      setSortFilterValue("filterOrientations", selected)
                    }
                  />
                )}
              </section>
            )}

            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => handleExpand("resolution")}
                >
                  <h4>Resolution</h4>
                  {expandedMenus.includes("resolution") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("resolution") && (
                  <ResolutionFilter
                    loadFn={loadAssetResolutions}
                    filters={assetResolutions.map((resolutions) => ({
                      ...resolutions,
                      value: resolutions.dpi,
                    }))}
                    value={activeSortFilter.filterResolutions}
                    setValue={(selected) =>
                      setSortFilterValue("filterResolutions", selected)
                    }
                  />
                )}
              </section>
            )}

            {!isFolder && (
              <section>
                <div
                  className={styles["expand-bar"]}
                  onClick={() => {
                    setSortFilterValue(
                      "dimensionsActive",
                      !expandedMenus.includes("dimensions")
                    );
                    handleExpand("dimensions");
                  }}
                >
                  <h4>Dimensions</h4>
                  {expandedMenus.includes("dimensions") ? (
                    <img
                      src={Utilities.arrowUpGrey}
                      className={styles["expand-icon"]}
                    />
                  ) : (
                    <img
                      src={Utilities.arrowGrey}
                      className={styles["expand-icon"]}
                    />
                  )}
                </div>
                {expandedMenus.includes("dimensions") && (
                  <DimensionsFilter
                    loadFn={loadAssetDimensionLimits}
                    heightDimensionLimits={{ min: minHeight, max: maxHeight }}
                    widthdimensionLimits={{ min: minWidth, max: maxWidth }}
                    handleHeight={({ value }) =>
                      setSortFilterValue("dimensionHeight", value)
                    }
                    handleWidth={({ value }) =>
                      setSortFilterValue("dimensionWidth", value)
                    }
                    valueHeight={
                      activeSortFilter.dimensionHeight || {
                        min: minHeight,
                        max: maxHeight,
                      }
                    }
                    valueWidth={
                      activeSortFilter.dimensionWidth || {
                        min: minWidth,
                        max: maxWidth,
                      }
                    }
                  />
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FilterContainer;
