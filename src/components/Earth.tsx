import { useEffect, useRef } from "react";

/* Tierra pixelada girando en canvas.
   - Mapa de continentes de baja resolución (equirectangular 64×32), proyectado en esfera.
   - Luz lateral con terminador oscuro, atmósfera con glow pixelado y una luna orbitando.
   - Renderiza a baja resolución y escala con image-rendering: pixelated. */

const MAP = [
  "................................................................",
  "..............###.......................####....................",
  "......#########.####..........#.....##########.######...........",
  "...###############.##.......####...####################.####....",
  "..#################.........###..#########################......",
  "...###############..........##..##########################......",
  "....#############..............###########################......",
  ".....###########...............#########################.#......",
  "......#########...............##########################........",
  ".......########...............#.#######################.........",
  "........#####.................###.#####################.........",
  ".........###.#...............#######.################...........",
  "..........###...............###########..##########.............",
  "...........##...............############...#######..............",
  "............#####...........#############...#####..#............",
  "............#######..........############....###....#...........",
  "............########..........##########.....##.....##..........",
  "............#########..........########...............#.........",
  ".............########..........#######.............######.......",
  "..............######...........######.............########......",
  "..............#####.............####..............#########.....",
  "..............####..............###...............#########.....",
  "..............###................#.................#######......",
  "..............##.....................................###........",
  "..............#.................................................",
  "................................................................",
  "................................................................",
  "...........................................................#....",
  ".....####.........###############.....######################....",
  "..#######################################################.......",
  "################################################################",
  "################################################################",
];
const W = MAP[0].length;
const H = MAP.length;

export function Earth({ size = 360, label = "Tierra pixelada girando" }: { size?: number; label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const R = 46; // radio en píxeles de baja resolución
    const S = 128; // lienzo lógico
    canvas.width = S;
    canvas.height = S;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = ctx.createImageData(S, S);
    const cx = S / 2, cy = S / 2;
    const tilt = 0.4;
    const light = { x: -0.75, y: -0.35, z: 0.56 };
    let rot = 0;
    let raf = 0;
    let last = 0;

    function put(x: number, y: number, r: number, g: number, b: number, a = 255) {
      if (x < 0 || y < 0 || x >= S || y >= S) return;
      const i = (y * S + x) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = a;
    }

    function frame(t: number) {
      if (t - last < 70 && !reduce) { raf = requestAnimationFrame(frame); return; } // ~14 fps, aire retro
      last = t;
      img.data.fill(0);
      // atmósfera: anillos pixelados
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const d = Math.hypot(x - cx + 0.5, y - cy + 0.5);
        if (d > R && d <= R + 2) put(x, y, 90, 210, 255, 200);
        else if (d > R + 2 && d <= R + 4) put(x, y, 90, 170, 255, 90);
        else if (d > R + 4 && d <= R + 6) put(x, y, 120, 120, 255, 35);
      }
      // esfera
      for (let y = -R; y <= R; y++) {
        for (let x = -R; x <= R; x++) {
          const dd = x * x + y * y;
          if (dd > R * R) continue;
          const nx = x / R, ny = y / R, nz = Math.sqrt(1 - nx * nx - ny * ny);
          // inclinación del eje
          const y2 = ny * Math.cos(tilt) - nz * Math.sin(tilt);
          const z2 = ny * Math.sin(tilt) + nz * Math.cos(tilt);
          const lat = Math.asin(Math.max(-1, Math.min(1, y2)));
          let lon = Math.atan2(nx, z2) + rot;
          lon = ((lon % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          const mx = Math.floor((lon / (Math.PI * 2)) * W) % W;
          const my = Math.min(H - 1, Math.floor(((lat + Math.PI / 2) / Math.PI) * H));
          const land = MAP[my][mx] === "#";
          const polar = my <= 0 || my >= H - 3;
          const lum = nx * light.x + ny * light.y + nz * light.z;
          const shade = lum > 0.35 ? 1 : lum > 0.05 ? 0.72 : lum > -0.15 ? 0.42 : 0.16; // bandas de luz = terminador pixel
          let r: number, g: number, b: number;
          if (polar) { r = 236; g = 244; b = 255; }
          else if (land) {
            const desert = (my > 9 && my < 13 && mx > 30 && mx < 42) || (my > 17 && my < 22 && mx > 50);
            [r, g, b] = desert ? [214, 170, 92] : (mx + my) % 5 === 0 ? [46, 150, 64] : [62, 190, 86];
          } else {
            [r, g, b] = (mx * 3 + my) % 7 === 0 ? [36, 108, 210] : [28, 84, 186];
          }
          if (shade < 0.2 && land && (mx * 7 + my * 13) % 11 === 0) { r = 255; g = 214; b = 110; } // luces de ciudades en la noche
          else { r *= shade; g *= shade; b *= shade; }
          put(cx + x, cy + y, r, g, b);
        }
      }
      // luna orbitando
      const ang = t / 3200;
      const mxp = Math.round(cx + Math.cos(ang) * 58);
      const myp = Math.round(cy + Math.sin(ang) * 18);
      const behind = Math.sin(ang) < 0;
      for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {
        if (x * x + y * y > 16) continue;
        const px = mxp + x, py = myp + y;
        if (behind && Math.hypot(px - cx, py - cy) < R + 1) continue;
        const crater = (x === 1 && y === -1) || (x === -2 && y === 1) || (x === 2 && y === 2);
        const lit = x < 2;
        put(px, py, crater ? 150 : lit ? 215 : 140, crater ? 150 : lit ? 210 : 136, crater ? 160 : lit ? 200 : 150);
      }
      ctx!.putImageData(img, 0, 0);
      rot += 0.035;
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      style={{ width: size, height: size, maxWidth: "100%", imageRendering: "pixelated" }}
    />
  );
}
