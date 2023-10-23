import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 12 12" {...props}>
    <circle cx={1.25} cy={6} r={1.25} className="theme-icon" />
    <circle cx={6} cy={6} r={1.25} className="theme-icon" />
    <circle cx={10.75} cy={6} r={1.25} className="theme-icon" />
  </svg>
);
export default SvgComponent;
