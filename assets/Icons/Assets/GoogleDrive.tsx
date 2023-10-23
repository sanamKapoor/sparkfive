import * as React from "react";
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={240} height={240} viewBox="0 0 48 48" {...props}>
    <path fill="#eba400" d="M45 30c0 .35-.1.7-.28 1.01L31.51 30l13.21-1.01c.18.31.28.66.28 1.01z" />
    <linearGradient id="a" x1={39.84} x2={16.836} y1={41.496} y2={30.77} gradientUnits="userSpaceOnUse">
      <stop offset={0} stopColor="#2a96f4" />
      <stop offset={0.535} stopColor="#2895f3" />
      <stop offset={0.728} stopColor="#2190ee" />
      <stop offset={0.865} stopColor="#1687e7" />
      <stop offset={0.976} stopColor="#057bdc" />
      <stop offset={1} stopColor="#0077d9" />
    </linearGradient>
    <path
      fill="url(#a)"
      d="M45 30c0 .35-.1.7-.28 1.01l-5.63 10c-.35.61-1.01.99-1.72.99H11.54c-.35 0-.69-.09-.99-.27l.9-11.73H45z"
    />
    <linearGradient id="b" x1={3.522} x2={24.656} y1={30.11} y2={17.909} gradientUnits="userSpaceOnUse">
      <stop offset={0} stopColor="#4caf50" />
      <stop offset={0.486} stopColor="#4aae50" />
      <stop offset={0.661} stopColor="#43a94e" />
      <stop offset={0.786} stopColor="#38a14c" />
      <stop offset={0.887} stopColor="#279648" />
      <stop offset={0.972} stopColor="#184" />
      <stop offset={1} stopColor="#088242" />
    </linearGradient>
    <path
      fill="url(#b)"
      d="M28.234 11.67 10.55 41.73h-.01c-.3-.17-.55-.42-.73-.73L4.3 31.13c-.36-.62-.36-1.39 0-2.01L16.93 7c.18-.31.43-.56.73-.73h.01l10.564 5.4z"
    />
    <linearGradient id="c" x1={31.335} x2={31.335} y1={6} y2={30} gradientUnits="userSpaceOnUse">
      <stop offset={0} stopColor="#ffd747" />
      <stop offset={0.482} stopColor="#fed645" />
      <stop offset={0.655} stopColor="#fdd13e" />
      <stop offset={0.779} stopColor="#f9c833" />
      <stop offset={0.879} stopColor="#f4bc22" />
      <stop offset={0.964} stopColor="#eead0c" />
      <stop offset={1} stopColor="#eba400" />
    </linearGradient>
    <path
      fill="url(#c)"
      d="M45 30H31.511L17.67 6.27c.3-.18.64-.27.99-.27h11.71c.71 0 1.37.38 1.72.99l12.63 22c.18.31.28.66.28 1.01z"
    />
  </svg>
);
export default SvgComponent;
