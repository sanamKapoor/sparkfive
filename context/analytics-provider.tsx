import { useEffect, useState } from "react";
import { AnalyticsContext } from "../context";
import { analyticsLayoutSection } from "../constants/analytics";
import AnalyticsApi from "../server-api/analytics";
import { calculateBeginDate } from "../config/data/filter";

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
  const [limit, setLimit] = useState(5);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiEndpoint, setApiEndpoint] = useState("dashboard");
  const [initialRender, setInitialRender] = useState(false);

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
    totalRecords,
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
    setTotalRecords
  };


  const analyticsApiHandler = async () => {
    try {
      if (initialRender) {
        setLoading(true);
        setError('');
        setData(null);
        setTotalRecords(0);
      }

      const { data } = await AnalyticsApi.getAnalyticsData(apiEndpoint, {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        filter
      });

      setTotalRecords(data.totalRecords)
      setData(data.data);
      setLoading(false);
      setError('');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Data not found.');
      setData(null);
      setTotalRecords(0);
    }
  }

  useEffect(() => {
    analyticsApiHandler();
  }, [apiEndpoint, page, limit, search, sortBy, sortOrder, filter])

  useEffect(() => {
    setInitialRender(false);
  }, [page, limit, search, sortBy, sortOrder, filter])

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
