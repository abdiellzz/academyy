/* Puente entre el buscador global y las vistas que tienen su propio campo de
   búsqueda (glosario). Evita inventar rutas con parámetros para algo tan simple. */
let pendiente = "";

export function pedirBusqueda(q: string) {
  pendiente = q;
}

export function tomarBusqueda(): string {
  const q = pendiente;
  pendiente = "";
  return q;
}
