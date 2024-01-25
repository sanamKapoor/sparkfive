import { useState } from "react";
import { AnalyticsContext } from "../context";
import { analyticsLayoutSection } from "../constants/analytics";
import { calculateBeginDate } from "../config/data/filter";
import { DashboardSectionI } from "../interfaces/analytics";

export default ({ children }) => {
  const [activeSection, setActiveSection] = useState(analyticsLayoutSection.DASHBOARD);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    endDate: new Date(),
    beginDate: calculateBeginDate(7, 1)
  });
  const [customDates, setCustomDates] = useState(false);
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

  // Dashboard States
  const [dashboardView, setDashboardView] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [dashboardSections, setDashboardSections] = useState<DashboardSectionI[]>([]);

  const [filterFor, setFilterFor] = useState([]);
  const [customDatesFor, setCustomDatesFor] = useState([]);
  const [sortFor, setSortFor] = useState([]);
  const [errorFor, setErrorFor] = useState([]);
  const [loadingFor, setLoadingFor] = useState([]);
  const [tableLoadingFor, setTableLoadingFor] = useState([]);

  const analyticsValue = {
    apiEndpoint,
    activeSection,
    search,
    filter,
    filterFor,
    customDates,
    sortBy,
    sortOrder,
    sortFor,
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
    dashboardView,
    dashboardData,
    customDatesFor,
    errorFor,
    loadingFor,
    tableLoadingFor,
    setApiEndpoint,
    setActiveSection,
    setSearch,
    setFilter,
    setCustomDates,
    setSortBy,
    setSortOrder,
    setPage,
    setLimit,
    setSortFor,
    setFilterFor,
    setError,
    setData,
    setLoading,
    setTableLoading,
    setTotalRecords,
    setDownloadCSV,
    setInitialRender,
    setTableRows,
    setDashboardView,
    setDashboardData,
    setCustomDatesFor,
    setErrorFor,
    setLoadingFor,
    setTableLoadingFor,
  };

  return (
    <AnalyticsContext.Provider value={analyticsValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
