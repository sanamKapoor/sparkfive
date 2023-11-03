import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 16 16" {...props}>
    <defs>
      <style>{".theme-icon{fill:#aeb0c2}"}</style>
    </defs>
    <path
      d="M8-.25A8.25 8.25 0 1 0 16.25 8 8.25 8.25 0 0 0 8-.25Zm0 15A6.75 6.75 0 1 1 14.75 8 6.76 6.76 0 0 1 8 14.75Z"
      className="theme-icon"
    />
    <path d="M7.25 6.91h1.5v4.67h-1.5zM7.25 4.41h1.5v1.5h-1.5z" className="theme-icon" />
  </svg>
);
export default SvgComponent;
