import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} fill="none" {...props}>
    <path
      className={"theme-secondary-icon"}
      d="M7 13.465c-3.6 0-6.533-2.933-6.533-6.533C.467 3.332 3.4.398 7 .398c3.6 0 6.533 2.934 6.533 6.534 0 3.6-2.933 6.533-6.533 6.533Z"
    />
    <path
      className={"theme-secondary-icon"}
      d="M7 1C3.667 1 1 3.667 1 7s2.667 6 6 6 6-2.667 6-6-2.667-6-6-6Zm0-1a7 7 0 0 1 7 7 7 7 0 0 1-7 7 7 7 0 0 1-7-7 7 7 0 0 1 7-7Z"
    />
    <path
      fill="#F6EFE4"
      d="M6.533 9.335c-.133 0-.266-.067-.4-.133l-2.2-2 .734-.867 1.8 1.6L9.2 4.602l.933.733L7 9.135a.605.605 0 0 1-.467.2Z"
    />
  </svg>
);
export default SvgComponent;
