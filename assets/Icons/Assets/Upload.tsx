import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={31} height={36} fill="none" {...props}>
    <path
      className={"theme-icon"}
      d="M30.943 31.85v3.273H.038V31.85h30.905ZM30.877 11.972l-2.075 2.575-11.656-8.794v20.598h-3.311V5.753L2.179 14.547.104 11.972 15.49.255l15.387 11.717Z"
    />
  </svg>
);
export default SvgComponent;
