/* Aviso de self-XSS en consola.
   No bloqueamos selección/copia: el navegador ya recibió el contenido y bloquearlo
   no evita que se extraiga; sí perjudica accesibilidad y usos legítimos. Los derechos
   y permisos se describen en LICENSE y en la política de propiedad intelectual. */

export function installProtection(): void {
  // Nota: el anti-iframe (anti-clickjacking) está desactivado a propósito para
  // poder mostrar la app dentro de vistas previas y demos embebidas.
  // Si algún día se quiere reactivar, va aquí, antes del aviso de consola.

  try {
    console.log("%c¡ALTO! ✋", "font: 28px 'Press Start 2P', monospace; color:#ff5a6a; text-shadow:3px 3px 0 #000");
    console.log(
      "%cEsta consola es para desarrolladores. Si alguien te dijo que pegaras algo aquí para «ganar V-Bucks», «desbloquear skins» o «verificar tu cuenta», es una ESTAFA llamada self-XSS: ese código puede robar tu sesión y tus datos.\n\nFactionVault · creada por Abdiel Camargo · github.com/abdiellzz · linkedin.com/in/camargoabdiel",
      "font: 14px monospace; color:#f3ecff; line-height:1.5"
    );
  } catch { /* sin consola */ }

}
