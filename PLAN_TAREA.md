# PLAN_TAREA.md — Refactor Vertical Slice & Alineación Maestra

Tras investigar a fondo el proyecto (incluyendo `OBSERVACIONES.md` y el `Plan Maestro: Agente IA WhatsApp`), he detectado puntos de mejora cruciales para evitar "incongruencias a futuro" y asegurar el éxito total de la arquitectura.

## Tarea de Antigravity
Refactorizar a **Strict Vertical Slice** y consolidar las bases del proyecto (Auth, BD y Documentación) para que el futuro Agente IA de WhatsApp se construya sobre cimientos sólidos.

## Análisis de Impacto (Investigación Part-by-Part)

### 1. Estado del Auth (401)
Aunque mencionas que ya puedes operar con éxito, mi lectura del código revela fugas de seguridad:
- **`useVentures.ts`**: `fetch` y `create` están bien, pero `updateVenture` (líneas 65-68) y `deleteVenture` (líneas 75-78) **NO** envían el token.
- **`VentureDetail.tsx`**: Ninguna llamada (GET, PUT, DELETE) incluye el token (líneas 27, 40, 50).
- **Impacto**: Las operaciones de edición/borrado fallarán silenciosamente o con error 401 pronto.

### 2. Inconsistencia de Base de Datos
- **Realidad (Código)**: Tablas `user_integrations` y `whatsapp_keywords`.
- **Plan (CLAUDE.md)**: Tablas `whatsapp_configs` y `keywords`.
- **Riesgo**: El Agente IA no podrá consultar la configuración si los agentes de ayuda (como yo) leen el nombre de tabla equivocado en `CLAUDE.md`.

### 3. Vertical Slice Estricto
- **Estado Actual**: Tenemos carpetas por feature, pero las `pages` están fuera.
- **Meta**: Mover las vistas (`pages`) dentro de cada feature para que sean módulos 100% aislados.

---

## Refinamiento Senior (Plan de "Éxito")

### Fase 1: Alineación de Cimientos (Fixes & Docs) ✅ Completado
- [x] **Unificar Auth**: Centralizada la inyección del token en `supabase.functions.invoke`.
- [x] **Actualizar CLAUDE.md**: Reflejados los nombres de las tablas y funciones RPC.
- [x] **Corregir Navegación**: Implementado Top-Down Nav y Slide-Down Menu.
- [x] **Seguridad**: Saneamiento de .gitignore y rotación de claves documentada.

### Fase 2: Reestructuración a Vertical Slice
- [ ] **Mover Páginas**:
    - `src/pages/VenturesPage.tsx` → `src/features/ventures/pages/VenturesPage.tsx`
    - `src/pages/DashboardPage.tsx` → `src/features/dashboard/pages/DashboardPage.tsx`
    - (Repetir para todos los módulos).
- [ ] **Actualizar Router**: Limpiar `src/app/router.tsx` para importar desde las nuevas ubicaciones.
- [ ] **Exportación Pública**: Usar `index.ts` en cada feature para exportar la página y componentes permitidos, protegiendo la lógica interna.

### Fase 3: Configuración de Entorno (DX) ✅ Completado
- [x] **Fix repomix**: Actualizados los paths para contexto real y exclusión de secretos.
- [x] **VS Code**: Creado `.vscode/settings.json` para soporte Deno/React.

---

## Explicación Técnica (Lenguaje A1)
- **Token de Auth**: Es como la llave de tu casa. Para mirar (fetch) ya tienes la llave, pero para cambiar los muebles (update) o tirarlos (delete) también necesitas mostrar la llave.
- **Nombres de Tablas**: Si el mapa dice "Calle A" pero en la calle el cartel dice "Calle B", el cartero (IA) se pierde. Vamos a arreglar el mapa.

---

> **Estado**: Cimientos sólidos y seguridad saneada. Listos para empezar la **Refactorización a Vertical Slice** (Fase 2).
