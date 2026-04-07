# PLAN_TAREA.md — Dashboard Centro de Mando (Fase 2)

## Tarea Completada
Transformación del Dashboard de Finova en un **Centro de Mando financiero** con métricas contextuales, visualización avanzada, lista de estado de ventures y alertas inteligentes horizontales.

## Cambios Realizados

### Componentes Modificados
- **`MetricCard.tsx`**: Rediseño — título en uppercase arriba del valor, badges de tendencia contextuales ("vs mes anterior"), subtítulos descriptivos.
- **`MonthlyChart.tsx`**: Migración a `ComposedChart` — barras de ingresos (verde) y gastos (rojo) + línea punteada de "Flujo libre". Colores semánticos.
- **`VentureROIChart.tsx`**: Título accionable "¿A cuál meterle más? — ranking por ROI".
- **`SmartAlerts.tsx`**: Rediseño a tarjetas horizontales en grid con título, descripción y botón de acción (Analizar/Escalar/Revisar).
- **`DashboardView.tsx`**: Reestructuración completa — Header "Centro de mando", métricas con tendencias, layout de 3 filas (Charts, ROI+StatusList, Alertas) y **Guía de Indicadores** (Footer UX con leyenda de colores).

### Componentes Nuevos
- **`VentureStatusList.tsx`**: Lista vertical de ventures con dot de salud (10px), tipo, tiempo activo, ROI% y badges de acción con borde (`outline`) para mejor contraste (Escalar/Mantener/Vigilar/Revisar/En rojo).
- **Guía de Indicadores**: Sección informativa al final del dashboard detallando el significado semántico de cada color (Verde, Amarillo, Rojo, Azul, Gris).

### Métricas del Dashboard
| Métrica | Descripción |
|---------|-------------|
| Flujo libre este mes | Ingresos - Gastos del mes actual, con % vs mes anterior |
| Capital total activo | Suma de `invested` de ventures activos |
| ROI promedio | Media de ROI de ventures activos |
| Total invertido | Capital total con retornado como subtítulo |

### Pulido UX y Colores Semánticos
- **Validación Visual**: Los valores de las métricas (`Flujo libre`, `ROI`) ahora usan colores dinámicos (Verde `#16a34a` para positivo, Rojo `#dc2626` para negativo).
- **Consistencia del Mockup**: Leyenda de tipos en `TypeDistributionChart` ahora usa cuadrados sólidos en lugar de círculos.
- **Accionabilidad**: Badges en la lista de ventures ahora tienen bordes de color para una apariencia más premium y "clickable".

---

## Próximos Pasos (Fase Futura)
- [ ] Header con selector de periodo ("Este mes" / "3 meses" / "Todo")
- [ ] Botón "Consejo IA" + Edge Function `ai-advisor`
- [ ] Métrica "Gastos Hogar" (requiere UI de módulo Hogar)
- [ ] Code splitting para reducir bundle size

---

> [!IMPORTANT]
> **Build**: ✅ Exitoso. **TypeScript**: ✅ Sin errores. **Diseño**: Tema blanco mantenido.
