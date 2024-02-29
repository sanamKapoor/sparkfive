import * as React from "react";
const SvgComponent = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={16} fill="none" {...props}>
    <g fill="#AEB0C2" clipPath="url(#a)">
      <path d="M15 1.672h-2.813V.5H2.813v1.172H0v1.406h1.406V15.5h12.188V3.078H15V1.672Zm-2.813 12.422H2.813V3.078h9.374v11.016Z" />
      <path d="M9.375 5.781h-.938v5.625h.938V5.781ZM6.563 5.781h-.938v5.625h.938V5.781Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .5h15v15H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgComponent;
