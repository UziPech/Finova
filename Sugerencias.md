***Antes de comenzar a trabjar es necesario que hagas auitoria del codigo o revises el Claude.md, junto a repomix-output.md para entender el estado del actual proyecto***

**No intentes hacer cambios en el codigo sin antes haber hecho auditoria/ si requieres leer la base de datos puedes hacerlo mediante mi MCP server, el proyecto se llama Finova**

## Ojo toma en cuenta la arquitectura vertical slice del proyecto y sus features

PLAN 1: Arquitectura de Categorías y Servicios (Para el Auditor)

Copia y pega esto a tu Agente Auditor:

🤖 ROL: ARQUITECTO / AUDITOR
ACCIÓN REQUERIDA: Análisis y Propuesta (NO EJECUTAR CÓDIGO AÚN)

Necesitamos escalar nuestro modelo de transacciones en Finova para soportar el pago de servicios (Luz, Agua, Internet) y categorización general, separando claramente lo que es un negocio de lo que son finanzas personales.

Tu tarea de auditoría es evaluar lo siguiente:

Estructura de Datos: Analiza si es mejor agregar una tabla categories en Supabase (para que los usuarios puedan crear las suyas propias a futuro) o si iniciamos con un enum / constantes en el frontend (EXPENSE_CATEGORIES incluyendo 'Luz', 'Agua', 'Servicios', etc.).

UI de Registro: Evalúa cómo separar visualmente los botones de "Nuevo Ingreso" y "Nuevo Gasto" en el formulario para que sea a prueba de tontos (colores semánticos, botones grandes).

Vista General: Confirma cómo el Dashboard principal consumirá estas categorías sin romperse.

Entregable: Entrégame un reporte de viabilidad y el plan de pasos exactos (Modificaciones de BD, Tipos y Componentes) para que posteriormente un agente codificador lo ejecute.

📋 PLAN 2: Algoritmos de Búsqueda y Paginación (Para el Auditor)

Copia y pega esto a tu Agente Auditor:

🤖 ROL: ARQUITECTO / AUDITOR
ACCIÓN REQUERIDA: Análisis de Rendimiento y UI (NO EJECUTAR CÓDIGO AÚN)

La vista de detalles del "Venture" (donde se listan las transacciones) va a crecer masivamente. Necesitamos implementar un buscador y paginación.

Tu tarea de auditoría es evaluar y proponer la mejor arquitectura técnica:

Algoritmo de Búsqueda: Necesitamos implementar un buscador de transacciones (por nombre, nota o categoría). Evalúa el uso de un hook con debounce (ej. 300ms) para no saturar los re-renders de React ni las llamadas a Supabase al teclear.

Paginación: Revisa nuestro hook actual useTransactions. ¿Conviene hacer paginación en el frontend (si son menos de 1000 registros) o modificar la Edge Function/Supabase query para hacer paginación basada en Offset/Limit o Cursor-based desde el backend?

UX del Buscador: Propón dónde debería ubicarse este buscador y los controles de paginación en VentureDetail.tsx para mantener la interfaz limpia.

Entregable: Un documento de diseño técnico especificando la estrategia de paginación elegida, el algoritmo de búsqueda, y las dependencias necesarias.

📋 PLAN 3: Reestructuración UX para Novatos y Expertos (Para el Auditor)

Copia y pega esto a tu Agente Auditor:

🤖 ROL: ARQUITECTO / AUDITOR
ACCIÓN REQUERIDA: Análisis de Experiencia de Usuario (NO EJECUTAR CÓDIGO AÚN)

Queremos que la app tenga una doble capa funcional: extremadamente intuitiva para un novato (que solo registra gastos de casa) y poderosa para un experto (que trackea negocios).

Tu tarea de auditoría es analizar nuestro frontend actual:

Manejo de Estados de UI: ¿Cómo implementamos un "Modo" (Personal vs Negocio) al crear un Venture? Si es personal, debemos ocultar términos como "ROI" o "Inversión" y reemplazarlos por "Presupuesto" y "Gastos".

Dashboard Global: El Dashboard debe ser el gran visor de todos los ventures combinados. Evalúa si nuestras métricas actuales (DashboardView.tsx) calculan correctamente la suma total sin importar si es un "Venture de Negocio" o una "Carpeta de Casa".

Entregable: Un mapeo de qué componentes actuales (formularios, tarjetas, detalles) necesitan props adicionales (ej. mode="personal" | "business") para adaptar sus textos condicionalmente.