import type { PixelIconName } from "../components/PixelArt";

export interface NivelRuta { mundo: string; nivel: string }
export interface RutaAprendizaje {
  id: string;
  titulo: string;
  para: string;
  icono: PixelIconName;
  niveles: NivelRuta[];
  proyecto: string;
  resultado: string;
}
export interface PasoProyecto {
  titulo: string;
  instrucciones: string[];
  evidencia: string;
  entregaParcial: string;
  registro: string;
  pregunta: string;
  opciones: string[];
  correcta: number;
  porQue: string;
}
export interface ProyectoFinal {
  id: string;
  titulo: string;
  subtitulo: string;
  objetivo: string;
  producto: string;
  minutos: number;
  pasos: PasoProyecto[];
}

export const PROYECTOS: ProyectoFinal[] = [
  {
    id: "escudo-cuenta",
    titulo: "Construye un plan de defensa de cuenta",
    subtitulo: "Audita una cuenta ficticia y entrega un plan comprobable de protección y recuperación.",
    objetivo: "Priorizar activos, verificar señales de acceso y definir controles que la persona pueda aplicar sin compartir secretos.",
    producto: "Hoja de defensa: alcance, evidencia, controles y ensayo de recuperación.",
    minutos: 20,
    pasos: [
      {
        titulo: "Delimita el alcance e inventaría lo importante",
        instrucciones: ["Trabaja solo con la cuenta de demostración de Lucía; no escribas aquí tus correos ni contraseñas reales.", "Identifica qué servicio puede recuperar a los demás y qué datos causarían mayor daño si se pierden.", "Anota el alcance: cuenta afectada, persona responsable y acciones que sí están autorizadas."],
        evidencia: "CASO FICTICIO · lucia@luz.example\nServicios vinculados: correo principal, tienda de juegos, almacenamiento de fotos\nRecuperación de las otras cuentas: correo principal\nAutorización: Lucía pidió ayuda para revisar su propia cuenta de demostración",
        entregaParcial: "Inventario y alcance",
        registro: "Escribe cuál cuenta protegerías primero y qué impacto tendría perderla. No incluyas datos tuyos.",
        pregunta: "¿Qué activo conviene priorizar en este caso y por qué?",
        opciones: ["La cuenta de juegos porque tiene más notificaciones", "El correo principal porque permite recuperar las otras cuentas", "El nombre visible porque aparece en el perfil"],
        correcta: 1,
        porQue: "El correo principal funciona como raíz de recuperación. Protegerlo reduce el riesgo en las cuentas vinculadas; registra esta prioridad y su razón en el inventario.",
      },
      {
        titulo: "Audita las señales sin adivinar",
        instrucciones: ["Separa hechos observados de lo que todavía es una hipótesis.", "Compara hora, dispositivo y ubicación aproximada con la actividad que la titular reconoce.", "No abras enlaces del aviso ni intentes reproducir un inicio de sesión sospechoso."],
        evidencia: "08:41 · mensaje entrante: «Confirma tu cuenta en 15 minutos»\n08:47 · inicio de sesión correcto desde un dispositivo nuevo\n08:49 · la titular indica que no reconoce ese dispositivo\nEl mensaje no aporta evidencia verificable de que sea del servicio oficial",
        entregaParcial: "Hallazgo inicial y nivel de certeza",
        registro: "Anota dos observaciones verificables y una hipótesis que aún necesite confirmación.",
        pregunta: "¿Cuál frase separa mejor la evidencia de una conclusión no demostrada?",
        opciones: ["El registro muestra un acceso desde un dispositivo nuevo que la titular no reconoce; hay que validar más contexto", "El dispositivo nuevo demuestra quién atacó la cuenta", "Todo correo urgente confirma que ya robaron la contraseña"],
        correcta: 0,
        porQue: "El registro y la confirmación de la titular son observaciones. La identidad de quien accedió y el método siguen sin demostrarse.",
      },
      {
        titulo: "Construye los controles preventivos",
        instrucciones: ["Define una contraseña larga y única para cada servicio; guárdala en un gestor confiable.", "Activa una passkey o llave de seguridad cuando el servicio la admita; configura un segundo factor alternativo seguro.", "Revisa que los métodos de recuperación sean actuales y guarda los códigos de recuperación fuera de la bandeja de entrada."],
        evidencia: "Revisión de controles\n□ Contraseña reutilizada en un foro de demostración\n□ Segundo factor: código SMS\n□ Correo de recuperación: revisar con la titular\n□ Códigos de recuperación: no se ha comprobado su resguardo",
        entregaParcial: "Lista de controles y brechas priorizadas",
        registro: "Escribe el primer control que implementarías y cómo comprobarías que quedó activo.",
        pregunta: "¿Qué segundo factor ofrece mejor resistencia al phishing cuando está disponible?",
        opciones: ["Passkey o llave de seguridad vinculada al sitio", "Un código de un solo uso dictado por teléfono", "La misma contraseña con un signo añadido"],
        correcta: 0,
        porQue: "Las passkeys y llaves WebAuthn verifican el origen del sitio. Ningún código de un solo uso debe compartirse con una persona que te contacte.",
      },
      {
        titulo: "Ensaya la recuperación y cierra el plan",
        instrucciones: ["Desde un dispositivo confiable, entra escribiendo tú la dirección oficial o usando la aplicación oficial.", "Cambia la clave expuesta, revoca sesiones que no reconozcas y revisa reenvíos, recuperación y métodos MFA.", "Registra quién hizo cada acción, cuándo y qué queda pendiente; vuelve a comprobar el acceso con la titular."],
        evidencia: "Simulación de respuesta\nSesión abierta no reconocida: sí\nRegla de reenvío desconocida: pendiente de revisar\nSistemas reales conectados: ninguno",
        entregaParcial: "Secuencia de respuesta y verificación final",
        registro: "Anota el orden de recuperación y una comprobación concreta para confirmar que la cuenta quedó bajo control.",
        pregunta: "¿Qué orden reduce mejor el riesgo y conserva una verificación útil?",
        opciones: ["Borrar avisos, vaciar la bandeja y esperar", "Usar un canal oficial, cambiar clave, revocar sesiones, revisar recuperación y confirmar con la titular", "Publicar la alerta y pedir que otras personas prueben el enlace"],
        correcta: 1,
        porQue: "La respuesta debe recuperar control desde una ruta confiable, invalidar acceso activo, comprobar persistencia y validar el resultado con la persona responsable.",
      },
    ],
  },
  {
    id: "triage-logs",
    titulo: "Audita registros y redacta un triage",
    subtitulo: "Construye una línea de tiempo a partir de registros ficticios y propone una respuesta proporcionada.",
    objetivo: "Preservar evidencia, identificar patrones y explicar el nivel de certeza sin confundir una señal con una atribución.",
    producto: "Nota de triage con alcance, línea de tiempo, evidencia, hipótesis y próximos pasos.",
    minutos: 25,
    pasos: [
      {
        titulo: "Define el alcance y preserva la fuente",
        instrucciones: ["Confirma que el caso y las direcciones pertenecen al laboratorio ficticio.", "Anota la ventana temporal y la zona horaria antes de comparar eventos.", "Conserva el fragmento original sin editar; trabaja sobre una copia de análisis."],
        evidencia: "CASO DE DEMOSTRACIÓN · equipo fv-lab-04\nFecha simulada: 12 de octubre de 2026 · zona UTC−5\nFuente: auth.log de práctica · ventana: 10:20–10:30\nNo se consultan equipos ni cuentas reales",
        entregaParcial: "Alcance, fuente y ventana temporal",
        registro: "Anota el sistema, la fuente del registro, la ventana y una limitación de estos datos ficticios.",
        pregunta: "¿Qué práctica ayuda a que otra persona pueda verificar tu análisis?",
        opciones: ["Conservar el original, registrar zona horaria y documentar la copia de trabajo", "Recortar las líneas que contradigan la primera sospecha", "Cambiar la hora del registro para ordenarlo"],
        correcta: 0,
        porQue: "La integridad y el contexto temporal hacen que la revisión sea reproducible. No alteres la evidencia original.",
      },
      {
        titulo: "Construye la línea de tiempo",
        instrucciones: ["Ordena los eventos cronológicamente usando la hora registrada.", "Cuenta los fallos por usuario y origen; distingue FAIL de Accepted.", "Marca el evento que amerita verificación, sin etiquetar aún a una persona como atacante."],
        evidencia: "12 oct 10:22:11 · FAIL · lucia · 198.51.100.23\n12 oct 10:23:08 · FAIL · lucia · 198.51.100.23\n12 oct 10:24:02 · FAIL · lucia · 198.51.100.23\n12 oct 10:25:19 · Accepted · lucia · 198.51.100.23\n12 oct 10:26:44 · Accepted · admin · 10.0.0.8",
        entregaParcial: "Línea de tiempo y patrón observado",
        registro: "Resume el patrón con hora, usuario, origen y número de fallos; describe el inicio correcto como un hecho observado.",
        pregunta: "¿Qué lectura es más rigurosa de esta secuencia?",
        opciones: ["Hubo tres fallos y luego un acceso correcto desde el mismo origen; es sospechoso, pero no demuestra quién lo hizo", "La IP identifica por sí sola a la persona responsable", "El acceso correcto desde 10.0.0.8 prueba que no hubo riesgo"],
        correcta: 0,
        porQue: "La correlación temporal merece investigar; una dirección IP no establece identidad y un evento interno posterior no borra los anteriores.",
      },
      {
        titulo: "Corrobora hipótesis con otras fuentes",
        instrucciones: ["Compara el evento con registros de MFA, inventario de dispositivos y confirmación de la persona.", "Comprueba si hubo cambios de recuperación, reenvíos o nuevas sesiones.", "Escribe qué dato adicional aumentaría o reduciría tu confianza; no hagas atribuciones con una sola fuente."],
        evidencia: "Fuentes todavía no revisadas\nRegistro MFA: desafío de 10:25, resultado no adjunto\nInventario: no indica si 198.51.100.23 es un origen esperado\nConfirmación de la titular: pendiente\nDirecciones del caso reservadas para documentación (TEST-NET)",
        entregaParcial: "Hipótesis, evidencia faltante y confianza",
        registro: "Redacta una hipótesis provisional y nombra dos verificaciones que necesitas antes de concluir.",
        pregunta: "¿Qué paso aporta contexto sin afirmar más de lo que los datos permiten?",
        opciones: ["Correlacionar MFA, dispositivo y confirmación de la titular con la misma ventana temporal", "Publicar la IP para que internet la identifique", "Declarar compromiso confirmado por el puerto o la dirección"],
        correcta: 0,
        porQue: "Correlacionar fuentes independientes reduce falsos positivos. Mantén la hipótesis provisional hasta tener evidencia suficiente.",
      },
      {
        titulo: "Redacta el triage y recomienda el siguiente paso",
        instrucciones: ["Escribe un resumen breve: alcance, observaciones, hipótesis y nivel de confianza.", "Si la titular no reconoce el acceso, recomienda revocar sesiones y proteger la cuenta por el canal oficial.", "Define quién debe revisar el caso y cómo se verificará que la respuesta funcionó."],
        evidencia: "Plantilla de hallazgo\nObservación: qué muestra directamente la fuente\nHipótesis: qué podría explicar el patrón\nConfianza: baja / media / alta, con motivo\nAcción siguiente: responsable + comprobación",
        entregaParcial: "Nota de triage reproducible",
        registro: "Escribe una recomendación que separe hechos de hipótesis e incluya responsable y verificación.",
        pregunta: "¿Qué respuesta inicial es proporcionada si la titular confirma que no reconoce el acceso?",
        opciones: ["Revocar sesiones, asegurar la cuenta desde dispositivo confiable, conservar registros y escalar según procedimiento", "Borrar los logs para eliminar el ruido", "Bloquear toda la red sin consultar alcance ni responsable"],
        correcta: 0,
        porQue: "Limita el acceso, conserva la evidencia y sigue el procedimiento de respuesta. Anota qué se hizo y cómo se comprobó.",
      },
    ],
  },
  {
    id: "triage-red",
    titulo: "Audita una captura de red ficticia",
    subtitulo: "Documenta el alcance, clasifica flujos y entrega un hallazgo con hipótesis y verificación segura.",
    objetivo: "Interpretar origen, destino, protocolo y puerto con contexto, sin convertir una anomalía en una acusación.",
    producto: "Informe de auditoría de tráfico con alcance, flujos, análisis, riesgo y próximo paso autorizado.",
    minutos: 25,
    pasos: [
      {
        titulo: "Define el alcance y el patrón normal",
        instrucciones: ["Trabaja únicamente sobre la captura ficticia que se muestra; no ejecutes escaneos.", "Anota el equipo, la subred de laboratorio, la ventana y quién autorizó la revisión.", "Define qué comunicaciones serían esperables para una laptop de usuario antes de buscar anomalías."],
        evidencia: "ALCANCE DE PRÁCTICA\nActivo: fv-laptop-08 · 10.0.0.8/24\nRed ficticia: 10.0.0.0/24 · permiso: laboratorio de FactionVault\nPatrón esperado: DNS al resolver configurado y navegación HTTPS aprobada",
        entregaParcial: "Alcance y línea base",
        registro: "Anota qué equipo y ventana auditas, el permiso aplicable y dos flujos que esperarías ver normalmente.",
        pregunta: "¿Cuál condición debe cumplirse antes de comenzar una auditoría técnica?",
        opciones: ["Tener autorización y un alcance definido antes de generar o revisar actividad", "Escanear direcciones públicas para descubrir quién administra la red", "Asumir que cualquier puerto abierto es malicioso"],
        correcta: 0,
        porQue: "La autorización y el alcance establecen qué se puede revisar y evitan afectar sistemas ajenos.",
      },
      {
        titulo: "Clasifica los flujos observados",
        instrucciones: ["Lee cada fila y registra origen, destino, protocolo, puerto y hora.", "Compara con la línea base; destaca lo inusual para este activo, no lo declares malicioso.", "Usa la nota de cada flujo como pista, no como conclusión final."],
        evidencia: "09:02:10 · 10.0.0.8 → 10.0.0.53 · UDP/53 · DNS habitual\n09:02:14 · 10.0.0.8 → 203.0.113.18 · TCP/443 · portal educativo\n09:03:02 · 10.0.0.8 → 198.51.100.23 · TCP/3389 · RDP saliente no esperado\nDirecciones de documentación reservadas; no son objetivos reales",
        entregaParcial: "Tabla de flujos y anomalía priorizada",
        registro: "Anota el flujo que priorizas y cita la hora, origen, destino, protocolo y puerto exactos.",
        pregunta: "¿Qué flujo revisarías primero en esta laptop y cómo lo describirías?",
        opciones: ["La consulta DNS habitual, porque todo DNS es una intrusión", "El RDP saliente TCP/3389, inesperado aquí pero todavía pendiente de contexto", "Todos los flujos: cualquier dirección IP demuestra un ataque"],
        correcta: 1,
        porQue: "RDP saliente es una anomalía contextual en esta línea base. Un puerto no prueba compromiso ni identifica a una persona.",
      },
      {
        titulo: "Correlaciona antes de graduar el riesgo",
        instrucciones: ["Busca qué proceso generó la conexión y quién usa el activo.", "Compara DNS, registros del endpoint, cambios aprobados y la ventana temporal.", "Califica la confianza y anota qué evidencia contradice tu hipótesis."],
        evidencia: "PREGUNTAS DE CORROBORACIÓN\n¿Hay un cliente RDP aprobado instalado? · aún no verificado\n¿El usuario tenía una tarea autorizada? · pendiente\n¿Coincide la hora con un evento de endpoint? · registro no adjunto\nEl número de puerto no revela por sí solo el proceso ni la intención",
        entregaParcial: "Hipótesis y evidencia faltante",
        registro: "Escribe una hipótesis provisional, una explicación legítima posible y la fuente que revisarías después.",
        pregunta: "¿Qué acción evita una conclusión precipitada?",
        opciones: ["Validar propietario y proceso, correlacionar registros y revisar cambios autorizados", "Afirmar que el host está comprometido por usar el puerto 3389", "Escanear direcciones públicas al azar para encontrar al responsable"],
        correcta: 0,
        porQue: "La correlación con proceso, usuario y cambios aprobados añade contexto. El puerto solo ayuda a formular una pregunta.",
      },
      {
        titulo: "Entrega una recomendación verificable",
        instrucciones: ["Presenta hechos y hora antes de la hipótesis; evita atribuir autoría sin evidencia.", "Recomienda una comprobación o contención proporcional dentro del alcance autorizado.", "Define quién valida la acción y qué resultado cerraría el hallazgo."],
        evidencia: "ESTRUCTURA DEL INFORME\n1. Alcance y autorización\n2. Observación y evidencia exacta\n3. Hipótesis + nivel de confianza + alternativa legítima\n4. Recomendación, responsable y prueba de cierre",
        entregaParcial: "Informe final de auditoría",
        registro: "Redacta tu conclusión en tres partes: qué observaste, qué sospechas y cuál es el siguiente paso autorizado.",
        pregunta: "¿Qué debe incluir un informe técnico responsable?",
        opciones: ["Hechos, hipótesis con nivel de confianza y próximo paso verificable", "Una acusación basada solo en el número de puerto", "Credenciales o datos personales para que el lector los pruebe"],
        correcta: 0,
        porQue: "Un informe útil es reproducible, proporcional y accionable: deja claro qué se sabe, qué falta y quién verifica el resultado.",
      },
    ],
  },
];

export const RUTAS_APRENDIZAJE: RutaAprendizaje[] = [
  { id: "desde-cero", titulo: "Empiezo desde cero", para: "Entender lo esencial sin asumir conocimientos previos.", icono: "grass", niveles: [{ mundo: "seguridad", nivel: "que-es-seguridad" }, { mundo: "redes", nivel: "que-es-red" }, { mundo: "sistemas", nivel: "que-es-so" }], proyecto: "triage-red", resultado: "Auditar flujos ficticios y explicar qué se sabe, qué se sospecha y qué falta verificar." },
  { id: "vida-digital", titulo: "Quiero proteger mis cuentas", para: "Tomar mejores decisiones sobre claves, phishing y recuperación.", icono: "shield", niveles: [{ mundo: "seguridad", nivel: "contrasenas" }, { mundo: "social", nivel: "phishing" }, { mundo: "seguridad", nivel: "privacidad-incidentes" }], proyecto: "escudo-cuenta", resultado: "Construir una hoja de defensa y ensayo de recuperación para una cuenta ficticia." },
  { id: "analisis-tecnico", titulo: "Quiero probar lo técnico", para: "Explorar redes, registros y análisis defensivo con datos ficticios.", icono: "monitor", niveles: [{ mundo: "redes", nivel: "que-es-red" }, { mundo: "python", nivel: "logs" }, { mundo: "sistemas", nivel: "terminal-ctf" }], proyecto: "triage-logs", resultado: "Construir una línea de tiempo y una nota de triage sustentada en registros ficticios." },
];
