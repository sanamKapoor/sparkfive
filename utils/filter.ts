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
  return (
    filterObject[getFilterKeyForAttribute(id)]?.length > 0 &&
    ![
      FilterAttributeVariants.DATE_UPLOADED,
      FilterAttributeVariants.LAST_UPDATED,
      FilterAttributeVariants.DIMENSIONS,
    ].includes(id)
  );
};
