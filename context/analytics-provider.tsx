import { useState } from "react";
import { AnalyticsContext } from "../context";
import { analyticsLayoutSection } from "../constants/analytics";

export default ({ children }) => {
    const [activeSection, setActiveSection] = useState(analyticsLayoutSection.DASHBOARD);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);

  const analyticsValue = {
    activeSection,
    search,
    page,
    limit,
    error,
    data,
    loading,
    totalRecords,
    setActiveSection,
    setSearch,
    setPage,
    setLimit,
    setError,
    setData,
    setLoading,
    setTotalRecords
  };

  return (
    <AnalyticsContext.Provider value={analyticsValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
