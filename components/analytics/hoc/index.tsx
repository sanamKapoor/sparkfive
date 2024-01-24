import { saveAs } from "file-saver";
import { useContext, useEffect } from "react";
import { calculateBeginDate } from "../../../config/data/filter";
import { analyticsLayoutSection } from "../../../constants/analytics";
import { SOMETHING_WENT_WRONG, USERS_DOWNLOADED } from "../../../constants/messages";
import { AnalyticsContext } from "../../../context";
import AnalyticsApi from "../../../server-api/analytics";
import { getCSVFileName } from "../../../utils/analytics";
import toastUtils from "./../../../utils/toast";

const AnalyticsHOC = (Component) => {
    return (props) => {

        const {
            page, limit, search, sortBy, sortOrder, filter, downloadCSV, apiEndpoint, initialRender, activeSection,
            setApiEndpoint,
            setSearch,
            setFilter,
            setSortBy,
            setSortOrder,
            setPage,
            setError,
            setData,
            setLoading,
            setTableLoading,
            setTotalRecords,
            setDownloadCSV,
            setInitialRender,
        } = useContext(AnalyticsContext);

        const analyticsApiHandler = async (defaultPage?: number) => {
            if(!apiEndpoint) return;
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

                if (downloadCSV) {
                    setLoading(true);
                    setTableLoading(false);
                }

                const { data } = await AnalyticsApi.getAnalyticsData(apiEndpoint, {
                    page: defaultPage ? defaultPage : page,
                    limit,
                    search,
                    sortBy,
                    sortOrder,
                    filter,
                    downloadCSV
                });

                if (downloadCSV) {
                    const fileData = new Blob([data], {
                        type: "text/csv;charset=utf-8",
                    });

                    const { fileName, successMsg } = getCSVFileName(activeSection);
                    saveAs(fileData, fileName);
                    toastUtils.success(successMsg);
                } else {
                    setTotalRecords(data.totalRecords)
                    setData(data.data);
                }

                initialRender ? setLoading(false) : setTableLoading(false)
                setError('');
                if (downloadCSV) {
                    setLoading(false);
                    setDownloadCSV(false);
                }
            } catch (error) {
                initialRender ? setLoading(false) : setTableLoading(false)
                if (downloadCSV) {
                    setLoading(false);
                    setDownloadCSV(false);
                }
                setError(SOMETHING_WENT_WRONG);
                setData([]);
                setTotalRecords(0);
            }
        }

        useEffect(() => {
            if (downloadCSV) analyticsApiHandler();
        }, [downloadCSV])

        useEffect(() => {
            if (!initialRender) {
                analyticsApiHandler(1);
                setPage(null)
            }
        }, [limit, search, sortBy, sortOrder, filter])

        useEffect(() => {            
            if (!initialRender && typeof page === 'number') {
                analyticsApiHandler();
            }
        }, [page])

        useEffect(() => {            
            if(initialRender) analyticsApiHandler();
            setInitialRender(false);
        }, [apiEndpoint, initialRender])

        const handleApiEndpoint = async () => {
            switch (activeSection) {
                case analyticsLayoutSection.ACCOUNT_USERS:
                    setApiEndpoint("users")
                    break;
                case analyticsLayoutSection.ACCOUNT_ASSETS:
                    setApiEndpoint("assets")
                    break;
                default:
                    setApiEndpoint("")
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
            <Component {...props} />
        )

    }

}

export default AnalyticsHOC