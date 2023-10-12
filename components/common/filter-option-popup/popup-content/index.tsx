//🚧 work in progress 🚧
import React from "react";
import { IFilterPopupContentType } from "../../../../interfaces/filters";
import DimensionsFilter from "../../filter-view/dimension-filter";
import DateUploaded from "../../filter/date-uploaded";
import ProductFilter from "../../filter/product-filter";
import ResolutionFilter from "../../filter/resolution-filter";
import OptionData from "../options-data";

interface PopupContentProps<T> {
  type: IFilterPopupContentType;
  data: T; //TODO
}

const PopupContent: React.FC<PopupContentProps<T>> = ({ type, data }) => {
  console.log("data: ", data);
  let Component: React.FC<T>;

  switch (type) {
    case "products":
      Component = ProductFilter;
      break;
    case "dimensions":
      Component = DimensionsFilter;
      break;
    case "resolutions":
      Component = ResolutionFilter;
      break;
    case "lastUpdated":
    case "dateUploaded":
      Component = DateUploaded;
      break;
    default:
      Component = OptionData;
  }
  return <Component {...data} />;
};

export default PopupContent;
