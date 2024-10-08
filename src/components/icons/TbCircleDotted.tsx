import React from 'react';

interface CircleDottedIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number; // Optional size prop
}

export const TbCircleDotted: React.FC<CircleDottedIconProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dotted"
    {...props} // Spread any additional props like className or onClick
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7.5 4.21l0 .01" />
    <path d="M4.21 7.5l0 .01" />
    <path d="M3 12l0 .01" />
    <path d="M4.21 16.5l0 .01" />
    <path d="M7.5 19.79l0 .01" />
    <path d="M12 21l0 .01" />
    <path d="M16.5 19.79l0 .01" />
    <path d="M19.79 16.5l0 .01" />
    <path d="M21 12l0 .01" />
    <path d="M19.79 7.5l0 .01" />
    <path d="M16.5 4.21l0 .01" />
    <path d="M12 3l0 .01" />
  </svg>
);

