import { useContext, useState } from "react";
import { AnalyticsContext } from "../context";
import { calculateBeginDate } from "../config/data/filter";

export const useAnalyticsHold = () => {
  const {
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
  } = useContext(AnalyticsContext);

  const [tableData, setTableData] = useState<any>({});

  const captureState = () => {
    setTableData({
      initialRender,
      downloadCSV,
      totalRecords,
      tableLoading,
      loading,
      data,
      error,
      limit,
      page,
      sortOrder,
      sortBy,
      customDates,
      filter,
      search,
      activeSection,
      apiEndpoint,
    });
  };

  const restoreState = () => {
    setApiEndpoint(tableData?.apiEndpoint || ''),
    setActiveSection(tableData?.activeSection || ''),
    setSearch(tableData?.search || ''),
    setFilter(tableData?.filter || {
        endDate: new Date(),
        beginDate: calculateBeginDate(7, 1)
      }),
    setCustomDates(tableData?.customDates || false),
    setSortBy(tableData?.sortBy || ''),
    setSortOrder(tableData?.sortOrder || true),
    setPage(tableData?.page || 1),
    setLimit(tableData?.limit || 3),
    setError(tableData?.error || ''),
    setData(tableData?.data || []),
    setLoading(tableData?.loading || false),
    setTableLoading(tableData?.tableLoading || false),
    setTotalRecords(tableData?.totalRecords || 0),
    setDownloadCSV(tableData?.downloadCSV || false),
    setInitialRender(tableData?.initialRender || true)
  }

  return {
    captureState,
    restoreState
  }
};
