import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { calculateBeginDate } from "../config/data/filter";
import {
    AnalyticsRoutes,
    DASHBOARD_REC_LIMIT,
    InsightsApiEndpoint,
    LIMIT,
    PAGE
} from "../constants/analytics";
import { SOMETHING_WENT_WRONG } from "../constants/messages";
import AnalyticsApi from "../server-api/analytics";
import { getCSVFileName } from "../utils/analytics";
import toastUtils from "./../utils/toast";

const useInsights = ({ section, endpoint }: { section?: string; endpoint?: string }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    endDate: new Date(),
    beginDate: calculateBeginDate(7, 1),
  });
  const [customDates, setCustomDates] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(true);
  const [page, setPage] = useState(PAGE);
  const [limit, setLimit] = useState(LIMIT);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [downloadCSV, setDownloadCSV] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");

  const analyticsApiHandler = async (defaultPage?: number) => {
    if (!apiEndpoint) return;
    try {
      setLoading(true);
      setError("");
      setData([]);
      setTotalRecords(0);

      let payload: Record<string, unknown> = {
        page: defaultPage ? defaultPage : page,
        limit: router.pathname === AnalyticsRoutes.DASHBOARD ? DASHBOARD_REC_LIMIT : limit,
        search,
        sortBy,
        sortOrder,
        filter,
        downloadCSV,
      };

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

        const { fileName, successMsg } = getCSVFileName(activeSection);
        saveAs(fileData, fileName);
        toastUtils.success(successMsg);
      } else {
        if (apiEndpoint.includes(InsightsApiEndpoint.TEAM)) {
          setData(data);
        } else {
          setTotalRecords(data.totalRecords);
          setData(data.data);
        }
      }

      setLoading(false);
      setError("");
      if (downloadCSV) setDownloadCSV(false);
    } catch (error) {
      setLoading(false);
      if (downloadCSV) setDownloadCSV(false);
      setError(SOMETHING_WENT_WRONG);
      setData([]);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    if (downloadCSV) analyticsApiHandler();
  }, [downloadCSV]);

  useEffect(() => {
    analyticsApiHandler(1);
    setPage(null);
  }, [limit, search, sortBy, sortOrder, filter]);

  useEffect(() => {
    if (typeof page === "number") {
      analyticsApiHandler();
    }
  }, [page]);

  useEffect(() => {
    setActiveSection(section);
  }, [section]);

  useEffect(() => {
    setApiEndpoint(endpoint);
  }, [endpoint]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    customDates,
    setCustomDates,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
    totalRecords,
    setTotalRecords,
    downloadCSV,
    setDownloadCSV
  };
};

export default useInsights;
