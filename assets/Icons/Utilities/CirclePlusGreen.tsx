import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <g className={"theme-icon"}>
      <path d="M18 9A9 9 0 1 1 .001 9 9 9 0 0 1 18 9ZM1.286 9a7.714 7.714 0 1 0 15.428 0A7.714 7.714 0 0 0 1.286 9Z" />
      <path d="M12.274 8.357v1.286H9.643v2.631H8.357V9.643H5.726V8.357h2.631V5.726h1.286v2.631h2.631Z" />
    </g>
  </svg>
);
export default SvgComponent;
