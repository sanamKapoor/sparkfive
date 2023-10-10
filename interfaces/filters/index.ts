export interface IAttribute {
  id: string;
  name: string;
  type: "pre-defined" | "custom";
}

export interface IAttributeValue {
  createdAt: string;
  numberOfFiles: string;
  endDate: string | null;
  name: string;
  count: string;
  description: string | null;
  id: string;
  userId: string;
  startDate: string | null;
  status: "draft";
  updatedAt: string;
}

export type IFilterPopupContentType = "list" | "dimensions" | "resolutions";
