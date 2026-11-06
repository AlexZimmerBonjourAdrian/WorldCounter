# AGENT.md — WorldCounter

## Propósito
Este documento centraliza la configuración, arquitectura, convenciones y guía de trabajo del proyecto **WorldCounter**.

## Stack
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS v4
- **Runtime:** 100% client-side (sin backend)
- **Persistencia local:** IndexedDB (`StorageService`)

## Scripts
```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # ESLint
npm run test         # Vitest
npm run test:watch   # Vitest en modo watch
npm run test:coverage
```

## Configuración del proyecto
- `package.json`: dependencias y scripts.
- `tsconfig.json`: configuración TypeScript.
- `next.config.ts`: configuración Next.js.
- `postcss.config.js`: PostCSS/Tailwind.
- `tailwind` integrado vía PostCSS.
- Alias de rutas: `@/*` -> `src/*`.

## Estructura actual (por capas)
```text
src/
  app/                  # Entry points Next.js (View)
  data/                 # Capa de Datos: persistencia y tipos
  business/services/    # Capa de Negocio: servicios de análisis y gestión
  presentation/components/  # Capa Visual: componentes React
```

## Arquitectura por capas (MVC)
El proyecto sigue una separación clara MVC:

### 1. Capa de Datos (Model)
- Persistencia local (IndexedDB).
- Tipos y modelos.
- Acceso a almacenamiento.
- Clases clave: `StorageService`, `CounterData`, `StoredCounterText`.

### 2. Capa de Negocio (Controller / Services)
- Análisis de texto (palabras, caracteres).
- Gestión de plantillas de redes sociales.
- Copiado al portapapeles.
- Validación de texto.
- Clases clave: `TextAnalysisService`, `TemplateService`, `ClipboardService`, `TextValidationService`, `LoggerService`.

### 3. Capa Visual (View)
- Componentes React.
- Páginas Next.js.
- UI del contador.
- Clases clave: `page.tsx`, `CounterEditor`, `StatsPanel`, `TemplateSelector`, `HistoryPanel`, `ToastNotification`, `Header`, `Footer`.

## Funcionalidades principales
- Contador de palabras en tiempo real
- Contador de caracteres (con y sin espacios)
- Plantillas configurables para redes sociales (Twitter/X, Instagram, LinkedIn, Facebook)
- Persistencia indefinida de textos en IndexedDB
- Historial de textos guardados
- Purga de textos viejos y todos los textos
- Copiado al portapapeles (PC y móvil)
- 100% client-side (sin backend)

## Convenciones
- Servicios como clases estáticas cuando no requieren estado.
- Todos los servicios están en `src/business/services/`.
- Los componentes están en `src/presentation/components/`.
- Tipos y modelos en `src/data/`.
- Autoguardado con debounce de 500ms.
- Toast notifications para feedback al usuario.
- Modo oscuro por defecto (diseño dark theme).

## Versionado
- Versión actual: `2.0.0`
- La versión se muestra en Header.

## Notas de arquitectura
Ver `docs/architecture.md` para diagrama detallado.

## Reglas para agentes
- No eliminar funcionalidad existente sin justificación.
- Mantener compatibilidad con IndexedDB (no romper schema sin migración).
- Documentar cambios en `docs/`.
- Ejecutar lint/tests cuando sea posible.
- Preferir cambios pequeños y verificables.
- Mantener diseño dark mode consistente.
