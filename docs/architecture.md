# Arquitectura WorldCounter

## Visión General
WorldCounter sigue una arquitectura MVC (Model-View-Controller) clara, separando la lógica de negocio, la persistencia de datos y la interfaz de usuario.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Capa Visual (View)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CounterEdit │  │  StatsPanel  │  │ TemplateSel  │      │
│  │      or      │  │              │  │    ector     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ HistoryPanel │  │ ToastNotif.  │                        │
│  └──────────────┘  └──────────────┘                        │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Header     │  │   Footer     │                        │
│  └──────────────┘  └──────────────┘                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Capa de Negocio (Controller)                  │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ TextAnalysis     │  │ TemplateService  │                │
│  │     Service      │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ ClipboardService │  │ TextValidation   │                │
│  │                  │  │     Service      │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────┐                                       │
│  │  LoggerService   │                                       │
│  └──────────────────┘                                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                 Capa de Datos (Model)                       │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ StorageService  │  │   CounterData    │                │
│  │  (IndexedDB)     │  │  (Types/Models)  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Descripción de Capas

### 1. Capa de Datos (Model)

**Ubicación:** `src/data/`

**Responsabilidades:**
- Definición de tipos y modelos de datos
- Persistencia local mediante IndexedDB
- Acceso y manipulación de datos almacenados

**Componentes:**
- `StorageService.ts`: Servicio de persistencia IndexedDB
  - `saveText()`: Guardar texto en IndexedDB
  - `loadText()`: Cargar texto por ID
  - `listTexts()`: Listar todos los textos ordenados por fecha
  - `deleteText()`: Eliminar texto por ID
  - `purgeOldTexts()`: Purgar textos anteriores a X días
  - `purgeAllTexts()`: Purgar todos los textos

- `CounterData.ts`: Definición de tipos
  - `CounterStats`: Estadísticas de conteo (palabras, caracteres)
  - `SocialTemplate`: Plantilla de red social
  - `CounterText`: Texto del contador
  - `StoredCounterText`: Texto almacenado en IndexedDB

- `ViewerData.ts`: Props de UI (DTOs)

**Schema IndexedDB:**
```
DB Name: WorldCounter_DB
Version: 1
Store: texts
  - id (keyPath, autoIncrement)
  - text (string)
  - title (string, opcional)
  - template (string, opcional)
  - timestamp (number, index)
```

### 2. Capa de Negocio (Controller)

**Ubicación:** `src/business/services/`

**Responsabilidades:**
- Lógica de análisis de texto
- Gestión de plantillas
- Copiado al portapapeles
- Validación de datos
- Logging

**Componentes:**

- `TextAnalysisService.ts`
  - `analyzeText()`: Contar palabras y caracteres
  - `isWithinLimit()`: Verificar si está dentro del límite
  - `getRemainingChars()`: Calcular caracteres restantes
  - `getPercentageUsed()`: Calcular porcentaje usado

- `TemplateService.ts`
  - `getTemplates()`: Obtener plantillas predefinidas
  - `getTemplate()`: Obtener plantilla por ID
  - `addCustomTemplate()`: Agregar plantilla personalizada
  - `getCustomTemplates()`: Obtener plantillas personalizadas (localStorage)

- `ClipboardService.ts`
  - `copyToClipboard()`: Copiar texto al portapapeles
  - `isSupported()`: Verificar soporte de clipboard API
  - `fallbackCopy()`: Fallback para navegadores antiguos

- `TextValidationService.ts`
  - `hasMinimumText()`: Verificar longitud mínima
  - `isEmpty()`: Verificar si está vacío

- `LoggerService.ts`
  - Logging de operaciones y errores

### 3. Capa Visual (View)

**Ubicación:** `src/presentation/components/` y `src/app/`

**Responsabilidades:**
- Renderizado de UI
- Interacción con el usuario
- Gestión de estado local
- Feedback visual

**Componentes:**

- `page.tsx`: Página principal
  - Estado global de la aplicación
  - Coordinación entre componentes
  - Gestión de historial

- `CounterEditor.tsx`: Editor de texto
  - Textarea con autoguardado
  - Debounce de 500ms
  - Placeholder instructivo

- `StatsPanel.tsx`: Panel de estadísticas
  - Mostrar conteo en tiempo real
  - Barra de progreso visual
  - Indicador de límite de plantilla
  - Botón de copiar

- `TemplateSelector.tsx`: Selector de plantillas
  - Dropdown con plantillas predefinidas
  - Iconos de plataformas
  - Opción "Sin límite"

- `HistoryPanel.tsx`: Panel de historial
  - Lista de textos guardados
  - Cargar, copiar, eliminar textos
  - Purgar textos viejos
  - Purgar todos los textos
  - Formato relativo de tiempo

- `ToastNotification.tsx`: Notificaciones
  - Toast de éxito, info, warning
  - Animación con framer-motion

- `Header.tsx`: Cabecera
  - Logo y versión
  - Botón de historial

- `Footer.tsx`: Pie de página
  - Copyright
  - Información de privacidad

## Flujo de Datos

### 1. Flujo de escritura (usuario escribe texto)
```
CounterEditor (onChange)
  ↓
page.tsx (handleTextChange)
  ↓
TextAnalysisService.analyzeText()
  ↓
StatsPanel (mostrar estadísticas)
  ↓
CounterEditor (debounce 500ms)
  ↓
StorageService.saveText()
  ↓
IndexedDB (persistir)
```

### 2. Flujo de lectura (cargar texto del historial)
```
HistoryPanel (botón cargar)
  ↓
page.tsx (handleLoadText)
  ↓
StorageService.loadText()
  ↓
IndexedDB (recuperar)
  ↓
page.tsx (setText)
  ↓
CounterEditor (mostrar texto)
  ↓
TextAnalysisService.analyzeText()
  ↓
StatsPanel (actualizar estadísticas)
```

### 3. Flujo de copiado
```
StatsPanel (botón copiar)
  ↓
page.tsx (handleCopy)
  ↓
ClipboardService.copyToClipboard()
  ↓
navigator.clipboard.writeText() o fallback
  ↓
ToastNotification (mostrar éxito)
```

## Convenciones

### Servicios
- Clases estáticas cuando no requieren estado
- Métodos estáticos para operaciones
- Naming: `XxxService`
- Ubicación: `src/business/services/`

### Componentes
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Naming: PascalCase
- Ubicación: `src/presentation/components/`

### Tipos
- Interfaces para DTOs
- Ubicación: `src/data/`
- Naming: descriptivo (ej: `CounterStats`, `SocialTemplate`)

### Estado
- Estado local en componentes cuando es específico
- Estado global en page.tsx cuando es compartido
- Evitar prop drilling innecesario

## Consideraciones de Performance

1. **Debounce del autoguardado**: 500ms para balance entre UX y performance
2. **IndexedDB con índices**: Índice en timestamp para consultas eficientes
3. **Virtual scrolling**: No implementado actualmente, considerar si el historial crece mucho
4. **Code splitting**: Next.js hace code splitting automático por página

## Seguridad y Privacidad

1. **100% client-side**: No hay servidor, no hay envío de datos
2. **IndexedDB local**: Los datos permanecen en el dispositivo del usuario
3. **Sin cookies ni tracking**: No hay seguimiento del usuario
4. **Clipboard API**: Usa API nativa del navegador con permisos del usuario

## Futuras Mejoras

1. **Sync en la nube**: Opcional, con cifrado client-side
2. **Más plantillas**: Agregar más redes sociales
3. **Export/Import**: Exportar historial a JSON
4. **Temas personalizados**: Permitir usuarios crear sus propios temas
5. **Offline PWA**: Convertir a Progressive Web App
6. **Analytics local**: Estadísticas de uso guardadas localmente
