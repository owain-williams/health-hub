import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { label?: string };

function Svg({ label, children, ...rest }: IconProps) {
  return (
    <svg className="hh-icon" viewBox="0 0 24 24" aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label} {...rest}>
      {children}
    </svg>
  );
}

export const IconCheck = (p: IconProps) => (
  <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>
);
export const IconUpload = (p: IconProps) => (
  <Svg {...p}><path d="M12 16V4" /><path d="M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></Svg>
);
export const IconDocument = (p: IconProps) => (
  <Svg {...p}><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></Svg>
);
export const IconTrace = (p: IconProps) => (
  <Svg {...p}><rect x="4" y="3" width="11" height="18" rx="2.5" /><path d="M7.5 8h4M7.5 16h3" /><path d="M7.5 12h12.5" /><circle cx="20" cy="12" r="1.6" fill="currentColor" stroke="none" /></Svg>
);
export const IconTimeline = (p: IconProps) => (
  <Svg {...p}><path d="M4 12h16" /><circle cx="7" cy="12" r="2" /><circle cx="13" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 14v5M13 10V5M19 14v3" /></Svg>
);
export const IconQuestion = (p: IconProps) => (
  <Svg {...p}><path d="M4 5h16v11H9l-5 4z" /><path d="M10 9.5a2 2 0 1 1 3 1.7c-.7.4-1 .9-1 1.6" /><circle cx="12" cy="14.6" r=".6" fill="currentColor" stroke="none" /></Svg>
);
export const IconShield = (p: IconProps) => (
  <Svg {...p}><path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></Svg>
);
export const IconTrash = (p: IconProps) => (
  <Svg {...p}><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></Svg>
);
export const IconLog = (p: IconProps) => (
  <Svg {...p}><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></Svg>
);
export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Svg>
);
export const IconPlus = (p: IconProps) => (
  <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
);
export const IconPerson = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></Svg>
);
export const IconPen = (p: IconProps) => (
  <Svg {...p}><path d="M4 20l4-1 10-10-3-3L5 16z" /><path d="M13 7l3 3" /></Svg>
);
export const IconFlag = (p: IconProps) => (
  <Svg {...p}><path d="M6 21V4" /><path d="M6 4h11l-2 4 2 4H6" /></Svg>
);
export const IconInfo = (p: IconProps) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="8" r=".7" fill="currentColor" stroke="none" /></Svg>
);
export const IconUK = (p: IconProps) => (
  <Svg {...p}><path d="M12 3c-4 0-7 3.5-7 7.5S9 20 12 21c3-1 7-6.5 7-10.5S16 3 12 3z" /><path d="M9 11h6M12 8v6" /></Svg>
);
export const IconDownload = (p: IconProps) => (
  <Svg {...p}><path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" /></Svg>
);
export const IconLink = (p: IconProps) => (
  <Svg {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Svg>
);
