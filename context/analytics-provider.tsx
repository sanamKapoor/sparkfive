import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { AnalyticsContext } from "../context";
import { analyticsLayoutSection } from "../constants/analytics";
import AnalyticsApi from "../server-api/analytics";
import { calculateBeginDate } from "../config/data/filter";
import toastUtils from "../utils/toast";
import { SOMETHING_WENT_WRONG, USERS_DOWNLOADED } from "../constants/messages";

export default ({ children }) => {
  const [activeSection, setActiveSection] = useState(analyticsLayoutSection.DASHBOARD);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    endDate: new Date(),
    beginDate: calculateBeginDate(7, 1)
  });
  const [customDates, setCustomDates] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiEndpoint, setApiEndpoint] = useState("dashboard");
  const [initialRender, setInitialRender] = useState(false);
  const [downloadCSV, setDownloadCSV] = useState(false);

  const analyticsValue = {
    activeSection,
    search,
    filter,
    customDates,
    sortBy,
    sortOrder,
    page,
    limit,
    error,
    data,
    loading,
    tableLoading,
    totalRecords,
    downloadCSV,
    initialRender,
    setActiveSection,
    setSearch,
    setFilter,
    setCustomDates,
    setSortBy,
    setSortOrder,
    setPage,
    setLimit,
    setError,
    setData,
    setLoading,
    setTableLoading,
    setTotalRecords,
    setDownloadCSV,
    setInitialRender
  };


  const analyticsApiHandler = async () => {
    try {
      if (initialRender) {
        setLoading(true);
        setTableLoading(false);
        setError('');
        setData([]);
        setTotalRecords(0);
      } else {
        setTableLoading(true)
      }

      const { data } = await AnalyticsApi.getAnalyticsData(apiEndpoint, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        filter,
        downloadCSV
      });

      if (data.csvData) {
        const fileData = new Blob([data], {
          type: "text/csv;charset=utf-8",
        });
        saveAs(fileData, `Users-Details-${new Date().getTime()}`);
        toastUtils.success(USERS_DOWNLOADED);
      } else {
        setTotalRecords(data.totalRecords)
        setData(data.data);
      }

      initialRender ? setLoading(false) : setTableLoading(false)
      setError('');
      if (downloadCSV) setDownloadCSV(false);
    } catch (error) {
      initialRender ? setLoading(false) : setTableLoading(false)
      setError(SOMETHING_WENT_WRONG);
      setData([]);
      setTotalRecords(0);
    }
  }

  useEffect(() => {
    analyticsApiHandler();
  }, [apiEndpoint, page, limit, search, sortBy, sortOrder, filter])

  useEffect(() => {
    if (downloadCSV) analyticsApiHandler();
  }, [downloadCSV])

  useEffect(() => {
    setInitialRender(false);
  }, [page, limit, search, sortBy, sortOrder, filter])

  // useEffect(() => {
  //   if (page !== 1) setPage(1);
  // }, [search, filter, limit, sortBy])

  const handleApiEndpoint = async () => {
    switch (activeSection) {
      case analyticsLayoutSection.DASHBOARD:
      case analyticsLayoutSection.ACCOUNT_USERS:
        setApiEndpoint("users")
        break;
      default:
        setApiEndpoint("dashboard")
    }
  }

  useEffect(() => {
    handleApiEndpoint();
    setInitialRender(true);
    setSearch('');
    setPage(1);
    setSortBy('');
    setSortOrder(true);
    setFilter({
      endDate: new Date(),
      beginDate: calculateBeginDate(7, 1)
    })
  }, [activeSection])

  return (
    <AnalyticsContext.Provider value={analyticsValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
