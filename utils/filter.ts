import { filterKeyMap } from "../config/data/filter";
import { FilterAttributeVariants } from "../interfaces/filters";

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
  } else {
    result = false;
  }

  return result;
};
