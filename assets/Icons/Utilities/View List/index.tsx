import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 16 16" {...props}>
    <rect width={4} height={4} className="theme-icon" rx={1.5} />
    <rect width={4} height={4} y={6} className="theme-icon" rx={1.5} />
    <rect width={4} height={4} y={12} className="theme-icon" rx={1.5} />
    <path
      d="M15.25 2.75h-8.5a.75.75 0 0 1 0-1.5h8.5a.75.75 0 0 1 0 1.5ZM15.25 8.75h-8.5a.75.75 0 0 1 0-1.5h8.5a.75.75 0 0 1 0 1.5ZM15.25 14.75h-8.5a.75.75 0 0 1 0-1.5h8.5a.75.75 0 0 1 0 1.5Z"
      className="theme-icon"
    />
  </svg>
);
export default SvgComponent;
