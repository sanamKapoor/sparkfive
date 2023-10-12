import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 28 28",
    }}
    viewBox="0 0 28 28"
    {...props}
  >
    <path
      d="M11.5-2.5c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14-6.3-14-14-14z"
      style={{
        fill: "#f6efe4",
      }}
      transform="translate(2.5 2.5)"
    />
    <path
      d="M15.3 14.6c1.6-.6 2.6-2.3 2.3-4.2-.3-1.3-1.4-2.5-2.7-2.8-2.4-.6-4.5 1.3-4.5 3.6 0 1.6 1 2.9 2.3 3.4-2.2.4-3.9 1.9-4.8 3.8-.4 1 .3 2.1 1.4 2.1h9.5c1.1 0 1.8-1.1 1.4-2.1-.9-1.9-2.7-3.4-4.9-3.8zm-3.7-3.4c0-1.3 1.1-2.4 2.4-2.4s2.4 1.1 2.4 2.4c0 1.3-1.1 2.4-2.4 2.4s-2.4-1.1-2.4-2.4zm2.4 4.4c1.7 0 3.2.8 4.2 2 .5.7.1 1.7-.8 1.7h-6.9c-.9 0-1.3-1-.8-1.7 1.1-1.2 2.6-2 4.3-2z"
      className={"theme-icon"}
    />
  </svg>
);
export default SvgComponent;
