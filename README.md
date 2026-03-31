# Folio

**Presentations crafted to impress.**

Plataforma web de presentaciones con diseno profesional de serie, temas curados, tipografia precisa, colaboracion en tiempo real, viewer responsive y share links publicos.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, App Router |
| Language | TypeScript (strict) |
| Styles | Tailwind CSS v4 |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle |
| Auth | Supabase Auth (email + Google + GitHub) |
| Storage | Cloudflare R2 |
| Realtime | Yjs + y-partyserver (Cloudflare Durable Objects) |
| State | Zustand con history middleware |
| Canvas | DOM + CSS transforms |
| Payments | Stripe |
| Email | Resend |
| Analytics | PostHog (consent-gated) |
| Monitoring | Sentry |
| AI | Anthropic Claude API |
| Rate Limiting | Upstash Redis |
| Hosting | Vercel |

---

## Features

### Autenticacion y gestion de usuarios

- **Login / Registro** — Formulario de email y contrasena con validacion, mensajes de error contextuales y redireccion post-login configurable.
- **OAuth social (Google y GitHub)** — Inicio de sesion con un click mediante proveedores de Supabase Auth. Callback unificado en `/auth/callback`.
- **Recuperacion de contrasena** — Flujo completo de reset: solicitar enlace por email, pagina dedicada para establecer nueva contrasena con validacion y animacion de exito.
- **Gestion de sesiones** — API para listar sesiones activas del usuario con informacion de dispositivo, navegador, SO e IP. Posibilidad de revocar sesiones individuales.
- **Identidades conectadas** — Vincular y desvincular cuentas OAuth adicionales desde el perfil del usuario.

### Perfil y cuenta

- **Datos personales** — Editar nombre, email, nombre de usuario, bio y avatar.
- **Links sociales** — Anadir enlaces a Twitter, LinkedIn, GitHub y sitio web personal.
- **Portfolio publico** — Pagina publica en `/u/[username]` que muestra las presentaciones publicadas del usuario.
- **Preferencias** — Configurar idioma, frecuencia de email digest y preferencias de notificaciones.
- **Seguridad** — Cambiar contrasena, ver y revocar sesiones activas.
- **Privacidad de datos** — Exportar todos los datos personales en JSON o solicitar la eliminacion completa de la cuenta.
- **Zona de peligro** — Borrar cuenta permanentemente con confirmacion y re-autenticacion.

### Facturacion y pagos (Stripe)

- **Planes de suscripcion** — Cuatro niveles (Free, Creator, Studio, Agency) con diferentes limites de presentaciones, almacenamiento, colaboradores y funcionalidades.
- **Facturacion mensual y anual** — Toggle en la pagina de pricing con descuento visible para el periodo anual.
- **Checkout con Stripe** — Sesiones de pago seguras creadas via API. Soporte para mobile browsers.
- **Portal de facturacion** — Redireccion al portal de Stripe para gestionar metodo de pago, ver facturas y cancelar suscripcion.
- **Webhooks de Stripe** — Procesamiento automatico de eventos de pago (suscripcion creada, renovada, cancelada, pago fallido).
- **Enforcement de limites** — Las restricciones de plan se aplican en creacion de presentaciones, subida de archivos, exportaciones y funciones de AI.
- **Watermark** — Las presentaciones del plan Free muestran una marca de agua de Folio.

### Presentaciones (core)

- **Crear presentacion** — En blanco, desde plantilla o generada con AI.
- **CRUD completo** — Crear, leer, actualizar y borrar presentaciones via API con verificacion de ownership.
- **Duplicar presentacion** — Clonar una presentacion completa incluyendo todos los slides y elementos.
- **Clonar presentacion publica** — Fork de presentaciones compartidas de otros usuarios con tracking del contador de forks.
- **Importar presentacion** — Importar desde archivo JSON para restaurar presentaciones exportadas.
- **Operaciones en lote** — Seleccionar y eliminar o mover multiples presentaciones a la vez.
- **Configuracion de presentacion** — Titulo, slug unico para URL publica, tema, visibilidad (publica/privada), contrasena de proteccion, enlace con fecha de expiracion.
- **Thumbnail automatico** — Generacion y cache de miniaturas para vista previa en el dashboard.

### Slides

- **Anadir / Eliminar slides** — Crear y borrar slides individuales.
- **Reordenar slides** — Drag-and-drop en el panel lateral para cambiar el orden.
- **Duplicar slide** — Clonar un slide completo con todos sus elementos.
- **Mover slide** — Mover al principio o al final de la presentacion.
- **Fondo de slide** — Color solido, gradiente o imagen de fondo por slide.
- **Transiciones** — Efectos de transicion entre slides: fade, slide-left, slide-up, slide-right, zoom, blur y none. Duracion y easing configurables.
- **Notas del presentador** — Texto de notas oculto para la audiencia, visible en modo presentador.
- **Layout responsive (mobile)** — Generar automaticamente un layout optimizado para mobile a partir del layout desktop.
- **Biblioteca de slides** — Guardar slides reutilizables en una biblioteca personal para insertarlos en cualquier presentacion.

### Tipos de elementos

- **Texto** — Rich text con control de fuente, tamano, peso, color, alineacion, sombras, strokes y decoraciones. Soporte para multiples estilos dentro del mismo bloque.
- **Imagen** — Subida desde dispositivo o Unsplash. Modos de ajuste (cover, contain, fill), flip horizontal/vertical, filtros CSS (brillo, contraste, saturacion, etc.).
- **Forma (Shape)** — Rect, circle, triangle, diamond, star, pentagon, hexagon. Relleno solido o gradiente, borde configurable.
- **Flecha (Arrow)** — Linea direccional con puntas de flecha personalizables y color.
- **Divisor (Divider)** — Linea horizontal con patrones de trazo (solido, dashed, dotted).
- **Linea (Line)** — Linea libre con endpoints y flechas opcionales en ambos extremos.
- **Tabla (Table)** — Filas y columnas con cabeceras, bordes de celda y estilo tipografico.
- **Icono (Icon)** — Mas de 1.000 iconos de Phosphor Icons con busqueda, pesos (thin, light, regular, bold, fill, duotone) y color personalizable.
- **Video** — Video embebido con poster, autoplay, loop y mute.
- **Embed** — Insertar contenido externo (YouTube, Figma, Loom, iframes genericos) directamente en el canvas.

### Propiedades comunes de elementos

- **Posicion y tamano** — Coordenadas X/Y, ancho, alto con edicion numerica precisa.
- **Rotacion** — Giro libre en grados.
- **Opacidad** — Control de transparencia de 0 a 100%.
- **Visibilidad** — Toggle para mostrar/ocultar sin eliminar.
- **z-index** — Control de capas con botones de traer al frente, enviar atras, subir y bajar.
- **Bloqueo** — Bloquear elementos para evitar seleccion o movimiento accidental.
- **Enlace** — Vincular a URL externa o a un slide interno de la presentacion.
- **Sombra** — Sombra configurable (offset, blur, color).
- **Filtro blur** — Desenfoque gaussiano.
- **Borde** — Ancho, color y radio de borde.
- **Animacion de entrada** — Efectos: fade-up, fade-down, fade-left, fade-right, zoom-in, zoom-out, rotate-in, bounce-in. Delay, duracion y easing configurables.
- **Bloqueo de aspecto** — Mantener proporcion al redimensionar.

### Canvas y herramientas de edicion

- **Canvas fijo 1920x1080** — Resolucion fija escalada al viewport con CSS transform.
- **Seleccion individual y multiple** — Click para seleccionar, Shift+click o rectangulo de seleccion para multi-select.
- **Alineacion** — Alinear elementos seleccionados a izquierda, centro, derecha, arriba, medio o abajo.
- **Distribucion** — Distribuir elementos uniformemente en horizontal o vertical.
- **Agrupacion** — Agrupar y desagrupar multiples elementos para moverlos como unidad.
- **Copiar / Pegar** — Ctrl+C / Ctrl+V para duplicar elementos.
- **Copiar / Pegar estilo** — Aplicar las propiedades visuales de un elemento a otros.
- **Undo / Redo** — Historial completo con snapshots debounced. Ctrl+Z / Ctrl+Shift+Z.
- **Guias de alineacion (snap)** — Lineas guia inteligentes que aparecen al mover o redimensionar, con snap automatico a bordes y centros de otros elementos.
- **Snap de espaciado** — Indicadores visuales de la distancia entre elementos.
- **Snap a grid** — Toggle para alinear al grid.
- **Buscar y reemplazar** — Buscar texto en todos los slides y reemplazarlo.

### Modo mobile de edicion

- **Toggle desktop / mobile** — Cambiar entre el canvas 1920x1080 (desktop) y 375px (mobile) para disenar ambos layouts.
- **Generacion automatica de layout mobile** — Algoritmo que redistribuye los elementos del slide desktop en un layout optimizado para pantallas pequenas.
- **Posiciones independientes** — Cada elemento puede tener posicion y tamano diferentes en mobile vs desktop.

### Paneles del editor

- **Toolbar** — Barra de herramientas con insercion de elementos (texto, forma, imagen, icono, tabla, video, embed, linea, divisor).
- **Panel de slides** — Miniaturas de todos los slides con drag-to-reorder y acciones contextuales.
- **Panel de propiedades** — Propiedades del elemento seleccionado, adaptado por tipo.
- **Panel de capas** — Lista jerarquica de elementos con toggles de visibilidad y bloqueo.
- **Panel de comentarios** — Hilos de comentarios por slide para feedback del equipo.
- **Panel de colaboradores** — Lista de colaboradores conectados con cursores en tiempo real.
- **Panel de historial** — Timeline de undo/redo.
- **Personalizador de tema** — Modificar colores y fuentes del tema activo.
- **Gestor de fuentes** — Subir y gestionar fuentes custom (.woff2, .ttf, .otf).
- **Selector de iconos** — Explorar y buscar entre 1.000+ iconos de Phosphor.
- **Selector de Unsplash** — Buscar y insertar fotos de stock gratuitas de Unsplash.
- **Editor de notas** — Escribir notas del presentador para cada slide.
- **Timeline de animaciones** — Visualizar y ajustar la secuencia de animaciones del slide.
- **Controles de grabacion** — Grabar la presentacion con audio y timeline de slides.
- **Selector de layout** — Elegir entre layouts de slide predefinidos.

### Temas y diseno

- **5 temas integrados** — Editorial Blue (default), Monochrome, Dark Editorial, Warm Magazine, Swiss Minimal. Cada uno con su par de fuentes (display + body) y paleta de colores.
- **Temas personalizados** — Crear y guardar temas custom por presentacion con colores primarios, de fondo, de texto y de acento mas dos familias tipograficas.
- **Fuentes personalizadas** — Subir archivos de fuentes propias (.woff2, .ttf, .otf) y usarlas en cualquier presentacion.
- **Theme builder** — UI interactiva para personalizar el tema en tiempo real dentro del editor.

### Colaboracion en tiempo real

- **Yjs CRDT** — Motor de sincronizacion conflict-free para edicion simultanea sin perdida de datos.
- **PartyKit (Cloudflare Durable Objects)** — Servidor de WebSocket para la sincronizacion en tiempo real con baja latencia.
- **Gestion de colaboradores** — Anadir y eliminar colaboradores por email con roles (viewer, editor, owner).
- **Cursores remotos** — Ver en tiempo real la posicion del cursor de otros colaboradores sobre el canvas.
- **Indicadores de presencia** — Saber quien esta conectado al editor en cada momento.
- **Auto-sync** — Los cambios se propagan automaticamente a todos los participantes.
- **Digest de colaboracion** — Email periodico con resumen de actividad colaborativa via cron job.

### Compartir y publicar

- **Share links** — Generar URLs publicas en `/p/[slug]` para compartir presentaciones.
- **Expiracion de enlace** — Establecer una fecha de caducidad para los links compartidos.
- **Proteccion con contrasena** — Proteger presentaciones publicas con password.
- **Viewer publico** — Visor responsive de presentaciones con navegacion por teclado y swipe.
- **Viewer mobile** — Version optimizada del viewer para dispositivos moviles con layout adaptado.
- **Modo presentador** — Vista fullscreen con notas del presentador, timer, controles de slide y Q&A.
- **Modo embed** — Insertar presentaciones en sitios externos mediante iframe en `/embed/[slug]`.
- **Impresion** — Imprimir slides via el dialogo del navegador con CSS optimizado para impresion.

### Exportacion

- **Exportar a PDF** — Descargar la presentacion completa como documento PDF.
- **Exportar a PPTX** — Exportar a formato PowerPoint para editar en otras herramientas (plan Studio+).
- **Exportar a JSON** — Descargar los datos completos de la presentacion en formato JSON para backup o importacion.
- **Imprimir** — Soporte de impresion con layout landscape, colores exactos y una pagina por slide.

### Funcionalidades de AI

- **Generar presentacion completa** — Crear una presentacion entera a partir de un prompt de texto usando Claude. Genera titulo, estructura de slides, textos y layout.
- **Generar slide individual** — Anadir un slide nuevo generado por AI a una presentacion existente.
- **Generar imagen** — Crear imagenes con AI directamente desde el editor para insertarlas en el canvas.
- **Traducir contenido** — Traducir automaticamente el texto de los slides a otro idioma manteniendo la estructura.
- **Generar notas** — Crear notas del presentador automaticamente basandose en el contenido de cada slide.
- **Build presentation** — Generacion avanzada multi-slide con layout builder que distribuye los elementos automaticamente.
- **Restriccion por plan** — Las funciones de AI estan disponibles a partir del plan Creator.

### Dashboard y gestion

- **Grid de presentaciones** — Vista en cuadricula con miniaturas, titulo, fecha y acciones.
- **Vista lista** — Vista alternativa en formato lista.
- **Busqueda** — Filtrar presentaciones por titulo.
- **Ordenacion** — Ordenar por nombre, fecha de creacion, fecha de modificacion o numero de vistas.
- **Seleccion masiva** — Multi-select con checkbox para operaciones en lote.
- **Acciones en lote** — Eliminar o mover a carpeta multiples presentaciones seleccionadas.
- **Carpetas** — Crear, renombrar y eliminar carpetas para organizar presentaciones. Mover presentaciones entre carpetas.
- **Seccion reciente** — Acceso rapido a las presentaciones modificadas recientemente.
- **Guia de inicio** — Panel de onboarding para nuevos usuarios con pasos sugeridos.
- **Estado vacio** — Mensaje informativo cuando no hay presentaciones creadas.

### Plantillas

- **Biblioteca de plantillas** — 30+ plantillas predefinidas organizadas por categoria: Business, Creative, Education, Pitch.
- **Seleccion de plantilla** — Modal para elegir plantilla al crear una nueva presentacion.
- **Seleccion de tema con plantilla** — Elegir que tema visual aplicar a la plantilla seleccionada.
- **Generador de plantillas** — Sistema que convierte las definiciones de plantilla en slides completos con elementos posicionados.

### Analytics

- **Tracking de vistas** — Conteo automatico de vistas por presentacion publica.
- **Dashboard de analytics** — Pagina dedicada con estadisticas detalladas por presentacion.
- **Resumen general** — API de overview con metricas agregadas del usuario.
- **Hitos de vistas** — Tracking de milestones (10, 50, 100, 500, 1.000+ vistas) con notificaciones.
- **Digest de analytics** — Resumen periodico por email con las metricas principales.
- **Analytics avanzados** — Funcionalidades adicionales de analytics disponibles en planes superiores.

### Versionado e historial

- **Historial de versiones** — Guardar snapshots completos del estado de la presentacion.
- **Listar versiones** — Ver todas las versiones guardadas con timestamp.
- **Restaurar version** — Rollback a cualquier version anterior con un click.

### Gestion de imagenes

- **Subida de imagenes** — Upload con compresion automatica a maximo 2.000px.
- **Almacenamiento en R2** — Las imagenes se almacenan en Cloudflare R2 con URL publica.
- **Compresion automatica** — Reduccion de tamano y resolucion antes de subir para optimizar almacenamiento.
- **Procesamiento de imagenes** — Utilidades de manipulacion de imagen (sharp).
- **Integracion con Unsplash** — Buscar y insertar fotos de stock gratuitas sin salir del editor.
- **Filtros de imagen** — Aplicar filtros CSS (brillo, contraste, saturacion, sepia, etc.) a las imagenes en el canvas.
- **Reemplazo de imagen** — Sustituir la imagen de un elemento existente sin perder posicion ni estilo.

### Internacionalizacion (i18n)

- **6 idiomas soportados** — Espanol (es, default), ingles (en), frances (fr), aleman (de), italiano (it), portugues (pt).
- **Selector de idioma** — Componente `LocaleSelector` disponible en el header de todas las paginas publicas.
- **Persistencia de idioma** — La preferencia de idioma se guarda en cookie (`folio-locale`) y se recuerda entre sesiones.
- **Diccionarios centralizados** — Archivos de traduccion en `src/lib/i18n/` con hook `useTranslation` para componentes.

### Workspaces y equipos

- **Crear workspace** — Espacios de trabajo para organizar presentaciones en equipo.
- **Gestion de workspaces** — API completa de CRUD para workspaces.
- **Miembros** — Anadir y eliminar miembros del workspace con roles (owner, editor, viewer).
- **Switcher de workspace** — Cambiar entre workspaces personales y de equipo desde el dashboard.
- **Presentaciones de equipo** — Las presentaciones pertenecen al workspace activo.
- **Multi-workspace** — Disponible a partir del plan Agency.

### Comentarios y feedback

- **Comentarios por slide** — Anadir comentarios vinculados a slides especificos.
- **Hilos de conversacion** — Responder a comentarios creando hilos threaded.
- **Resolucion de comentarios** — Marcar hilos como resueltos.
- **Notificaciones de comentarios** — Notificaciones por email cuando alguien comenta en tus presentaciones.
- **Comentarios publicos** — La audiencia puede dejar comentarios en presentaciones publicas.

### Q&A en tiempo real

- **Panel de preguntas** — La audiencia puede enviar preguntas durante una presentacion publica.
- **Upvoting** — Los asistentes pueden votar las preguntas mas relevantes.
- **Estado de respuesta** — Marcar preguntas como respondidas.
- **Vista del presentador** — Panel de Q&A integrado en el modo presentador para gestionar preguntas en vivo.

### Grabacion y reproduccion

- **Grabar presentacion** — Capturar audio y timeline de slides durante una presentacion.
- **Timeline de slides** — Registrar que slide esta activo en cada momento de la grabacion.
- **Reproduccion** — Reproducir la grabacion sincronizada con los slides en el viewer publico.
- **Almacenamiento** — Las grabaciones se almacenan en R2.

### Notificaciones

- **Notificaciones in-app** — Icono de campana con contador de notificaciones no leidas.
- **Tipos de notificacion** — Comentario, respuesta, colaborador anadido, colaborador eliminado, presentacion compartida.
- **Notificaciones por email** — Envio de emails para eventos importantes.
- **Digest de notificaciones** — Resumen periodico por email via cron job.

### Atajos de teclado y command palette

- **Command palette** — Cmd/Ctrl+K para abrir una paleta de comandos con busqueda fuzzy de acciones.
- **Panel de atajos** — Guia interactiva con todos los shortcuts disponibles.
- **Shortcuts estandar** — Undo (Ctrl+Z), Redo (Ctrl+Shift+Z), Copy (Ctrl+C), Paste (Ctrl+V), Delete, Select All (Ctrl+A), y muchos mas.
- **Navegacion por teclado** — Flechas para navegar entre slides en el viewer.

### SEO y descubrimiento

- **robots.txt** — Reglas de crawling para motores de busqueda.
- **Sitemap dinamico** — Mapa del sitio generado automaticamente con presentaciones publicas y paginas estaticas.
- **Open Graph tags** — Meta tags OG en todas las paginas para previsualizar links en redes sociales.
- **JSON-LD Structured Data** — Marcado Schema.org para enriquecer resultados de busqueda.
- **OG Image dinamica** — Generacion automatica de imagenes Open Graph por presentacion.
- **Metadatos SEO** — Titulo, descripcion y keywords en todas las paginas.

### PWA y soporte offline

- **Service Worker** — Registro de service worker para cache de assets.
- **Pagina offline** — Fallback cuando el usuario pierde conexion.
- **Deteccion offline** — Banner en el editor que avisa cuando no hay conexion a internet.

### Moderacion de contenido

- **Reportar contenido** — Los usuarios pueden reportar presentaciones con contenido inapropiado.
- **Dashboard de reportes** — API de administracion para revisar y gestionar reportes.
- **Estado de investigacion** — Tracking del estado de cada reporte.

### Paginas legales y compliance

- **Terminos de servicio** — Pagina completa con todos los terminos legales.
- **Politica de privacidad** — Politica GDPR/CCPA compliant con detalle de datos recopilados, base legal, derechos del usuario y servicios de terceros.
- **Politica de cookies** — Detalle de cookies esenciales y de analitica con tabla de nombres, propositos y duraciones.
- **DMCA y derechos de autor** — Procedimiento de notificacion y contra-notificacion DMCA.
- **Accesibilidad** — Declaracion de conformidad parcial con WCAG 2.1 nivel AA, limitaciones conocidas y medidas implementadas.
- **Banner de cookies** — Componente de consentimiento de cookies con opciones de aceptar/rechazar.

### Paginas de error

- **Error global** — Pagina de error con captura de Sentry, mensaje descriptivo y acciones de recuperacion.
- **404 personalizado** — Pagina de "no encontrado" con diseno coherente con el brand.
- **Errores por seccion** — Paginas de error especificas para dashboard, editor y viewer.
- **Pagina offline** — Fallback cuando no hay conexion con boton de reintentar.

### Accesibilidad

- **Estructura semantica** — HTML5 con roles ARIA donde corresponde.
- **Navegacion por teclado** — Dashboard, formularios y viewer completamente navegables con teclado.
- **Touch targets** — Minimo 48px en todos los botones y elementos interactivos.
- **Reduced motion** — Respeto a la preferencia `prefers-reduced-motion` del sistema operativo.
- **Focus visible** — Indicadores de foco con outline de color accent.
- **Textos alternativos** — Alt text en imagenes del sistema.

### Rendimiento y optimizacion

- **Lazy loading de imagenes** — Carga bajo demanda de imagenes en slides.
- **Thumbnails cacheados** — Generacion y cache de miniaturas para el dashboard.
- **Virtual scrolling** — Renderizado eficiente de listas largas con `@tanstack/react-virtual`.
- **Debounced saves** — Agrupacion de cambios para reducir llamadas a la API.
- **Auto-save** — Guardado automatico periodico del estado del editor.
- **Cache de presentaciones recientes** — Acceso rapido a las ultimas presentaciones visitadas.
- **Rate limiting** — Proteccion contra abuso con Upstash Redis en endpoints criticos.

### Diseno responsive (mobile-first)

- **Breakpoints** — Mobile (<768px), tablet (768-1023px), desktop (>=1024px).
- **Clases Tailwind mobile-first** — Estilos base para mobile, `md:` para tablet, `lg:` para desktop.
- **Sidebars adaptados** — Paneles laterales como drawers o bottom-sheets en mobile.
- **Grids responsivos** — 1 columna en mobile, 2 en tablet, 3+ en desktop.
- **Tipografia escalable** — Font-sizes que se adaptan a cada breakpoint.

---

## Getting Started

```bash
npm install           # Instalar dependencias
npm run dev           # Servidor de desarrollo
npx drizzle-kit generate  # Generar migracion
npx drizzle-kit migrate   # Aplicar migraciones
npx drizzle-kit studio    # UI visual de la DB
npx partykit dev          # Servidor PartyKit local
npx partykit deploy       # Deploy a Cloudflare Workers
```

## Environment Variables

Consultar `.env.example` para la lista completa de variables necesarias.

## Project Structure

```
src/
  app/
    (auth)/login/          # Autenticacion
    dashboard/             # Dashboard + analytics
    editor/[id]/           # Editor de slides
    p/[slug]/              # Viewer publico
    presenter/[slug]/      # Modo presentador
    embed/[slug]/          # Viewer embebido
    u/[username]/          # Portfolio publico
    pricing/               # Pagina de planes
    api/                   # API routes
  components/              # Componentes compartidos
  db/                      # Drizzle schema + client
  lib/                     # Utilidades, templates, AI, email, i18n
  store/                   # Zustand editor store
  hooks/                   # Custom hooks
  types/                   # TypeScript types
party/
  main.ts                  # PartyKit Yjs server
drizzle/                   # SQL migrations
```

## License

Proprietary. All rights reserved.

Built by [Identy Cloud](https://identy.cloud).
