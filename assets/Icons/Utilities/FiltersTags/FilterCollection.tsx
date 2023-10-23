import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
    <rect width={6.667} height={6.667} className={"theme-icon"} rx={1} />
    <rect width={6.667} height={6.667} y={8.333} className={"theme-icon"} rx={1} />
    <rect width={6.667} height={6.667} x={8.333} className={"theme-icon"} rx={1} />
    <rect width={6.667} height={6.667} x={8.333} y={8.333} className={"theme-icon"} rx={1} />
  </svg>
);
export default SvgComponent;
