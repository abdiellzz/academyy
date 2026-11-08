# Lista de control de calidad · FactionVault

La comprobación automatizada cubre datos del curso, objetivos, referencias, rutas de laboratorios, la distribución del examen, límites del intérprete Python y compatibilidad del cifrado. No sustituye las pruebas manuales con estudiantes, tecnologías de asistencia ni dispositivos reales.

## Antes de publicar

- [x] `npm run verify`: estructura y datos de los 7 mundos, los 50 niveles, retos, fuentes, laboratorios y preguntas.
- [x] Muestreo del examen: 18 preguntas, al menos 2 por mundo, diferencia máxima de 1 pregunta entre mundos.
- [x] Intérprete didáctico: salidas esperadas, rechazo de código fuera del subconjunto y límites incluidos.
- [x] AES-GCM: formato nuevo aleatorio y lectura del formato antiguo.
- [x] `npx tsc -p tsconfig.json --noEmit` y build de producción.
- [x] Presupuesto del HTML único: 950 kB sin comprimir y 315 kB gzip.
- [ ] Probar con teclado solamente: menú, paleta de búsqueda, pestañas, laboratorios, examen y confirmación de borrado.
- [ ] Probar con NVDA/Firefox y VoiceOver/Safari, especialmente la captura de red y mensajes de resultado.
- [ ] Medir contraste de texto y estados de foco de todos los biomas; la paleta pixelada usa tonos personalizados.
- [ ] Probar a 320, 360, 768 y 1280 px, zoom del 200 % y orientación horizontal en un teléfono real.
- [ ] Comparar animación del planeta con movimiento reducido, pestaña oculta y desplazamiento fuera de pantalla.
- [ ] Hacer una revisión pedagógica con estudiantes principiantes: claridad de objetivos, instrucciones y retroalimentación.

## Registro editorial

Las tarjetas de referencia muestran la fecha en que se revisó el enlace/consejo. Cuando una recomendación normativa cambie, actualizar el contenido y la fecha; no tratar una fecha de revisión como garantía de vigencia futura.
