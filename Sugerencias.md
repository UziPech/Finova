# Sugerencias y Roadmap de Préstamos Avanzados

Este documento contiene el plan detallado para la estabilización y expansión del módulo de préstamos, diseñado para ser ejecutado en la siguiente fase de desarrollo.

## 1. Estabilización de Backend (Bugfix)
*   **Problema**: "Fallo la función" reportado por el usuario. Posible error en el manejo de URLs en el hook `useLoans.ts` al invocar `supabase.functions.invoke`.
*   **Acción**: Refactorizar `useLoans.ts` para que pase los parámetros de consulta (`venture_id`, `id`) de forma más robusta, asegurando que coincidan con el router en `backend/supabase/functions/loans/index.ts`.
*   **Depuración**: Añadir logs explícitos en la Edge Function para trazar el `user_id` y los resultados de la consulta, validando por qué el Dashboard podría reportar "sin datos" a pesar de existir registros.

## 2. Soporte de Periodicidad Semanal
*   **Base de Datos**: Añadir columna `periodicity` (`text`, check `monthly` | `weekly`) y `risk_level` (`text`) a la tabla `loans`.
*   **Backend**: Actualizar el bucle de generación automática de pagos en `loans/index.ts`. Si es `weekly`, el intervalo entre `due_date` debe ser de 7 días exactos.
*   **Frontend**: Actualizar `LoanForm.tsx` con un selector de periodicidad.

## 3. Inteligencia de Riesgos (Semáforo)
*   **Lógica**: Crear un "Smart Risk Indicator" en `DashboardLoans.tsx`.
    *   **Verde**: > 7 días para el pago.
    *   **Amarillo**: 2-7 días para el pago.
    *   **Rojo**: < 2 días o pago vencido.
*   **Integración**: Cruzar el `payment_amount` con el `flujo_libre` mensual del usuario. Si la cuota representa > 50% del flujo libre disponible, elevar el nivel de riesgo automáticamente.

## 4. Auditoría y Línea de Tiempo (Ledger)
*   **UI**: Implementar un componente `LoanTimeline` en la vista de detalle de préstamos.
*   **Funcionalidad**: Mostrar una lista cronológica de "eventos":
    1.  Fecha de otorgamiento (Principal).
    2.  Pagos realizados (con fecha real y monto).
    3.  Ajustes o intereses acumulados.
    4.  Saldo insoluto proyectado.

---
*Nota: Este plan fue extraído del Implementation Plan del 07/04/2026 para continuidad del siguiente agente.*