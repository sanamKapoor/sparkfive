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

export interface IDimensionFilter {
  maxHeight: number;
  minHeight: number;
  maxWidth: number;
  minWidth: number;
}

export type IFilterPopupContentType =
  | "list"
  | "dimensions"
  | "resolutions"
  | "lastUpdated"
  | "dateUploaded"
  | "products";
