import type { SVGProps } from "react";

export type IconName =
  | "key"
  | "lock"
  | "unlock"
  | "hash"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up-right"
  | "play"
  | "plus"
  | "copy"
  | "check"
  | "sun"
  | "moon"
  | "menu"
  | "x"
  | "book"
  | "flask"
  | "target"
  | "search"
  | "chevron-down"
  | "chevron-right"
  | "sparkles"
  | "trash"
  | "zoom-in"
  | "zoom-out"
  | "shield"
  | "code"
  | "layers"
  | "rotate"
  | "external"
  | "info"
  | "bulb"
  | "trophy"
  | "terminal"
  | "network"
  | "clock"
  | "alert"
  | "eye"
  | "eye-off"
  | "globe"
  | "download"
  | "scissors"
  | "git-branch"
  | "mail"
  | "fingerprint"
  | "binary"
  | "vault"
  | "wrench"
  | "route"
  | "medal"
  | "zap"
  | "compass"
  | "graduation"
  | "github"
  | "file"
  | "swap"
  | "dice"
  | "radio";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  key: <><circle cx="7.5" cy="15.5" r="4.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 8 0v4" /><circle cx="12" cy="16" r="1.2" /></>,
  unlock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V6a4 4 0 0 1 7.7-1.5" /></>,
  hash: <><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></>,
  "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  "arrow-left": <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
  "arrow-up-right": <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
  play: <><path d="M8 5v14l11-7Z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></>,
  check: <><path d="m4 12 5 5L20 6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  x: <><path d="M18 6 6 18M6 6l12 12" /></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M9 7h7" /></>,
  flask: <><path d="M9 3h6M10 3v6L4.5 18a2.4 2.4 0 0 0 2 3.5h11a2.4 2.4 0 0 0 2-3.5L14 9V3" /><path d="M7 15h10" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  "chevron-down": <><path d="m6 9 6 6 6-6" /></>,
  "chevron-right": <><path d="m9 6 6 6-6 6" /></>,
  sparkles: <><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
  trash: <><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></>,
  "zoom-in": <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" /></>,
  "zoom-out": <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M8 11h6" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  code: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
  rotate: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
  external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  bulb: <><path d="M9 18h6M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" /></>,
  trophy: <><path d="M8 21h8M12 17v4" /><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5" /></>,
  terminal: <><path d="m4 17 6-6-6-6M12 19h8" /></>,
  network: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><path d="M10 6.5h4M17.5 10v4M6.5 10v4h11" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  alert: <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5M12 17h.01" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  "eye-off": <><path d="m3 3 18 18M10.6 6.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4.4-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m20 4-9.5 9.5M8.1 8.1 20 20M14.5 14.5 20 4" /></>,
  "git-branch": <><circle cx="6" cy="4" r="2" /><circle cx="6" cy="20" r="2" /><circle cx="18" cy="8" r="2" /><path d="M6 6v12M8 8h6a4 4 0 0 1 4 4v0" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  fingerprint: <><path d="M12 3a9 9 0 0 0-9 9v3M21 12a9 9 0 0 0-5-8" /><path d="M7 12a5 5 0 0 1 10 0v4M12 12v7M9 21v-4" /></>,
  binary: <><rect x="3" y="4" width="7" height="7" rx="1" /><rect x="14" y="13" width="7" height="7" rx="1" /><path d="M6.5 4v7M17.5 13v7M3 11h7M14 20h7" /></>,
  vault: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></>,
  wrench: <><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7Z" /></>,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></>,
  medal: <><circle cx="12" cy="14" r="5.5" /><path d="M9 9.5 7 3h4l1 3 1-3h4l-2 6.5" /><path d="m10.5 14 1.2 1.2 2-2.4" /></>,
  zap: <><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v5" /></>,
  github: <><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" /></>,
  file: <><path d="M6 2h8l4 4v16H6V2Z" /><path d="M14 2v4h4M9 12h6M9 16h6" /></>,
  swap: <><path d="M4 8h13l-3-3M20 16H7l3 3" /></>,
  dice: <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.2" /><circle cx="15.5" cy="15.5" r="1.2" /><circle cx="15.5" cy="8.5" r="1.2" /><circle cx="8.5" cy="15.5" r="1.2" /></>,
  radio: <><circle cx="12" cy="12" r="1.5" /><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></>,
};

export function Icon({ name, size = 16, className = "", ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
