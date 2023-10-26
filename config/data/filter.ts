import { IDateRange } from "../../interfaces/filters";

const calculateBeginDate = (daysAgo: number) => {
  const endDate = new Date();
  const beginDate = new Date(endDate);
  beginDate.setDate(endDate.getDate() - daysAgo);
  return beginDate;
};

export const dateRanges: IDateRange[] = [
  {
    id: "today",
    label: "Today",
    beginDate: calculateBeginDate(0),
    endDate: new Date(),
  },
  {
    id: "yesterday",
    label: "Yesterday",
    beginDate: calculateBeginDate(1),
    endDate: calculateBeginDate(1),
  },
  {
    id: "last7Days",
    label: "Last 7 days",
    beginDate: calculateBeginDate(7),
    endDate: new Date(),
  },
  {
    id: "last30Days",
    label: "Last 30 days",
    beginDate: calculateBeginDate(30),
    endDate: new Date(),
  },
  {
    id: "last90Days",
    label: "Last 90 days",
    beginDate: calculateBeginDate(90),
    endDate: new Date(),
  },
  {
    id: "last365Days",
    label: "Last 365 days",
    beginDate: calculateBeginDate(365),
    endDate: new Date(),
  },
];
