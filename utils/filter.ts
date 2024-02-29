import { filterKeyMap } from "../config/data/filter";
import { FilterAttributeVariants, IAttribute } from "../interfaces/filters";

export const getFilterKeyForAttribute = (id: keyof typeof filterKeyMap) => {
  const filterKey = filterKeyMap[id] ? filterKeyMap[id] : `custom-p${id}`;

  return filterKey;
};

export const checkIfBadgeVisible = (
  filterObject: unknown,
  id: string | FilterAttributeVariants
) => {
  let result = false;

  if (filterObject[getFilterKeyForAttribute(id)]?.length > 0) {
    result = true;
  } else if (
    [
      FilterAttributeVariants.LAST_UPDATED,
      FilterAttributeVariants.DATE_UPLOADED,
    ].includes(id) &&
    filterObject[id] !== undefined
  ) {
    result = true;
  } else if (
    id === FilterAttributeVariants.DIMENSIONS &&
    (filterObject["dimensionWidth"] !== undefined ||
      filterObject["dimensionHeight"] !== undefined)
  ) {
    result = true;
  } else {
    result = false;
  }

  return result;
};

const getAttributeById = (
  id: FilterAttributeVariants,
  attributes: IAttribute[]
) => {
  return attributes.filter((item) => item.id === id) ?? [];
};

const getCustomAttributes = (attributes: IAttribute[]) => {
  return attributes.filter((item) => item.type === "custom") ?? [];
};

const getRemainingAttributes = (attributes: IAttribute[]) => {
  const ids = [
    "dimensions",
    "dateUploaded",
    "lastUpdated",
    "orientation",
    "resolution",
  ];

  return attributes.filter((item) => ids.includes(item.id)) ?? [];
};

export const getSortedAttributes = (attributes: IAttribute[]) => {
  return [
    ...getAttributeById(FilterAttributeVariants.TAGS, attributes),
    ...getAttributeById(FilterAttributeVariants.AI_TAGS, attributes),
    ...getCustomAttributes(attributes),
    ...getAttributeById(FilterAttributeVariants.CAMPAIGNS, attributes),
    ...getAttributeById(FilterAttributeVariants.PRODUCTS, attributes),
    ...getAttributeById(FilterAttributeVariants.FILE_TYPES, attributes),
    ...getRemainingAttributes(attributes),
  ];
};
