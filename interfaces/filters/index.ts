export interface IAttribute {
  id: FilterAttributeVariants | string;
  name: string;
  type: "pre-defined" | "custom";
  selectionType: "selectOne" | "selectMultiple";
}

export interface IAttributeValue extends Pick<ITag, "type"> {
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

export interface IProductCategories {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  type: "product_category";
}

export interface IProductVendors extends IProductRetailers {}

export interface IProductRetailers {
  createdAt: string;
  numberOfFiles: string;
  teamId: string;
  name: string;
  count: string;
  id: string;
  type: string;
  updatedAt: string;
}

export interface ITag {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  type: string;
}

export interface IProductSku {
  id: string;
  sku: string;
  categoryId: string | null;
  vendorId: string | null;
  retailerId: string | null;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  tags: ITag[];
}

export interface IResolutionFilter {
  dpi: number;
  count: string;
}

export interface IFileTypeFilter {
  name: string;
  count: string;
}

export interface IProductFilter {
  sku: IProductSku[];
}

export type IFilterPopupContentType =
  | "list"
  | "dimensions"
  | "resolutions"
  | "lastUpdated"
  | "dateUploaded"
  | "products"
  | "fileTypes"
  | "orientation";

export type IFilterAttributeValues =
  | IAttributeValue[]
  | IDimensionFilter
  | IProductFilter;

export enum FilterAttributeVariants {
  TAGS = "tags",
  AI_TAGS = "aiTags",
  CAMPAIGNS = "campaigns",
  FILE_TYPES = "fileTypes",
  ORIENTATION = "orientation",
  RESOLUTION = "resolution",
  DIMENSIONS = "dimensions",
  LAST_UPDATED = "lastUpdated",
  DATE_UPLOADED = "dateUploaded",
  PRODUCTS = "products",
  CUSTOM_FIELD = "customField",
}

export interface IDateRange {
  id: string;
  label: string;
  beginDate: Date;
  endDate: Date;
}
