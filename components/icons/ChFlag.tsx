import * as React from "react";
import { SVGProps } from "react";
const ISwitzerland = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    viewBox="0 0 32 32"
    {...props}
  >
    <path fill="red" d="M0 0h32v32H0z" />
    <path fill="#fff" d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" />
  </svg>
);
export default ISwitzerland;
