/* Arte pixel dibujado a mano como matrices de caracteres.
   Cada carácter es un pixel; "." es transparente. Se renderiza a SVG nítido (crispEdges). */

export type Palette = Record<string, string>;

interface PixelArtProps {
  grid: string[];
  palette: Palette;
  height?: number;
  className?: string;
  title?: string;
}

function runs(grid: string[]) {
  const out: { x: number; y: number; w: number; c: string }[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === "." || c === " ") { x += 1; continue; }
      let w = 1;
      while (row[x + w] === c) w += 1;
      out.push({ x, y, w, c });
      x += w;
    }
  });
  return out;
}

export function PixelArt({ grid, palette, height = 32, className, title }: PixelArtProps) {
  const w = Math.max(...grid.map((r) => r.length));
  const h = grid.length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      height={height}
      width={(height * w) / h}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {runs(grid).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={palette[r.c] ?? "transparent"} />
      ))}
    </svg>
  );
}

export function pixelSvgString(grid: string[], palette: Palette): string {
  const w = Math.max(...grid.map((r) => r.length));
  const h = grid.length;
  const rects = runs(grid).map((r) => `<rect x='${r.x}' y='${r.y}' width='${r.w}' height='1' fill='${palette[r.c]}'/>`).join("");
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'>${rects}</svg>`;
}

/* ───────────── Mascota: el mono de FactionVault con su cofre ───────────── */

export const MONKEY_PALETTE: Palette = {
  B: "#3d1d12", // contorno marrón
  O: "#f07a1e", // naranja
  L: "#ff9a3c", // naranja claro
  D: "#c9520c", // naranja oscuro
  C: "#f8d9a8", // crema
  c: "#dfb487", // crema sombra
  P: "#f39a6b", // mejillas
  T: "#d9620f", // cofre
  Y: "#ff9a3c", // cofre claro
  G: "#ffcc33", // cerradura
  W: "#e07a2a", // base del cofre
};

export const MONKEY_GRID = [
  "...........BBBB...........",
  "..........BLLOB...........",
  ".........BLOBB............",
  "......BBBBOOBBBBB.........",
  ".....BLOOOOOOOOOOB........",
  "....BLOOCCCOOCCCOOB.......",
  "..BBBOOCCCCCCCCCCCOBBB....",
  ".BLOBOCCCCCCCCCCCCCOBOOB..",
  "BLCcBOCCBBCCCCCBBCCOBcCOB.",
  "BOCcBOCCBBCCCCCBBCCOBcCOB.",
  "BOCCBOCCCCCCBBBCCCCOBCCOB.",
  ".BOOBOCPPCCCCBCCCPPOBOOB..",
  "..BBBOCCCBCCCCCBCCCOBBB...",
  ".....BOCCCBBBBBCCCOB......",
  "......BOOCCCCCCCOOB.......",
  ".......BBDDDDDDDBBBBBBBB..",
  "......BOOCCCCDDBYYYYYYYYB.",
  ".....BOOCCCCCOBYYYBGGBYYYB",
  ".....BOCCCCCCOBBBBBGGBBBBB",
  ".....BOOCCCCCOBTTTTGGTTTTB",
  ".....BLOOCCCOOBTTTTTTTTTTB",
  "......BOOOOOOBBWWWWWWWWWWB",
  ".......BBBBBBBBBBBBBBBBBBB",
];

export function MonkeyMascot({ height = 64, className = "" }: { height?: number; className?: string }) {
  return <PixelArt grid={MONKEY_GRID} palette={MONKEY_PALETTE} height={height} className={className} title="Mono de FactionVault con su cofre" />;
}

export function monkeyFaviconSvg(): string {
  return pixelSvgString(MONKEY_GRID.slice(0, 15), MONKEY_PALETTE);
}

/* ───────────── Iconos pixel ───────────── */

export type PixelIconName =
  | "grass" | "chest" | "storm" | "diablo" | "ship" | "heart" | "diamond" | "snake"
  | "monitor" | "globe" | "pickaxe" | "key" | "xp" | "flag" | "torch" | "sword" | "home";

const ICONS: Record<PixelIconName, { grid: string[]; palette: Palette }> = {
  grass: {
    grid: ["GGGGGGGG", "GgGGGgGG", "gDgGDgDg", "DDDdDDDD", "DdDDDDdD", "DDDDdDDD", "DdDDDDDD", "DDDdDDdD"],
    palette: { G: "#5fb83a", g: "#3f8f2a", D: "#8b5a2b", d: "#6b4220" },
  },
  chest: {
    grid: ["BBBBBBBB", "BOOOOOOB", "BLLLLLLB", "BBBGGBBB", "BTTGGTTB", "BTTTTTTB", "BTTTTTTB", "BBBBBBBB"],
    palette: { B: "#3d1d12", O: "#f07a1e", L: "#ff9a3c", G: "#ffcc33", T: "#c9520c" },
  },
  storm: {
    grid: ["..PPPP..", ".PpPPPP.", "PPPPpPPP", ".PPPPPP.", "...YY...", "..YY....", ".YYYY...", "...Y...."],
    palette: { P: "#8a4fff", p: "#b98cff", Y: "#ffe14a" },
  },
  diablo: {
    grid: [".RRRRRRRRRR.", "RYWWRWWRWWYR", "RYWWRWWRWWYR", "RGGGGGGGGGGR", "RRBRRRRRBRRR", ".KK......KK.", ".KK......KK."],
    palette: { R: "#e8322b", Y: "#ffcc33", W: "#bfe8ff", G: "#2fb24a", B: "#1d5ad8", K: "#1a1a1a" },
  },
  ship: {
    grid: ["....RB......", "...RRBB.....", "..WWWWWWWW..", ".OOOOOOOOOO.", "BBBBBBBBBBBB", ".bbbbbbbbbb.", "~~~~~~~~~~~~"],
    palette: { R: "#e8322b", B: "#1d5ad8", W: "#e0e0e0", O: "#f07a1e", b: "#163f9e", "~": "#2a8fd8" },
  },
  heart: {
    grid: [".RR.RR.", "RWRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."],
    palette: { R: "#ff3b3b", W: "#ffb3b3" },
  },
  diamond: {
    grid: ["..BBBB..", ".BbWWbB.", "BbWbbWbB", "BbbbbbbB", ".BbbbbB.", "..BbbB..", "...BB..."],
    palette: { B: "#0f6f73", b: "#4be0e6", W: "#d6ffff" },
  },
  snake: {
    grid: ["..BBBB..", ".BbbbbB.", ".BbWbbB.", ".BbbbB..", "..BYYYB.", ".BYYYYB.", "BYYYYB..", "BYYB...."],
    palette: { B: "#123a5c", b: "#3776ab", W: "#ffffff", Y: "#ffd43b" },
  },
  monitor: {
    grid: ["BBBBBBBBBB", "BGGGGGGGGB", "BGgGGGGGGB", "BGGgggGGGB", "BGGGGGGGGB", "BBBBBBBBBB", "....BB....", "..BBBBBB.."],
    palette: { B: "#2b2b2b", G: "#103b1c", g: "#3ee07a" },
  },
  globe: {
    grid: ["..BBBB..", ".BbGGbB.", "BbGGbbbB", "BGGGbGbB", "BbGbbGGB", "BbbbGGbB", ".BbbbbB.", "..BBBB.."],
    palette: { B: "#0b2f55", b: "#2a8fd8", G: "#5fb83a" },
  },
  pickaxe: {
    grid: ["..CCCC..", ".C....C.", "C..WW..C", "...WW...", "...WW...", "...WW...", "...WW...", "...WW..."],
    palette: { C: "#4be0e6", W: "#8b5a2b" },
  },
  key: {
    grid: [".YYY....", "Y...Y...", "Y...YYYY", "Y...Y.Y.", ".YYY..YY"],
    palette: { Y: "#ffcc33" },
  },
  xp: {
    grid: ["..GG..", ".GgGG.", "GgGGGG", "GGGGGG", ".GGGG.", "..GG.."],
    palette: { G: "#7cff3a", g: "#e0ffc0" },
  },
  flag: {
    grid: ["WWWWRRRR", "WBWWRRRR", "WWWWRRRR", "BBBBWWWW", "BBBBWRWW", "BBBBWWWW"],
    palette: { W: "#ffffff", R: "#d21034", B: "#072357" },
  },
  torch: {
    grid: ["..YY..", ".YOOY.", "..OO..", "..WW..", "..WW..", "..WW..", "..WW.."],
    palette: { Y: "#ffe14a", O: "#ff8a1e", W: "#8b5a2b" },
  },
  home: {
    grid: ["...RR...", "..RRRR..", ".RRRRRR.", "RRRRRRRR", ".WWWWWW.", ".WWDDWW.", ".WWDDWW.", ".WWWWWW."],
    palette: { R: "#e8322b", W: "#c3b6df", D: "#3d3160" },
  },
  sword: {
    grid: [".......CC", "......CWC", ".....CWC.", "....CWC..", ".B.CWC...", "..BWC....", "..WB.....", ".W..B...."],
    palette: { C: "#4be0e6", W: "#d6ffff", B: "#8b5a2b" },
  },
};

export function PixelIcon({ name, size = 20, className }: { name: PixelIconName; size?: number; className?: string }) {
  const icon = ICONS[name];
  return <PixelArt grid={icon.grid} palette={icon.palette} height={size} className={className} />;
}
