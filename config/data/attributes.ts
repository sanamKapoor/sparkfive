import CampaignManagement from "../../components/common/attributes/campaign-management";
import CollectionManagement from "../../components/common/attributes/collection-management";
import CustomFieldsManagement from "../../components/common/attributes/custom-fields-management";
import ProductManagement from "../../components/common/attributes/product-management";
import TagManagement from "../../components/common/attributes/tag-management";

export const sorts = [
  {
    value: "name,asc",
    label: "Alphabetical (A-Z)",
  },
  {
    value: "name,desc",
    label: "Alphabetical (Z-A)",
  },
  {
    value: "numberOfFiles,asc",
    label: "Popularity (Low to High)",
  },
  {
    value: "numberOfFiles,desc",
    label: "Popularity (High to Low)",
  },
];

export const defaultCustomFields = [
  {
    id: null,
    name: "",
    type: "selectOne",
    values: [],
  },
  {
    id: null,
    name: "",
    type: "selectOne",
    values: [],
  },
  {
    id: null,
    name: "",
    type: "selectOne",
    values: [],
  },
  {
    id: null,
    name: "",
    type: "selectOne",
    values: [],
  },
  {
    id: null,
    name: "",
    type: "selectOne",
    values: [],
  },
  {
    id: null,
    name: "",
    type: "selectOne",
    values: [],
  },
];

export const type = [
  {
    label: "Select One",
    value: "selectOne",
  },
  {
    label: "Select Multiple",
    value: "selectMultiple",
  },
];

export const productSorts = [
  {
    value: "sku,asc",
    label: "Alphabetical (A-Z)",
  },
  {
    value: "sku,desc",
    label: "Alphabetical (Z-A)",
  },
  {
    value: "numberOfFiles,asc",
    label: "Popularity (Low to High)",
  },
  {
    value: "numberOfFiles,desc",
    label: "Popularity (High to Low)",
  },
];

export const tabsData = [
  {
    id: "tags",
    title: "Tags",
    content: TagManagement,
  },
  {
    id: "customFields",
    title: "Custom Fields",
    content: CustomFieldsManagement,
  },
  {
    id: "collections",
    title: "Collections",
    content: CollectionManagement,
  },
  {
    id: "products",
    title: "Products",
    content: ProductManagement,
  },
  {
    id: "campaigns",
    title: "Campaigns",
    content: CampaignManagement,
  },
];
