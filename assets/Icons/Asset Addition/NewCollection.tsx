import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none" {...props}>
    <path
      className={"theme-icon"}
      d="M12.656 1.875H8.541L6.88.385A1.5 1.5 0 0 0 5.887 0H2.345A2.344 2.344 0 0 0 0 2.344v10.312A2.344 2.344 0 0 0 2.344 15h10.312A2.343 2.343 0 0 0 15 12.656V4.22a2.344 2.344 0 0 0-2.344-2.344Zm.938 10.781a.938.938 0 0 1-.938.938H2.344a.938.938 0 0 1-.938-.938V2.344a.937.937 0 0 1 .938-.938h3.6l1.66 1.5.402.357h4.688a.938.938 0 0 1 .937.937l-.037 8.456Z"
    />
    <path className={"theme-icon"} d="M7.241 9.821V5.879h.756v3.942h-.756ZM5.603 8.21v-.711h4.032v.711H5.603Z" />
  </svg>
);
export default SvgComponent;
