export const INTERVALOS_REPASO_DIAS = [1, 3, 7, 14, 30] as const;

export interface PlanRepaso {
  nivel: number;
  dias: number;
  proxima: string;
}

export function fechaLocalClave(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

/** Reprograma tras autoevaluación: al recordar aumenta el intervalo; si costó, vuelve a mañana. */
export function siguienteRepaso(nivelActual: number, loRecordo: boolean, hoy = new Date()): PlanRepaso {
  const nivelSeguro = Math.max(0, Math.min(INTERVALOS_REPASO_DIAS.length, Math.floor(nivelActual)));
  const nivel = loRecordo ? Math.min(nivelSeguro + 1, INTERVALOS_REPASO_DIAS.length) : 0;
  const dias = loRecordo ? INTERVALOS_REPASO_DIAS[Math.min(nivelSeguro, INTERVALOS_REPASO_DIAS.length - 1)] : 1;
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  fecha.setDate(fecha.getDate() + dias);
  return { nivel, dias, proxima: fechaLocalClave(fecha) };
}
