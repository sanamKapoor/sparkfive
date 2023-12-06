import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 512 512",
    }}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      className={"theme-icon"}
      d="M256.001 276.673c-28.017 0-50.81 22.793-50.81 50.81 0 13.895 5.775 27.33 15.858 36.891v45.875c0 19.273 15.68 34.953 34.953 34.953s34.953-15.68 34.953-34.953v-45.875c10.078-9.555 15.857-22.993 15.857-36.891-.002-28.017-22.796-50.81-50.811-50.81zm17.978 69.885c-4.851 4.571-7.633 10.96-7.633 17.53v46.161c0 5.705-4.64 10.345-10.345 10.345-5.704 0-10.345-4.64-10.345-10.345v-46.161c0-6.569-2.782-12.957-7.63-17.527-5.307-5.003-8.229-11.778-8.229-19.078 0-14.447 11.755-26.202 26.202-26.202 14.447 0 26.202 11.755 26.202 26.202.002 7.3-2.92 14.075-8.222 19.075z"
    />
    <path
      className={"theme-icon"}
      d="M404.979 209.876h-36.908v-97.804C368.071 50.275 317.795 0 256.001 0 194.205 0 143.93 50.275 143.93 112.072v97.804h-36.909c-20.353 0-36.911 16.559-36.911 36.911v228.301c0 20.353 16.558 36.911 36.911 36.911h297.958c20.353 0 36.911-16.558 36.911-36.911v-228.3c0-20.353-16.558-36.912-36.911-36.912zm-236.443-97.804c0-48.227 39.236-87.464 87.464-87.464 48.227 0 87.463 39.237 87.463 87.464v97.804H168.536v-97.804zm248.747 363.017c0 6.784-5.52 12.304-12.304 12.304H107.021c-6.784 0-12.304-5.519-12.304-12.304V246.788c0-6.784 5.52-12.304 12.304-12.304h297.958c6.784 0 12.304 5.519 12.304 12.304v228.301z"
    />
  </svg>
);
export default SvgComponent;