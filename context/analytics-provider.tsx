import { useState } from "react";
import { AnalyticsContext } from "../context";
import { analyticsLayoutSection } from "../constants/analytics";
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
  const [limit, setLimit] = useState(3);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [apiEndpoint, setApiEndpoint] = useState("dashboard");
  const [initialRender, setInitialRender] = useState(true);
  const [downloadCSV, setDownloadCSV] = useState(false);
  const [tableRows, setTableRows] = useState(15);

  const analyticsValue = {
    apiEndpoint,
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
    tableRows,
    setApiEndpoint,
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
    setInitialRender,
    setTableRows,
  };

  return (
    <AnalyticsContext.Provider value={analyticsValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
