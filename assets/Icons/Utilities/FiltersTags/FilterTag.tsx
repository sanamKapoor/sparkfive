import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
    <path
      className={"theme-icon"}
      d="M1 .957A.957.957 0 0 1 1.957 0h4.388c.254 0 .497.1.677.28L13.72 6.98a.957.957 0 0 1 0 1.353L9.332 12.72a.957.957 0 0 1-1.353 0L1.28 6.022A.957.957 0 0 1 1 5.345V.957Zm3.35 3.827a1.435 1.435 0 1 0 0-2.87 1.435 1.435 0 0 0 0 2.87Z"
    />
    <path
      className={"theme-icon"}
      d="M1.182 6.543a.98.98 0 0 1-.268-.676V1c-.242 0-.475.1-.646.28A.98.98 0 0 0 0 1.957v4.388a.98.98 0 0 0 .268.677l6.4 6.698c.171.18.404.28.646.28.243 0 .475-.1.647-.28L8 13.679 1.182 6.543Z"
    />
  </svg>
);
export default SvgComponent;
