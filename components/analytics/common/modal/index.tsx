import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { insights } from "../../../../assets";
import { calculateBeginDate } from "../../../../config/data/filter";
import { AnalyticsActiveModal, InsightsApiEndpoint, TableBodySection } from "../../../../constants/analytics";
import { SOMETHING_WENT_WRONG } from "../../../../constants/messages";
import {
    userActivityModalArrowColumns,
    userActivityModalcolumns,
} from "../../../../data/analytics";
import AnalyticsApi from "../../../../server-api/analytics";
import { getCSVFileName } from "../../../../utils/analytics";
import DateFormatter from "../../../../utils/date";
import Loader from "../../../common/UI/Loader/loader";
import Button from "../../../common/buttons/button";
import IconClickable from "../../../common/buttons/icon-clickable";
import ChartComp from "../chart";
import Datefilter from "../date-filter";
import Download from "../download-button";
import Heading from "../header/heading";
import NoData from "../no-data";
import Pagination from "../pagination";
import TableData from "../table";
import toastUtils from "./../../../../utils/toast";
import styles from "./modal.module.css";
import DownloadChart from "../chart/download-button";

const Modal = ({ section, setShowModal, id }: {
  section: string,
  setShowModal: (boolean) => void,
  id: string
}) => {
  const [apiData, setApiData] = useState([]);
  const [activeModalSection, setActiveModalSection] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [downloadCSV, setDownloadCSV] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [modalHeaderData, setModalHeaderData] = useState(null);
  const [modalData, setModalData] = useState({
    search: "",
    filter: {
      endDate: new Date(),
      beginDate: calculateBeginDate(7, 1),
    },
    customDates: "",
    sortBy: "",
    sortOrder: true,
    page: 1,
    limit: 10,
    error: "",
    loading: false,
    tableLoading: false,
    totalRecords: 0,
  });

  const handleApiCall = async (defaultPage?: number) => {
    const { page, limit, search, sortBy, sortOrder, filter } = modalData;
    try {
      if (initialRender) {
        setModalData((prev) => ({
          ...prev,
          loading: true,
          tableLoading: false,
          error: "",
          totalRecords: 0,
        }));
        setApiData([]);
      } else {
        setModalData((prev) => ({
          ...prev,
          tableLoading: true
        }))
      }

      if (downloadCSV) {
        setModalData(prev => ({
          ...prev,
          loading: true,
          tableLoading: false
        }))
      }

      let payload: Record<string, unknown> = {
        page: defaultPage ? defaultPage : page,
        limit,
        search,
        sortBy,
        sortOrder,
        filter,
        downloadCSV,
      }

      if (apiEndpoint.includes(InsightsApiEndpoint.TEAM)) {
        payload = {
          filter,
        };
      }

      const { data } = await AnalyticsApi.getAnalyticsData(apiEndpoint, payload);

      if (downloadCSV) {
        const fileData = new Blob([data], {
          type: "text/csv;charset=utf-8",
        });

        const { fileName, successMsg } = getCSVFileName(activeModalSection);
        saveAs(fileData, fileName);
        toastUtils.success(successMsg);
      } else {
        if (apiEndpoint.includes(InsightsApiEndpoint.TEAM)) {
          setApiData(data);
        } else {
          setModalData(prev => ({ ...prev, totalRecords: data.totalRecords }))
          setApiData(data.data);
          setModalHeaderData(data?.userData);
        }
      }

      initialRender ? setModalData(prev => ({ ...prev, loading: false })) : setModalData(prev => ({ ...prev, tableLoading: false }))
      if (downloadCSV) {
        setModalData(prev => ({
          ...prev,
          loading: false
        }))
        setDownloadCSV(false)
      }
      setModalData(prev => ({ ...prev, error: '' }))
    } catch (error) {
      initialRender ? setModalData(prev => ({ ...prev, loading: false })) : setModalData(prev => ({ ...prev, tableLoading: false }))
      if (downloadCSV) {
        setModalData(prev => ({
          ...prev,
          loading: false
        }))
        setDownloadCSV(false)
      }
      setModalData((prev) => ({
        ...prev,
        error: SOMETHING_WENT_WRONG,
        totalRecords: 0,
      }));
      setApiData([]);
    }
    if (initialRender) setInitialRender(false)
  };

  const init = () => {
    switch (section) {
      case AnalyticsActiveModal.USER_ACTIVITY:
        setApiEndpoint(`${InsightsApiEndpoint.USER_ACTIVITY}?userId=${id}`);
        setActiveModalSection(AnalyticsActiveModal.USER_ACTIVITY);
        break;
      case AnalyticsActiveModal.ASSET_CHART:
        setApiEndpoint(`${InsightsApiEndpoint.TEAM}?assetId=${id}`);
        setActiveModalSection(AnalyticsActiveModal.ASSET_CHART);
        break;
    }
  };

  useEffect(() => {
    init();
    setInitialRender(true)
  }, []);

  useEffect(() => {
    if (!initialRender) {
      handleApiCall(1);
      setModalData(prev => ({
        ...prev,
        page: null
      }))
    }
  }, [modalData.limit, modalData.search, modalData.sortBy, modalData.sortOrder, modalData.filter])

  useEffect(() => {
    if (!initialRender && typeof modalData.page === 'number') {
      handleApiCall();
    }
  }, [modalData.page])

  useEffect(() => {
    if (apiEndpoint && initialRender) handleApiCall();
  }, [apiEndpoint, initialRender])

  useEffect(() => {
    if (downloadCSV) handleApiCall();
  }, [downloadCSV])

  const handleCloseModal = () => {
    setShowModal(false);
    setInitialRender(true);
    setActiveModalSection('');
    setApiEndpoint('');
  };

  const handleSearch = (search: string) => {
    setModalData(prev => ({
      ...prev,
      search
    }))
  }

  const handlePage = (page: number) => {
    setModalData(prev => ({
      ...prev,
      page
    }))
  }

  const handleFilter = (filter) => {
    setModalData(prev => ({
      ...prev,
      filter
    }))
  }

  const handleCustomDate = (customDates) => {
    setModalData(prev => ({
      ...prev,
      customDates
    }))
  }

  const handleClearSorting = () => {
    setModalData(prev => ({
      ...prev,
      sortBy: '',
      sortOrder: true
    }))
  }

  console.log({ apiData });


  const { loading, error, sortBy, limit, totalRecords } = modalData;
  return (
    <div className={`${styles.backdrop}`}>
      <section className={`${styles["user-modal-outer"]}`}>
        {
          loading ? <Loader /> :
            (error) ?
              <>
                <div className={`${styles["data-close-icon"]}`}>
                  <IconClickable
                    src={insights.insightClose}
                    additionalClass={styles.closeIcon}
                    text={""}
                    onClick={handleCloseModal}
                  />
                </div>
                <NoData message={error} />
              </>
              :
              activeModalSection === AnalyticsActiveModal.ASSET_CHART
                ?
                <div className={`${styles["user-modal"]}`}>
                  <div className= {`${styles["user-chart-modal"]}`}>
                  <Heading mainText={apiData?.asset?.name || 'Asset Chart'} />
                  <div className= {`${styles["user-filters"]}`} >
                    <Datefilter
                      filter={modalData.filter}
                      customDates={modalData.customDates}
                      setFilter={handleFilter}
                      setCustomDates={handleCustomDate}
                    />
                    <div style={{marginLeft:"20px"}}>
                    <DownloadChart fileName={apiData?.asset?.name || 'Asset Chart'} />
                    </div>
                
                    <div className={`${styles["data-close-icon"]}`}>
                      <IconClickable
                        src={insights.insightClose}
                        additionalClass={styles.closeIcon}
                        text={""}
                        onClick={handleCloseModal}
                      />
                    </div>
                  </div>
                  </div>
                  <ChartComp data={apiData} fileName={apiData?.asset?.name && (apiData?.asset?.name).split('.')[0]} />
                </div>
                :
                <div className={`${styles["user-modal"]}`}>
                  {
                    (modalHeaderData && modalHeaderData?.name) &&
                    <div className={styles["profile-img-wrapper"]}>
                      <div className={`${styles["image-wrapper"]}`}>
                        {modalHeaderData?.profilePhoto !== null ? (
                          <img src={modalHeaderData?.profilePhoto} alt="user" className={styles.userImage} />
                        ) : (
                          <div className={styles.userAvatar}>{modalHeaderData?.name.charAt(0).toUpperCase()}</div>
                        )}
                      </div>
                      <span className={`${styles["user-name"]}`}>{modalHeaderData?.name}</span>
                    </div>
                  }
                  <div className={`${styles["user-detail-top"]}  ${styles["web-view"]}`}>
                    <div className={`${styles["user-detail"]}`}>
                      {modalHeaderData && modalHeaderData?.email &&
                        <p>
                          Email: <span>{modalHeaderData?.email}</span>
                        </p>}
                      {modalHeaderData && modalHeaderData?.lastSession &&
                        <p>Last Session Date: <span>{DateFormatter.analyticsDateFormatter(modalHeaderData?.lastSession)}</span></p>}
                    </div>
                    <div className={`${styles["table-header-tabs"]}`}>
                      {/* <SearchButton label="Search" setSearch={handleSearch} /> */}
                      <Datefilter
                        filter={modalData.filter}
                        customDates={modalData.customDates}
                        setFilter={handleFilter}
                        setCustomDates={handleCustomDate}
                      />
                      <Download setDownloadCSV={setDownloadCSV} />
                      <IconClickable
                        src={insights.insightClose}
                        additionalClass={styles.closeIcon}
                        text={""}
                        onClick={handleCloseModal}
                      />
                    </div>
                  </div>
                  {/* for laptop */}
                  <div className={`${styles["laptop-view"]}`}>
                    <div className={`${styles["heading-wrap"]}`}>
                      <div className={`${styles["laptop-view-wrap"]}`}>
                        <div className={`${styles["user-detail"]}`}>
                          {modalHeaderData && modalHeaderData?.email &&
                            <p>
                              Email: <span>{modalHeaderData?.email}</span>
                            </p>}
                          {modalHeaderData && modalHeaderData?.lastSession &&
                            <p>Last Session Date: <span>{DateFormatter.analyticsDateFormatter(modalHeaderData?.lastSession)}</span></p>}
                        </div>
                        <div>
                          {/* <SearchButton label="Search" setSearch={handleSearch} /> */}
                        </div>
                      </div>
                      <div className={`${styles["table-header-tabs"]}`}>
                        <Datefilter
                          filter={modalData.filter}
                          customDates={modalData.customDates}
                          setFilter={handleFilter}
                          setCustomDates={handleCustomDate}
                        />
                        <Download setDownloadCSV={setDownloadCSV} />
                        <IconClickable
                          src={insights.insightClose}
                          additionalClass={styles.closeIcon}
                          text={""}
                          onClick={() => setShowModal(false)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* for mobile */}
                  <div className={`${styles["mobile-view"]}`}>
                    <div className={`${styles["heading-wraps"]}`}>
                      <div className={`${styles["teb-mob-view"]}`}>
                        <div className={`${styles["user-detail"]}`}>
                          {modalHeaderData && modalHeaderData?.email &&
                            <p>
                              Email: <span>{modalHeaderData?.email}</span>
                            </p>}
                          {modalHeaderData && modalHeaderData?.lastSession &&
                            <p>Last Session Date: <span>{DateFormatter.analyticsDateFormatter(modalHeaderData?.lastSession)}</span></p>}
                        </div>
                        <div className={`${styles["close-mob"]}`}>
                          <IconClickable
                            src={insights.insightClose}
                            additionalClass={styles.closeIcon}
                            text={""}
                            onClick={() => setShowModal(false)}
                          />
                        </div>
                      </div>
                      <div className={`${styles["filter-mob"]}`}>
                        <Datefilter
                          filter={modalData.filter}
                          customDates={modalData.customDates}
                          setFilter={handleFilter}
                          setCustomDates={handleCustomDate}
                        />
                        <Download setDownloadCSV={setDownloadCSV} />
                      </div>
                    </div>

                    <div style={{ marginTop: "22px" }}>
                      {/* <SearchButton label="Search" setSearch={handleSearch} /> */}
                    </div>
                  </div>
                  {(apiData && apiData?.length > 0 && sortBy) && <div className={`${styles["clear-sort"]}`}><Button text="Clear sorting" className={'clear-sort-btn'} onClick={handleClearSorting} /></div>}
                  <TableData
                    data={apiData}
                    apiData={apiData}
                    columns={userActivityModalcolumns}
                    arrowColumns={userActivityModalArrowColumns}
                    tableLoading={modalData.tableLoading}
                    totalRecords={modalData.totalRecords}
                    sortBy={modalData.sortBy}
                    sortOrder={modalData.sortOrder}
                    setSortBy={(val: string) => setModalData(prev => ({ ...prev, sortBy: val }))}
                    setSortOrder={(val: boolean) => setModalData(prev => ({ ...prev, sortOrder: val }))}
                    tableFor={TableBodySection.USER_ACTIVITY}
                  />
                  {apiData && apiData?.length > 0 && totalRecords > limit &&
                    <Pagination
                      page={modalData.page}
                      limit={modalData.limit}
                      totalRecords={modalData.totalRecords}
                      setPage={handlePage}
                    />}
                </div>
        }
      </section>
    </div>
  );
};

export default Modal;
