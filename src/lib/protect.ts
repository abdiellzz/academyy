/* Endurecimiento del lado del cliente (disuasorio; la protección real es la licencia).
   - Aviso de self-XSS en consola.
   - Copia masiva de contenido se recorta con atribución.
   (El anti-clickjacking quedó desactivado: rompía las vistas previas embebidas.) */

export function installProtection(): void {
  // Nota: el anti-iframe (anti-clickjacking) está desactivado a propósito para
  // poder mostrar la app dentro de vistas previas y demos embebidas.
  // Si algún día se quiere reactivar, va aquí, antes del aviso de consola.

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
