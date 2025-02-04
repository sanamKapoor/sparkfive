import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={150}
    height={150}
    fill="#817D9D"
    viewBox="0 0 92 92"
    {...props}
  >
    <path d="M59 75c-1.1 0-2.1-.4-2.9-1.2-1.5-1.6-1.5-4.1.1-5.7l23-22.1-23-22.1c-1.6-1.5-1.6-4.1-.1-5.7 1.5-1.6 4.1-1.6 5.7-.1l26 25c.8.8 1.2 1.8 1.2 2.9s-.4 2.1-1.2 2.9l-26 25C61 74.6 60 75 59 75zm-23.1-1.2c1.5-1.6 1.5-4.1-.1-5.7L12.8 46l23-22.1c1.6-1.5 1.6-4.1.1-5.7-1.5-1.6-4.1-1.6-5.7-.1l-26 25C3.4 43.9 3 44.9 3 46s.4 2.1 1.2 2.9l26 25C31 74.6 32 75 33 75c1 0 2.1-.4 2.9-1.2z" />
  </svg>
);
export default SvgComponent;
