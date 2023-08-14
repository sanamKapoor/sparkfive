import copy from "copy-to-clipboard";
import moment from "moment";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

// APIs
import sharedLinksApi from "../../../server-api/shared-links";

// Components
import { AssetOps, Assets, ItemFields } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import Select from "../inputs/select";
import SpinnerOverlay from "../spinners/spinner-overlay";
import UserPhoto from "../user/user-photo";

// Utils
import toastUtils from "../../../utils/toast";
import ConfirmModal from "../modals/confirm-modal";
import ShareCollectionModal from "../modals/share-collection-modal";
import ShareModal from "../modals/share-modal";

// Constants
import { Waypoint } from "react-waypoint";
import { typeList } from "../../../config/data/shared-links";
import { colorList, statusList } from "../../../constants/shared-links";

export default function ShareLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentLink, setCurrentLink] = useState();
  const [status, setStatus] = useState(null);
  const [sharedBy, setSharedBy] = useState(null);
  const [type, setType] = useState(null);
  const [sharedWith, setSharedWith] = useState(null);
  const [shareByList, setShareByList] = useState([]);
  const [shareWithList, setShareWithList] = useState([]);
  const [page, setPage] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(0);
  const [sortData, setSortData] = useState({
    sortField: "expiredAt",
    sortType: "desc",
  });
  const [colorGroups, setColorGroups] = useState<any>({});
  const [editType, setEditType] = useState<string>("asset");

  const getFilterObject = (page) => {
    let filters: any = { page };
    if (sharedBy) {
      filters.sharedBy = sharedBy
        ? sharedBy.map((item) => item.value).join(",")
        : "";
    }

    if (type) {
      filters.type = type ? type.map((item) => item.value).join(",") : "";
    }

    if (sharedWith) {
      filters.sharedWith = sharedWith
        ? sharedWith.map((item) => item.value).join(",")
        : "";
    }

    if (status) {
      filters.status = status ? status?.value : "";
    }

    return filters;
  };

  const getRandomFromArr = (arr) => {
    const index = Math.floor(Math.random() * (arr.length ? arr.length - 1 : 0));
    return arr[index];
  };

  const formatDataColor = (data, groupData) => {
    const groups = groupData;
    const assignColor = () => {
      let availableColors = [];
      // Check if color is already in use
      Object.keys(groups).map((key) => {
        availableColors = colorList.filter((color) => color !== groups[key]);
      });

      // Has color to choose
      if (availableColors.length > 0) {
        return getRandomFromArr(availableColors);
      } else {
        // Not having, do random
        return getRandomFromArr(colorList);
      }
    };

    data.map((item) => {
      // Already have color, use it
      if (groups[item.user.name]) {
        item.color = groups[item.user.name];
      } else {
        // Not having yet
        item.color = assignColor();
        groups[item.user.name] = item.color;
      }
    });

    setColorGroups(groups);

    return data;
  };

  const getLinks = async (filter, refresh = true) => {
    // Show loading
    setLoading(true);
    const promises = [
      sharedLinksApi.getSharedByList(),
      sharedLinksApi.getSharedWithList(),
      sharedLinksApi.getSharedLinks(filter),
    ];

    const results = await Promise.all(promises);

    let { data } = results[2];

    if (data.next !== -1) {
      setPage(data.next - 1);
    }

    setNextPage(data.next);

    setShareByList(
      results[0].data.map((item) => {
        return { label: item, value: item };
      })
    );
    setShareWithList(
      results[1].data.map((item) => {
        return { label: item, value: item };
      })
    );

    if (refresh) {
      setColorGroups({});
      let dataWithColor = formatDataColor(data.results, {});
      setLinks(dataWithColor);
    } else {
      let dataWithColor = formatDataColor(
        links.concat(data.results),
        colorGroups
      );
      setLinks(dataWithColor);
    }

    setLoading(false);
  };

  const deleteLink = async () => {
    // Show loading
    setLoading(true);

    await sharedLinksApi.deleteLink(deleteId);

    getLinks(getFilterObject(1));
  };

  const updateLink = async (recipients, message, sharedLinkData) => {
    if (currentLink) {
      // Show loading
      setLoading(true);

      // Delete unnecessary field
      delete sharedLinkData.shareId;

      // @ts-ignore
      const result = await sharedLinksApi.updateLink(currentLink?.id, {
        sharedEmails: recipients,
        message,
        ...sharedLinkData,
        expiredPeriod: sharedLinkData.expiredPeriod?.value,
      });

      getLinks(getFilterObject(1));

      return result;
    }
  };

  const loadMore = () => {
    // still have page to load
    if (nextPage !== -1) {
      console.log(`load more`);
      setPage(page + 1);
      getLinks(
        {
          sharedBy: sharedBy
            ? sharedBy.map((item) => item.value).join(",")
            : "",
          sharedWith: sharedWith
            ? sharedWith.map((item) => item.value).join(",")
            : "",
          type: type ? type.map((item) => item.value).join(",") : "",
          status: status ? status?.value : "",
          page: page + 1,
          ...sortData,
        },
        false
      );
    }
  };

  const sort = (field, type) => {
    const data = { ...sortData };
    setSortData({
      ...data,
      sortField: field,
      sortType: type,
    });
  };

  const getSortType = (field) => {
    // Sort on different field
    if (sortData.sortField !== field) {
      return "desc"; // DESC as default
    } else {
      if (sortData.sortType === "asc") {
        return "desc";
      } else {
        return "asc";
      }
    }
  };

  const parseTypeName = (type: string, folderId) => {
    switch (type) {
      case "folder": {
        if (folderId) {
          return "Collection";
        } else {
          return "Portal";
        }
      }
      case "asset": {
        return "Files";
      }
      default: {
        return "Files";
      }
    }
  };

  useEffect(() => {
    setPage(0);
    setNextPage(-1);
    getLinks({
      sharedBy: sharedBy ? sharedBy.map((item) => item.value).join(",") : "",
      sharedWith: sharedWith
        ? sharedWith.map((item) => item.value).join(",")
        : "",
      type: type ? type.map((item) => item.value).join(",") : "",
      status: status ? status?.value : "",
      page: 1,
      ...sortData,
    });
  }, [sharedBy, sharedWith, status, type]);

  // Listen sort
  useEffect(() => {
    if (links.length > 0) {
      getLinks({
        sharedBy: sharedBy ? sharedBy.map((item) => item.value).join(",") : "",
        sharedWith: sharedWith
          ? sharedWith.map((item) => item.value).join(",")
          : "",
        type: type ? type.map((item) => item.value).join(",") : "",
        status: status ? status?.value : "",
        page: 1,
        ...sortData,
      });
    }
  }, [sortData]);

  return (
    <>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <div className={`${styles["header"]}`}>
          <div className={styles.label}>Filters</div>
          <div className={styles.form}>
            <div className={styles.field}>
              <Select
                options={shareByList}
                onChange={(value) => {
                  setSharedBy(value);
                }}
                placeholder={"Shared by"}
                styleType="regular"
                value={sharedBy}
                isMulti={true}
                isClearable={true}
              />
            </div>
            <div className={styles.field}>
              <Select
                options={typeList}
                onChange={(value) => {
                  setType(value);
                }}
                placeholder={"Type"}
                styleType="regular"
                value={type}
                isMulti={true}
                isClearable={true}
              />
            </div>
            <div className={styles.field}>
              <Select
                options={shareWithList}
                onChange={(value) => {
                  setSharedWith(value);
                }}
                placeholder={"Share with"}
                styleType="regular"
                value={sharedWith}
                isMulti={true}
                isClearable={true}
              />
            </div>
            <div className={styles.field}>
              <Select
                isClearable={true}
                options={statusList}
                onChange={(value) => {
                  setStatus(value);
                }}
                placeholder={"Status"}
                styleType="regular"
                value={status}
              />
            </div>
          </div>
        </div>
        {links.length === 0 && (
          <div className={"row align-center justify-content-center m-t-30"}>
            No data
          </div>
        )}
        {links.length > 0 && (
          <div
            className={`row align-center ${styles["row-heading"]} ${styles.desktop} font-weight-600`}
          >
            <div
              className={
                "col-10 col-sm-100 cursor-pointer d-flex align-items-center"
              }
              onClick={() => {
                sort("createdAt", sortData.sortType === "asc" ? "desc" : "asc");
              }}
            >
              <span className={"font-12"}>Date Created</span>
              <img
                src={Assets.arrowDown}
                className={`
                          ${styles["sort-icon"]} 
                          ${
                            sortData.sortField === "createdAt"
                              ? styles["sort-icon-active"]
                              : ""
                          } 
                          ${sortData.sortType === "asc" ? "" : styles.desc}
                        `}
              />
            </div>
            <div
              className={
                "col-10 col-sm-100 cursor-pointer d-flex justify-content-center align-items-center"
              }
              onClick={() => {
                sort("name", getSortType("name"));
              }}
            >
              <span className={"font-12"}>Name</span>
            </div>
            <div
              className={
                "col-10 col-sm-100 cursor-pointer d-flex justify-content-center align-items-center"
              }
              onClick={() => {
                sort("type", getSortType("type"));
              }}
            >
              <span className={"font-12"}>Type</span>
            </div>
            <div
              className={
                "col-15 col-sm-100 cursor-pointer d-flex justify-content-center align-items-center"
              }
              onClick={() => {
                sort("user.name", getSortType("user.name"));
              }}
            >
              <span className={"font-12"}>Shared By</span>
            </div>
            <div
              className={
                "col-25 col-sm-100 justify-content-center cursor-pointer d-flex align-items-center"
              }
              onClick={() => {
                sort("sharedLink", getSortType("sharedLink"));
              }}
            >
              <span className={"font-12"}>Link</span>
            </div>
            <div
              className={
                "col-10 col-sm-100 cursor-pointer d-flex justify-content-center align-items-center"
              }
              onClick={() => {
                sort("sharedCount", getSortType("sharedCount"));
              }}
            >
              <span className={"font-12"}>Share With</span>
            </div>
            <div
              className={
                "col-15 col-sm-100 cursor-pointer d-flex justify-content-center align-items-center"
              }
              onClick={() => {
                sort("expiredAt", getSortType("expiredAt"));
              }}
            >
              <span className={"font-12"}>Expiration Date</span>
              <img
                src={Assets.arrowDown}
                className={`
                          ${styles["sort-icon"]} 
                          ${
                            sortData.sortField === "expiredAt"
                              ? styles["sort-icon-active"]
                              : ""
                          } 
                          ${sortData.sortType === "asc" ? "" : styles.desc}
                        `}
              />
            </div>
            <div className={"col-5"}></div>
          </div>
        )}
        <div
          className={`row align-center ${styles["row-heading"]} ${styles.mobile} font-weight-600`}
        >
          Image Name
        </div>
        <div className={styles.desktop}>
          {links.map((link, index) => {
            return (
              <div
                className={`row align-center ${styles["data-row"]}`}
                key={index}
              >
                <div className={"col-10 d-flex align-items-center col-sm-100"}>
                  <span className={"font-12"}>
                    {moment(link.createdAt).format("MM/DD/YY")}
                  </span>
                </div>
                <div
                  className={
                    "col-10 d-flex justify-content-center align-items-center col-sm-100"
                  }
                >
                  <span
                    style={{ backgroundColor: link.color }}
                    className={`${styles["name-tag"]} font-12`}
                  >
                    {link.name || "None"}
                  </span>
                </div>
                <div
                  className={
                    "col-10 d-flex justify-content-center align-items-center col-sm-100 word-break-text"
                  }
                >
                  <span className={`${styles["name-tag"]} font-12`}>
                    {parseTypeName(link.type, link.singleSharedCollectionId)}
                  </span>
                </div>
                <div
                  className={
                    "col-15 d-flex justify-content-center align-items-center col-sm-100"
                  }
                >
                  <UserPhoto
                    photoUrl={link.user.profilePhoto || ""}
                    extraClass={styles.profile}
                    sizePx={35}
                  />
                  <span className={"m-l-15 font-12"}>{link.user.name}</span>
                </div>
                <div
                  className={
                    "col-25 d-flex justify-content-center align-items-center word-break-text col-sm-100"
                  }
                >
                  <span className={"font-12"}>
                    {link.type === "folder"
                      ? !link.team.advancedCollectionShareLink
                        ? `${process.env.CLIENT_BASE_URL}/collections/${link.collectionLink}`
                        : link.sharedLink
                      : link.sharedLink}
                  </span>
                  <IconClickable
                    additionalClass={`${styles["action-button"]} m-l-15 cursor-pointer`}
                    src={AssetOps[`copy${""}`]}
                    tooltipText={"Copy"}
                    tooltipId={"Copy"}
                    onClick={() => {
                      copy(
                        link.type === "folder"
                          ? !link.team.advancedCollectionShareLink
                            ? `${process.env.CLIENT_BASE_URL}/collections/${link.collectionLink}`
                            : link.sharedLink
                          : link.sharedLink
                      );
                      toastUtils.bottomSuccess("Link copied");
                    }}
                  />
                </div>
                <div
                  className={
                    "col-10 d-flex justify-content-center align-items-center col-sm-100"
                  }
                >
                  <img
                    src={ItemFields.member}
                    alt="member icon"
                    width={`10px`}
                  />
                  <span className={"m-l-15 font-weight-400 font-14"}>
                    {link.sharedCount}
                  </span>
                </div>
                <div
                  className={
                    "col-15 d-flex justify-content-center align-items-center col-sm-100"
                  }
                >
                  <span className={"font-12"}>
                    {link.expiredAt && link.expired
                      ? moment(link.expiredAt).format("MM/DD/YY")
                      : "None"}
                  </span>
                </div>
                <div
                  className={
                    "col-5 d-flex justify-content-center align-items-center col-sm-100"
                  }
                >
                  <IconClickable
                    additionalClass={styles["action-button"]}
                    src={AssetOps[`edit`]}
                    tooltipText={"Edit"}
                    tooltipId={"Edit"}
                    onClick={() => {
                      setEditType(link.type);
                      setCurrentLink(link);
                      setShowEditModal(true);
                    }}
                  />
                  <IconClickable
                    additionalClass={`${styles["action-button"]} m-l-10`}
                    src={AssetOps[`delete`]}
                    tooltipText={"Delete"}
                    tooltipId={"Delete"}
                    onClick={() => {
                      setDeleteId(link.id);
                      setDeleteOpen(true);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.mobile}>
          {links.map((link, index) => {
            return (
              <div className={`row ${styles["data-row"]}`} key={index}>
                <div className="d-flex align-items-center">
                  <div
                    className={`${styles["file-name}"]} font-14 font-weight-600`}
                  >
                    {link.name || "None"}
                  </div>
                  <div
                    className={
                      "d-flex justify-content-center align-items-center m-l-10"
                    }
                  >
                    <IconClickable
                      additionalClass={styles["action-button"]}
                      src={AssetOps[`edit`]}
                      tooltipText={"Edit"}
                      tooltipId={"Edit"}
                      onClick={() => {
                        setEditType(link.type);
                        setCurrentLink(link);
                        setShowEditModal(true);
                      }}
                    />
                    <IconClickable
                      additionalClass={`${styles["action-button"]} m-l-10`}
                      src={AssetOps[`delete`]}
                      tooltipText={"Delete"}
                      tooltipId={"Delete"}
                      onClick={() => {
                        setDeleteId(link.id);
                        setDeleteOpen(true);
                      }}
                    />
                  </div>
                </div>
                <div className={"row align-items-center gap-20"}>
                  <div className="d-flex align-items-center">
                    <UserPhoto
                      photoUrl={link.user.profilePhoto || ""}
                      extraClass={styles.profile}
                      sizePx={19}
                    />
                    <span className={"m-l-10 font-12"}>{link.user.name}</span>
                  </div>
                  <span className={"font-12"}>
                    Date Created: {moment(link.createdAt).format("MM/DD/YY")}
                  </span>
                  <div className={"d-flex align-items-center"}>
                    <span className={"font-12"}>Copy Link</span>
                    <IconClickable
                      additionalClass={`${styles["action-button"]} m-l-10 cursor-pointer`}
                      src={AssetOps[`copy${""}`]}
                      tooltipText={"Copy"}
                      tooltipId={"Copy"}
                      onClick={() => {
                        copy(
                          link.type === "folder"
                            ? !link.team.advancedCollectionShareLink
                              ? `${process.env.CLIENT_BASE_URL}/collections/${link.collectionLink}`
                              : link.sharedLink
                            : link.sharedLink
                        );
                        toastUtils.bottomSuccess("Link copied");
                      }}
                    />
                  </div>
                  <span className={`font-12`}>
                    Type:{" "}
                    {parseTypeName(link.type, link.singleSharedCollectionId)}
                  </span>
                  <span className={"font-12"}>
                    Expiration Date:{" "}
                    {link.expiredAt && link.expired
                      ? moment(link.expiredAt).format("MM/DD/YY")
                      : "None"}
                  </span>
                  <div className={"d-flex align-items-center"}>
                    <img
                      src={ItemFields.member}
                      alt="member icon"
                      width={`10px`}
                    />
                    <span className={"m-l-10 font-weight-400 font-14"}>
                      {link.sharedCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {<Waypoint onEnter={loadMore} fireOnRapidScroll={false} />}

        {loading && <SpinnerOverlay />}

        <ConfirmModal
          closeModal={() => setDeleteOpen(false)}
          confirmAction={() => {
            deleteLink();
            setDeleteOpen(false);
          }}
          confirmText={"Delete"}
          message={"Are you sure you want to delete this link?"}
          modalIsOpen={deleteOpen}
        />

        {editType === "asset" && (
          <ShareModal
            modalIsOpen={showEditModal}
            closeModal={() => {
              setShowEditModal(false);
            }}
            shareAssets={updateLink}
            getShareLink={() => {}}
            currentShareLink={currentLink}
            title={"Update shared link"}
          />
        )}
        {editType === "folder" && (
          <ShareCollectionModal
            modalIsOpen={showEditModal}
            closeModal={() => {
              setShowEditModal(false);
            }}
            shareAssets={updateLink}
            getShareLink={() => {}}
            currentShareLink={currentLink}
            title={"Update shared link"}
          />
        )}
      </div>
    </>
  );
}
