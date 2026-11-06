/* Endurecimiento del lado del cliente (disuasorio; la protección real es la licencia).
   - Aviso de self-XSS en consola.
   - Anti-clickjacking: no se deja incrustar en otros sitios.
   - Copia masiva de contenido se recorta con atribución. */

/* Hosts donde sí se permite el iframe: archivo local, desarrollo y vistas
   previas (sandbox/e2b, Arena). Fuera de estos, la app no se deja incrustar. */
const HOSTS_DE_CONFIANZA =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|.*\.(e2b\.app|e2b\.dev|e2b\.cloud|arena\.ai|arena\.dev|arena\.run))$/i;

function enEntornoDeDesarrollo(): boolean {
  try {
    if (window.location.protocol === "file:") return true;
    // escape manual: ?embed=1 permite incrustarla a propósito (demos, aulas)
    if (new URLSearchParams(window.location.search).get("embed") === "1") return true;
    const host = window.location.hostname;
    if (!host) return true; // algunos file:// no dan hostname
    return HOSTS_DE_CONFIANZA.test(host);
  } catch {
    return true;
  }
}

export function installProtection(): void {
  if (!enEntornoDeDesarrollo()) {
    try {
      if (window.top && window.top !== window.self) window.top.location.href = window.self.location.href;
    } catch {
      document.body.textContent = "FactionVault no puede mostrarse dentro de otro sitio.";
    }
  }

  try {
    console.log("%c¡ALTO! ✋", "font: 28px 'Press Start 2P', monospace; color:#ff5a6a; text-shadow:3px 3px 0 #000");
    console.log(
      "%cEsta consola es para desarrolladores. Si alguien te dijo que pegaras algo aquí para «ganar V-Bucks», «desbloquear skins» o «verificar tu cuenta», es una ESTAFA llamada self-XSS: ese código puede robar tu sesión y tus datos.\n\nFactionVault · hecha por @abdiellzz · github.com/abdiellzz",
      "font: 14px monospace; color:#f3ecff; line-height:1.5"
    );
  } catch { /* sin consola */ }

  document.addEventListener("copy", (e) => {
    const t = e.target as HTMLElement | null;
    if (t?.closest?.("input, textarea, [data-allow-copy]")) return;
    const sel = window.getSelection()?.toString() ?? "";
    if (sel.length > 200) {
      e.preventDefault();
      e.clipboardData?.setData("text/plain", `${sel.slice(0, 200)}…\n\n— FactionVault, hecha por @abdiellzz (github.com/abdiellzz). Comparte el enlace, no el código 😉`);
    }
  });
}
