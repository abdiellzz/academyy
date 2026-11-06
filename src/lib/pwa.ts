/* Registro del service worker (solo en producción).
   En desarrollo se desactiva para no cachear archivos a medio editar. */
export function registrarSW(): void {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const env = (import.meta as unknown as { env?: { PROD?: boolean } }).env;
  if (env && env.PROD === false) {
    // Limpieza por si quedó uno de una versión anterior.
    navigator.serviceWorker.getRegistrations?.().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
    return;
  }
  window.addEventListener("load", () => {
    // Solo registramos si el archivo está publicado: así nunca aparece un 404
    // en la consola cuando la app se sirve sin el service worker.
    fetch("./sw.js", { method: "HEAD" })
      .then((r) => (r.ok ? navigator.serviceWorker.register("./sw.js") : null))
      .catch(() => null);
  });
}
