# WorldCounter

Una herramienta simple y potente para contar palabras y caracteres, diseñada específicamente para creadores de contenido en redes sociales.

## ¿Qué es WorldCounter?

WorldCounter es un editor de texto con contador en tiempo real que te ayuda a:

- ✍️ **Redactar posts para redes sociales** con límites de caracteres visibles
- 📊 **Ver estadísticas en tiempo real**: palabras, caracteres (con y sin espacios)
- 📱 **Copiar rápido al portapapeles** desde PC o móvil con un solo clic
- 💾 **Guardar borradores indefinidamente** en tu navegador (IndexedDB)
- 🧹 **Gestionar tu historial** con opción de purgar textos viejos
- 🎨 **Usar plantillas predefinidas** para Twitter/X, Instagram, LinkedIn y más

## Características principales

### Contador en tiempo real
- Palabras
- Caracteres con espacios
- Caracteres sin espacios
- Indicador visual cuando te acercas al límite de la red social seleccionada

### Plantillas de redes sociales
- **Twitter/X**: 280 caracteres
- **Instagram**: 2,200 caracteres
- **LinkedIn**: 3,000 caracteres
- **Personalizable**: crea tus propios límites

### Persistencia local
- Todos tus textos se guardan automáticamente en tu navegador
- No necesitas cuenta ni servidor
- Tus datos son privados y permanecen en tu dispositivo
- Acceso offline

### Gestión de historial
- Lista de textos guardados ordenados por fecha
- Carga cualquier texto anterior con un clic
- Copia al portapapeles directamente desde el historial
- Purga textos viejos (por defecto: más de 30 días)
- Purga todos los textos si lo necesitas

### Copiado rápido
- Botón dedicado para copiar al portapapeles
- Funciona en PC y móvil
- Notificación visual cuando se copia correctamente

## ¿Por qué usar WorldCounter?

- **Privacidad**: Todo se procesa en tu navegador, sin enviar datos a servidores
- **Velocidad**: Sin tiempos de carga, sin dependencias externas
- **Simplicidad**: Interfaz limpia, sin distracciones
- **Disponibilidad**: Funciona offline, tus textos siempre están disponibles
- **Multiplataforma**: Funciona en PC, tablet y móvil

## Uso

1. Escribe o pega tu texto en el editor
2. Selecciona la plantilla de la red social (opcional)
3. Observa las estadísticas en tiempo real
4. Tu texto se guarda automáticamente
5. Copia al portapapeles con un clic cuando estés listo
6. Gestiona tu historial desde el panel lateral

## Tecnologías

- **Next.js 16** con App Router
- **TypeScript** para type safety
- **TailwindCSS v4** para estilos
- **IndexedDB** para persistencia local
- **100% client-side**: sin backend, sin servidor

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Build de producción
npm run build
```

## Licencia

Todos los derechos reservados a Alex Zimmer Bonjour.


