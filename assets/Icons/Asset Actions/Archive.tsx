import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    x="0"
    y="0"
    viewBox="0 0 512 512"
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    {...props}
  >
    <g xmlns="http://www.w3.org/2000/svg" className={"theme-icon"}>
      <path
        d="M497 60.25H15c-8.284 0-15 6.716-15 15v90.375c0 8.284 6.716 15 15 15h15.125V436.75c0 8.284 6.716 15 15 15h421.75c8.284 0 15-6.716 15-15V180.625H497c8.284 0 15-6.716 15-15V75.25c0-8.284-6.716-15-15-15zm-45.125 361.5H60.125V180.625h391.75zM482 150.625H30V90.25h452z"
        data-original="#000000"
      />
      <path
        d="M225.875 301.125h60.25c24.882 0 45.125-20.243 45.125-45.125s-20.243-45.125-45.125-45.125h-60.25c-24.882 0-45.125 20.243-45.125 45.125s20.243 45.125 45.125 45.125zm0-60.25h60.25c8.34 0 15.125 6.785 15.125 15.125s-6.785 15.125-15.125 15.125h-60.25c-8.34 0-15.125-6.785-15.125-15.125s6.785-15.125 15.125-15.125z"
        data-original="#000000"
      />
    </g>
  </svg>
);
export default SvgComponent;
