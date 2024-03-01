import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 12 14",
    }}
    viewBox="0 0 12 14"
    {...props}
  >
    <g
      style={{
        enableBackground: "new",
      }}
    >
      <path d="m5.4 14 1.2-1-4.1-5.2H12V6.2H2.5L6.6 1 5.4 0 0 7z" className={"theme-icon"} />
    </g>
  </svg>
);
export default SvgComponent;
