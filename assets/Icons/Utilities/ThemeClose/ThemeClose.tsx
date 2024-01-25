import * as React from "react";
const SvgComponent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
    <g className={"theme-icon"} fill="#08135E" fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <path d="M13.854 2.147a.501.501 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
      <path d="M2.146 2.147a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgComponent;
