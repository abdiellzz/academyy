import { useEffect, useRef } from "react";
import { SIZE, hexToRgb, pixelarTierra, renderGlobe, type Marker } from "../lib/planet";

/** Cuántos píxeles del render se juntan en un bloque de pixel art. */
const PIX = 4;

/* Tierra en canvas: gira sola, se puede arrastrar y su atmósfera toma
   el color del mundo que tengas elegido. */

interface GlobeProps {
  accent?: string;
  markers?: Marker[];
  label?: string;
  className?: string;
}

export function Globe({
  accent = "#ffb02e",
  markers = [],
  label = "La Tierra pixelada en 3D girando, con su luna orbitando",
  className,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rot = useRef(2.2);
  const vel = useRef(0);
  const drag = useRef({ active: false, x: 0 });
  const cfg = useRef({ accent, markers });
  const drawRef = useRef<(t: number) => void>(() => {});
  cfg.current = { accent, markers };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Se renderiza a 1/PIX de resolución y el navegador lo amplía con nearest
    // neighbor: así la Tierra queda en pixel art de bloques grandes.
    const LOW = SIZE / PIX;
    canvas.width = LOW;
    canvas.height = LOW;
    const img = ctx.createImageData(SIZE, SIZE);
    const small = ctx.createImageData(LOW, LOW);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    const draw = (now: number) => {
      const { accent: ac, markers: mk } = cfg.current;
      renderGlobe(img.data, rot.current, hexToRgb(ac), now - start, mk);
      pixelarTierra(img.data, PIX, small.data, LOW);
      ctx.putImageData(small, 0, 0);
    };
    drawRef.current = draw;

    if (reduce) {
      draw(start + 1600);
      return;
    }

    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      // ~30 fps: suficiente para que gire suave y sobra para el aire retro
      if (now - last >= 32) {
        last = now;
        rot.current += 0.0085 + vel.current;
        vel.current *= 0.94;
        if (Math.abs(vel.current) < 0.0004) vel.current = 0;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // al cambiar de mundo solo se redibuja: la animación no se reinicia
  useEffect(() => {
    drawRef.current(performance.now());
  }, [accent, markers]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      draggable={false}
      onPointerDown={(e) => {
        const c = e.currentTarget;
        drag.current = { active: true, x: e.clientX };
        c.setPointerCapture(e.pointerId);
        c.style.cursor = "grabbing";
      }}
      onPointerMove={(e) => {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.x;
        drag.current.x = e.clientX;
        rot.current -= dx * 0.012;
        vel.current = Math.max(-0.06, Math.min(0.06, -dx * 0.0035));
      }}
      onPointerUp={(e) => {
        drag.current.active = false;
        e.currentTarget.style.cursor = "grab";
      }}
      onPointerCancel={(e) => {
        drag.current.active = false;
        e.currentTarget.style.cursor = "grab";
      }}
      className={className}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        imageRendering: "pixelated",
        touchAction: "pan-y",
        cursor: "grab",
        display: "block",
      }}
    />
  );
}
