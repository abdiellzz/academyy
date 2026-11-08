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
    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
    let movimientoReducido = movimiento.matches;
    const start = performance.now();

    const draw = (now: number) => {
      const { accent: ac, markers: mk } = cfg.current;
      renderGlobe(img.data, rot.current, hexToRgb(ac), now - start, mk);
      pixelarTierra(img.data, PIX, small.data, LOW);
      ctx.putImageData(small, 0, 0);
    };
    drawRef.current = draw;

    draw(start + 1600);

    let raf = 0;
    let last = 0;
    let enPantalla = true;
    let pestañaVisible = document.visibilityState === "visible";
    const detener = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const loop = (now: number) => {
      raf = 0;
      if (!enPantalla || !pestañaVisible) return;
      // ~30 fps cuando está visible; se pausa fuera de pantalla o en otra pestaña.
      if (now - last >= 32) {
        last = now;
        rot.current += 0.0085 + vel.current;
        vel.current *= 0.94;
        if (Math.abs(vel.current) < 0.0004) vel.current = 0;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };
    const programar = () => {
      if (enPantalla && pestañaVisible && !movimientoReducido && !raf) raf = requestAnimationFrame(loop);
      else if (!enPantalla || !pestañaVisible || movimientoReducido) detener();
    };
    const alCambiarMovimiento = () => {
      movimientoReducido = movimiento.matches;
      if (movimientoReducido) draw(performance.now());
      programar();
    };
    const observador = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entrada]) => {
      enPantalla = entrada.isIntersecting;
      programar();
    }, { threshold: 0 }) : null;
    observador?.observe(canvas);
    const alCambiarVisibilidad = () => { pestañaVisible = document.visibilityState === "visible"; programar(); };
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    movimiento.addEventListener("change", alCambiarMovimiento);
    programar();
    return () => {
      detener();
      observador?.disconnect();
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      movimiento.removeEventListener("change", alCambiarMovimiento);
    };
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
