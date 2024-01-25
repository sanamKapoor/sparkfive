export interface DashboardSectionI {
    title: string
    // For date
    filter: {
      endDate: Date,
      beginDate: Date
    },
    customDates: false,
    // Sorting
    sortBy: string,
    sortOrder: boolean,
    // Pagination
    page: number,
    limit: number
    // Others
    error: string,
    loading: boolean,
    tableLoading: boolean
  }