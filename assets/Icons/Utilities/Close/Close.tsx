import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={15} fill="none" {...props}>
    <path
      className={"theme-icon"}
      d="M12.097 4.277 8.737 7.36l3.271 3.001-.795.73-3.273-3-3.36 3.081-.761-.697 3.36-3.082-3.29-3.017.797-.73 3.29 3.017 3.36-3.082.76.697Z"
    />
  </svg>
);
export default SvgComponent;
