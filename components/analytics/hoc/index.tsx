import { saveAs } from "file-saver";
import { useContext, useEffect } from "react";
import { calculateBeginDate } from "../../../config/data/filter";
import { DashboardSections, analyticsLayoutSection } from "../../../constants/analytics";
import { SOMETHING_WENT_WRONG } from "../../../constants/messages";
import { AnalyticsContext } from "../../../context";
import AnalyticsApi from "../../../server-api/analytics";
import { getCSVFileName } from "../../../utils/analytics";
import toastUtils from "./../../../utils/toast";

const AnalyticsHOC = (Component) => {
    return (props) => {

        const {
            page, limit, search, sortBy, sortOrder, filter, filterFor, sortFor, downloadCSV, apiEndpoint, initialRender, activeSection, dashboardView, dashboardData,
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
            setDashboardView,
            setDashboardData,
            setFilterFor,
            setSortFor,
            setCustomDatesFor,
            setErrorFor,
            setLoadingFor,
            setTableLoadingFor
        } = useContext(AnalyticsContext);

        const analyticsApiHandler = async (defaultPage?: number) => {
            if (!apiEndpoint && !dashboardView) return;
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


                if (dashboardView) {
                    
                    for (const key in DashboardSections) {

                        let endpoint = DashboardSections[key]  
                        const sort = sortFor.find(e => e.for === endpoint) 
                        const filter = filterFor.find(e => e.for === endpoint)    
                                                
                        const { data } = await AnalyticsApi.getAnalyticsData(endpoint, {
                            page: 1,
                            limit: 6,
                            sortBy: sort?.sortBy || '',
                            sortOrder: sort?.sortOrder || true,
                            filter: {
                                endDate: filter?.endDate || new Date(),
                                beginDate: filter?.beginDate || calculateBeginDate(7, 1)
                            },
                        });

                        if (!dashboardData[endpoint]) {
                            setDashboardData(prev => ({
                                ...prev,
                                [endpoint]: data
                            }))
                        }
                    }
                } else {
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
            if (initialRender) analyticsApiHandler();
            setInitialRender(false);
        }, [apiEndpoint, initialRender])

        useEffect(() => {
            analyticsApiHandler()
        }, [dashboardView])

        useEffect(() => {
            console.log(filterFor);
        }, [filterFor])

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

        const handleDashboardStates = () => {
            if (activeSection === analyticsLayoutSection.DASHBOARD) {
                setDashboardView(true)
                for (const section in DashboardSections) {
                    setFilterFor(prev => ([
                        ...prev,
                        {
                            for: DashboardSections[section],
                            endDate: new Date(),
                            beginDate: calculateBeginDate(7, 1)
                        }
                    ]))
                    setSortFor(prev => ([
                        ...prev,
                        {
                            for: DashboardSections[section],
                            sortBy: '',
                            sortOrder: true
                        }
                    ]))
                    setCustomDatesFor(prev => ([
                        ...prev,
                        {
                            for: DashboardSections[section],
                            customeDates: false
                        }
                    ]))
                    setErrorFor(prev => ([
                        ...prev,
                        {
                            for: DashboardSections[section],
                            error: ''
                        }
                    ]))
                    setLoadingFor(prev => ([
                        ...prev,
                        {
                            for: DashboardSections[section],
                            loading: false
                        }
                    ]))
                    setTableLoadingFor(prev => ([
                        ...prev,
                        {
                            for: DashboardSections[section],
                            tableLoading: false
                        }
                    ]))
                }
            } else {
                setDashboardView(false)
                setDashboardData([])
                setFilterFor([])
                setCustomDatesFor([])
                setSortFor([])
                setErrorFor([])
                setLoadingFor([])
                setTableLoadingFor([])
            }
        }

        useEffect(() => {
            handleApiEndpoint();
            handleDashboardStates();
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