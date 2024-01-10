import { useEffect, useState } from "react";
import { AnalyticsContext } from "../context";
import { analyticsLayoutSection } from "../constants/analytics";
import AnalyticsApi from "../server-api/analytics";

export default ({ children }) => {
  const [activeSection, setActiveSection] = useState(analyticsLayoutSection.DASHBOARD);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    beginDate: new Date(),
    endDate: new Date()
  });
  const [sortBy, setSortBy] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
    sortBy,
    page,
    limit,
    error,
    data,
    loading,
    totalRecords,
    setActiveSection,
    setSearch,
    setFilter,
    setSortBy,
    setPage,
    setLimit,
    setError,
    setData,
    setLoading,
    setTotalRecords
  };


  const analyticsApiHandler = async () => {
    try {
      if (!search) {
        setLoading(true);
        setError('');
        setData(null);
      }

      const { data } = await AnalyticsApi.getAnalyticsData(apiEndpoint, {
        page,
        limit,
        search,
        sortBy,
        filter
      });

      setTotalRecords(data.totalRecords)
      setData(data.data);
      setLoading(false);
      setError('');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Users not found!');
      setData(null);
    }
  }

  useEffect(() => {
    analyticsApiHandler();
  }, [apiEndpoint, page, limit, search, sortBy, filter])

  const handleApiEndpoint = async () => {
    switch (activeSection) {
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
  }, [activeSection])

  return (
    <AnalyticsContext.Provider value={analyticsValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
