//🚧 work in progress 🚧

import {
  FilterAttributeVariants,
  OptionsDataProps,
} from "../../../../interfaces/filters";
import ProductFilter from "../../filter/product-filter";
import ResolutionFilter from "../../filter/resolution-filter";
import AiTagsFilter from "../ai-tags-filter";
import CampaignFilter from "../campaign-filter";
import CustomFilter from "../custom-filter";
import DateUploadedFilter from "../date-uploaded-filter";
import DimensionsFilter from "../dimension-filter";
import FileTypeFilter from "../file-type-filter";
import LastUpdatedFilter from "../last-updated-filter";
import OrientationFilter from "../orientation-filter";
import TagsFilter from "../tags-filter";

interface FilterContentProps
  extends Required<
    Pick<
      OptionsDataProps,
      "activeAttribute" | "options" | "setOptions" | "setFilters"
    >
  > {}

const FilterContent: React.FC<FilterContentProps> = ({
  activeAttribute,
  options,
  setOptions,
  setFilters,
}) => {
  const filterComponents = {
    [FilterAttributeVariants.TAGS]: TagsFilter,
    [FilterAttributeVariants.AI_TAGS]: AiTagsFilter,
    [FilterAttributeVariants.CAMPAIGNS]: CampaignFilter,
    [FilterAttributeVariants.DIMENSIONS]: DimensionsFilter,
    [FilterAttributeVariants.RESOLUTION]: ResolutionFilter,
    [FilterAttributeVariants.FILE_TYPES]: FileTypeFilter,
    [FilterAttributeVariants.ORIENTATION]: OrientationFilter,
    [FilterAttributeVariants.LAST_UPDATED]: LastUpdatedFilter,
    [FilterAttributeVariants.DATE_UPLOADED]: DateUploadedFilter,
    [FilterAttributeVariants.PRODUCTS]: ProductFilter,
  };

  const Component =
    activeAttribute?.type === "custom"
      ? CustomFilter
      : filterComponents[activeAttribute?.id] || null;

  if (!Component) {
    // Handle unknown or unsupported attribute types or IDs
    return null;
  }

  return (
    <Component
      options={options}
      setOptions={setOptions}
      setFilters={setFilters}
      activeAttribute={activeAttribute}
    />
  );
};

export default FilterContent;
