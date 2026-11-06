export function caesar(text: string, k: number, decode = false): string {
  const s = (((decode ? -k : k) % 26) + 26) % 26;
  return text.replace(/[a-z]/gi, (c) => {
    const b = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - b + s) % 26) + b);
  });
}

export function normalizar(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,;¡!¿?"']/g, "").replace(/\s+/g, " ");
}

const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

export async function sha(text: string, algo: "SHA-256" | "SHA-1" | "SHA-512" = "SHA-256"): Promise<string> {
  try {
    return hex(new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(text))));
  } catch {
    return "(WebCrypto no disponible: abre la página con https o localhost)";
  }
}

export function entropia(pw: string): number {
  if (!pw) return 0;
  let pool = 0;
  if (/[a-záéíóúñü]/.test(pw)) pool += 26;
  if (/[A-ZÁÉÍÓÚÑÜ]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/.test(pw)) pool += 32;
  if (/\s/.test(pw)) pool += 1;
  const comunes = ["123456", "password", "qwerty", "panama", "fortnite", "minecraft", "admin", "contraseña"];
  const penal = comunes.some((c) => pw.toLowerCase().includes(c)) ? 0.5 : 1;
  return pool > 1 ? Math.round(pw.length * Math.log2(pool) * penal) : 0;
}

export function tiempoCrack(bits: number): string {
  const s = Math.pow(2, Math.max(0, bits - 1)) / 1e10;
  if (s < 1) return "menos de un segundo";
  const u: [number, string][] = [[60, "segundos"], [3600, "minutos"], [86400, "horas"], [31536000, "días"]];
  if (s < 60) return `${Math.round(s)} segundos`;
  if (s < 3600) return `${Math.round(s / 60)} minutos`;
  if (s < 86400) return `${Math.round(s / 3600)} horas`;
  if (s < 31536000) return `${Math.round(s / 86400)} días`;
  const y = s / 31536000;
  void u;
  if (y < 1000) return `${Math.round(y)} años`;
  if (y < 1e6) return `${Math.round(y / 1000)} mil años`;
  if (y < 1e9) return `${Math.round(y / 1e6)} millones de años`;
  return "más que la edad del universo";
}

export function modPow(b: number, e: number, m: number): number {
  let r = 1; b %= m;
  while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; }
  return r;
}

const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function clave(pass: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as BufferSource, iterations: 100000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function aesCifrar(texto: string, pass: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, await clave(pass, salt), new TextEncoder().encode(texto)));
  return `FV.${b64(salt)}.${b64(iv)}.${b64(ct)}`;
}

export async function aesDescifrar(payload: string, pass: string): Promise<{ ok: boolean; texto: string }> {
  try {
    const [v, s, i, c] = payload.trim().split(".");
    if (v !== "FV" || !c) return { ok: false, texto: "Formato no reconocido: debe empezar por FV." };
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(i) as BufferSource }, await clave(pass, unb64(s)), unb64(c) as BufferSource);
    return { ok: true, texto: new TextDecoder().decode(pt) };
  } catch {
    return { ok: false, texto: "No se pudo descifrar: contraseña incorrecta o datos alterados. ¡La etiqueta GCM te protegió!" };
  }
}
