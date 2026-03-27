# Editorial Slides — Instrucciones para Claude Code

Plataforma web de presentaciones con estética editorial de agencia (tipografía expresiva, layouts asimétricos, estilo revista/Monocle). Editor desktop con drag & drop, viewer mobile adaptativo, colaboración realtime, share links públicos.

---

## Stack

- **Framework**: Next.js 15 (App Router, `'use client'` explícito en editor)
- **Lenguaje**: TypeScript estricto
- **Estilos**: Tailwind CSS v4
- **ORM**: Drizzle ORM
- **DB + Auth + Storage**: Supabase (Postgres + Auth + Storage bucket)
- **Imágenes**: Cloudflare R2 (egress $0)
- **Realtime/CRDT**: Yjs + y-partyserver (Cloudflare Workers + Durable Objects)
- **Estado editor**: Zustand con history middleware (undo/redo)
- **Canvas**: DOM + CSS transforms + pointer events nativos (NO Canvas 2D, NO Fabric.js, NO Konva)
- **Deploy**: Vercel Pro + Cloudflare CDN

---

## Estructura de rutas

```
/                          → landing page pública
/login                     → auth (email + Google OAuth)
/dashboard                 → mis presentaciones (CRUD)
/editor/[id]               → editor completo (solo desktop, 'use client')
/p/[slug]                  → viewer público con SSR + Open Graph
/api/presentations         → CRUD presentaciones
/api/upload                → firma URLs para R2
/api/party/[roomId]        → y-partyserver WebSocket handler
```

---

## Modelo de datos (Drizzle)

```typescript
// schema.ts

users {
  id: uuid PK
  email: text unique
  name: text
  avatar_url: text
  created_at: timestamp
}

presentations {
  id: uuid PK
  user_id: uuid FK users.id
  title: text default 'Sin título'
  slug: text unique  // para URLs públicas /p/[slug]
  theme: text default 'editorial-blue'  // ver temas disponibles
  is_public: boolean default false
  thumbnail_url: text nullable
  created_at: timestamp
  updated_at: timestamp
}

slides {
  id: uuid PK
  presentation_id: uuid FK presentations.id
  order: integer
  background_color: text default '#ffffff'
  background_image: text nullable
  elements: jsonb default '[]'  // array de Element[]
  mobile_elements: jsonb nullable  // override para mobile
  created_at: timestamp
}

collaborators {
  id: uuid PK
  presentation_id: uuid FK presentations.id
  user_id: uuid FK users.id
  role: text  // 'editor' | 'viewer'
  created_at: timestamp
}
```

### Tipos TypeScript para elementos del canvas

```typescript
type ElementType = 'text' | 'image' | 'shape' | 'arrow' | 'divider'

interface BaseElement {
  id: string
  type: ElementType
  x: number        // px desde left del slide
  y: number        // px desde top del slide
  w: number        // width en px
  h: number        // height en px
  rotation: number // grados
  opacity: number  // 0-1
  zIndex: number
  locked: boolean
}

interface TextElement extends BaseElement {
  type: 'text'
  content: string  // HTML para rich text (contentEditable)
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number  // em
  color: string
  textAlign: 'left' | 'center' | 'right'
  verticalAlign: 'top' | 'middle' | 'bottom'
}

interface ImageElement extends BaseElement {
  type: 'image'
  src: string       // URL de R2
  objectFit: 'cover' | 'contain' | 'fill'
  filter: string    // CSS filter string
}

interface ShapeElement extends BaseElement {
  type: 'shape'
  shape: 'rect' | 'circle' | 'triangle'
  fill: string
  stroke: string
  strokeWidth: number
  borderRadius: number
}

interface ArrowElement extends BaseElement {
  type: 'arrow'
  direction: 'right' | 'left' | 'up' | 'down'
  color: string
  strokeWidth: number
}
```

---

## FASE 1 — Setup del proyecto

### Objetivo
Proyecto Next.js 15 funcional con Supabase, Drizzle, autenticación y base de datos creada.

### Tareas

1. **Crear el proyecto**
```bash
npx create-next-app@latest editorial-slides \
  --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*"
cd editorial-slides
```

2. **Instalar dependencias**
```bash
# ORM y DB
npm install drizzle-orm drizzle-kit @supabase/supabase-js postgres

# Auth
npm install @supabase/auth-helpers-nextjs @supabase/ssr

# Estado y canvas
npm install zustand immer

# Realtime/CRDT
npm install yjs y-websocket

# Utilidades
npm install nanoid clsx tailwind-merge date-fns

# Dev
npm install -D @types/node tsx
```

3. **Variables de entorno** — crear `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database directa (para Drizzle)
DATABASE_URL=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# PartyKit / y-partyserver
NEXT_PUBLIC_PARTYKIT_HOST=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Crear schema Drizzle** en `src/db/schema.ts` con todos los modelos definidos arriba.

5. **Configurar Drizzle** en `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! }
})
```

6. **Crear y ejecutar migraciones**:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

7. **Configurar cliente Supabase** en `src/lib/supabase/`:
   - `server.ts` — cliente server-side con cookies
   - `client.ts` — cliente browser
   - `middleware.ts` — refresh de sesión

8. **Crear middleware** en `src/middleware.ts` para proteger rutas `/dashboard` y `/editor/*`.

9. **Verificación fase 1**: `npm run dev` sin errores, rutas accesibles, DB conectada.

---

## FASE 2 — Autenticación y Dashboard

### Objetivo
Login funcional (email/password + Google OAuth) y dashboard con CRUD de presentaciones.

### Tareas

1. **Página `/login`**:
   - Formulario email + password
   - Botón "Continuar con Google"
   - Redirect a `/dashboard` tras login exitoso
   - UI: estética editorial, tipografía expresiva, fondo oscuro

2. **Layout de dashboard** (`/dashboard/layout.tsx`):
   - Header con logo, nombre de usuario, avatar, botón logout
   - Navegación lateral (opcional)

3. **Página `/dashboard`**:
   - Grid de presentaciones (cards con thumbnail, título, fecha, menú de opciones)
   - Botón "Nueva presentación" → crea en DB y redirige a `/editor/[id]`
   - Opciones por card: Duplicar, Renombrar, Eliminar, Compartir
   - Estado vacío con CTA
   - Skeleton loading

4. **API routes**:
   - `GET /api/presentations` → lista del usuario autenticado
   - `POST /api/presentations` → crear nueva (genera slug único con nanoid)
   - `DELETE /api/presentations/[id]` → eliminar con verificación de ownership
   - `PATCH /api/presentations/[id]` → actualizar title, is_public, theme

5. **Thumbnails**: por ahora usar un placeholder con el tema de color. Los thumbnails reales se generarán en fase 4.

6. **Verificación fase 2**: login → dashboard → crear presentación → redirige a editor (que aún no existe, 404 está bien).

---

## FASE 3 — Editor Core

### Objetivo
Editor visual completamente funcional: canvas DOM, elementos arrastrables/redimensionables, toolbar, panel de slides.

### Arquitectura del editor

```
/editor/[id]/
  page.tsx                  → 'use client', layout principal
  components/
    EditorLayout.tsx         → wrapper con 3 columnas
    SlidePanel/
      SlidePanel.tsx         → lista de slides (izquierda)
      SlideThumb.tsx         → miniatura de slide
    Canvas/
      Canvas.tsx             → área de edición del slide activo
      CanvasElement.tsx      → elemento individual (texto, imagen, shape)
      SelectionBox.tsx       → bounding box con handles de resize/rotate
      TransformHandle.tsx    → handle individual (8 posiciones + rotación)
      SnapGuides.tsx         → líneas de snap mientras se arrastra
    Toolbar/
      Toolbar.tsx            → barra superior de herramientas
      TextControls.tsx       → controles tipográficos
      ShapeControls.tsx      → fill, stroke, border radius
      AlignControls.tsx      → alinear elementos
    ElementPalette/
      ElementPalette.tsx     → panel derecho, elementos para insertar
  hooks/
    useCanvas.ts             → lógica de selección, drag, resize
    useHistory.ts            → undo/redo con Zustand
    useKeyboard.ts           → atajos de teclado
  store/
    editorStore.ts           → Zustand store principal
```

### Store de Zustand (editorStore.ts)

```typescript
interface EditorState {
  // Presentación
  presentationId: string
  slides: Slide[]
  activeSlideIndex: number

  // Selección
  selectedElementIds: string[]

  // Modo de herramienta activa
  activeTool: 'select' | 'text' | 'image' | 'shape' | 'arrow'

  // Historial
  history: Slide[][]
  historyIndex: number

  // Acciones
  setActiveSlide: (index: number) => void
  addSlide: () => void
  deleteSlide: (id: string) => void
  reorderSlides: (from: number, to: number) => void

  addElement: (slideId: string, element: Element) => void
  updateElement: (slideId: string, elementId: string, updates: Partial<Element>) => void
  deleteElement: (slideId: string, elementId: string) => void
  duplicateElement: (slideId: string, elementId: string) => void

  selectElement: (id: string, multi?: boolean) => void
  clearSelection: () => void

  undo: () => void
  redo: () => void
  pushHistory: () => void

  savePresentation: () => Promise<void>
}
```

### Canvas DOM — implementación crítica

El canvas es un `div` con dimensiones fijas (1920×1080) escalado con CSS transform al viewport disponible.

```tsx
// Canvas.tsx — estructura base
const SLIDE_WIDTH = 1920
const SLIDE_HEIGHT = 1080

function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Calcular escala para que el slide quepa en el contenedor
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const container = containerRef.current.parentElement!
      const scaleX = (container.clientWidth - 48) / SLIDE_WIDTH
      const scaleY = (container.clientHeight - 48) / SLIDE_HEIGHT
      setScale(Math.min(scaleX, scaleY))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div ref={containerRef}
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* elementos del slide activo */}
    </div>
  )
}
```

### Drag y resize con pointer events

Usar ÚNICAMENTE `onPointerDown` / `onPointerMove` / `onPointerUp` con `setPointerCapture`. NO usar dnd-kit para esto.

```typescript
// useCanvas.ts — patrón base para drag
function useDragElement(elementId: string) {
  const dragState = useRef<{
    startX: number; startY: number
    origX: number; origY: number
  } | null>(null)

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragState.current = {
      startX: e.clientX, startY: e.clientY,
      origX: element.x, origY: element.y
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return
    const dx = (e.clientX - dragState.current.startX) / scale
    const dy = (e.clientY - dragState.current.startY) / scale
    updateElement(slideId, elementId, {
      x: dragState.current.origX + dx,
      y: dragState.current.origY + dy
    })
  }

  const onPointerUp = () => { dragState.current = null; pushHistory() }

  return { onPointerDown, onPointerMove, onPointerUp }
}
```

### Resize handles

8 handles (N, NE, E, SE, S, SW, W, NW) + 1 handle de rotación encima del borde N. Cada handle calcula el delta de posición y tamaño según su posición.

### Snap guides

Líneas de snap visualmente sobre el canvas cuando un elemento está a ±4px de: centro horizontal, centro vertical, bordes del slide, bordes de otros elementos.

### Atajos de teclado obligatorios

```
Cmd/Ctrl+Z     → undo
Cmd/Ctrl+Y     → redo
Cmd/Ctrl+C     → copiar elemento
Cmd/Ctrl+V     → pegar elemento
Delete/Backspace → eliminar selección
Cmd/Ctrl+D     → duplicar
Escape         → deseleccionar / salir de edición de texto
Flechas        → mover elemento 1px (con Shift: 10px)
Cmd/Ctrl+G     → agrupar (fase futura, ignorar por ahora)
```

### Auto-save

Guardar a Supabase cada 3 segundos si hay cambios (debounce). Indicador visual de estado en toolbar: "Guardado", "Guardando...", "Error al guardar".

### Verificación fase 3
- Crear slide, añadir texto, mover, resize, rotar
- Añadir imagen (upload), shape
- Undo/redo funcional
- Auto-save funcional

---

## FASE 4 — Templates y Temas

### Objetivo
5 templates editoriales listos para usar, sistema de temas visuales.

### Temas disponibles

```typescript
const THEMES = {
  'editorial-blue': {
    primary: '#1a1aff',
    background: '#f5f5f0',
    text: '#0a0a0a',
    accent: '#1a1aff',
    fontDisplay: 'Bebas Neue',     // Google Fonts
    fontBody: 'DM Sans',
  },
  'monochrome': {
    primary: '#0a0a0a',
    background: '#ffffff',
    text: '#0a0a0a',
    accent: '#0a0a0a',
    fontDisplay: 'Playfair Display',
    fontBody: 'Inter',
  },
  'dark-editorial': {
    primary: '#e8e0d0',
    background: '#0f0f0f',
    text: '#e8e0d0',
    accent: '#ff3b00',
    fontDisplay: 'Neue Haas Grotesk',  // fallback: 'Arial Narrow'
    fontBody: 'DM Mono',
  },
  'warm-magazine': {
    primary: '#2d1f14',
    background: '#f7f0e6',
    text: '#2d1f14',
    accent: '#c44b1b',
    fontDisplay: 'Cormorant Garamond',
    fontBody: 'Lato',
  },
  'swiss-minimal': {
    primary: '#ff0000',
    background: '#ffffff',
    text: '#000000',
    accent: '#ff0000',
    fontDisplay: 'Barlow Condensed',
    fontBody: 'Barlow',
  }
}
```

### Templates por tema

Cada template tiene 6 slides tipo:
1. **Cover** — título grande, subtítulo, imagen full-bleed
2. **About** — grid asimétrico texto + imagen
3. **Team** — fotos + nombres + roles
4. **Project Concept** — imagen grande + bloque de texto lateral
5. **Timeline / Stages** — contenido en columnas
6. **Progress / CTA** — datos, números, call to action

Implementar como funciones que devuelven `Slide[]` con elementos pre-posicionados.

### Selector de template en creación

Modal al crear nueva presentación: grid de previews de los 5 temas. Click → crea presentación con esos slides.

---

## FASE 5 — Share Link y Viewer Público

### Objetivo
Viewer público `/p/[slug]` con SSR, Open Graph, modo presentación fullscreen, diseño adaptativo mobile.

### Viewer (`/p/[slug]/page.tsx`)

```typescript
// SSR para Open Graph
export async function generateMetadata({ params }) {
  const presentation = await getPresentationBySlug(params.slug)
  return {
    title: presentation.title,
    openGraph: {
      title: presentation.title,
      images: [presentation.thumbnail_url],
      type: 'website'
    }
  }
}
```

### Adaptación mobile

El viewer usa la misma estructura DOM del editor pero en modo read-only. El slide (1920×1080) se escala con CSS transform:

```css
.slide-viewer {
  width: 1920px;
  height: 1080px;
  transform: scale(var(--viewer-scale));
  transform-origin: top left;
}

.slide-container {
  width: 100vw;
  height: calc(100vw * 9 / 16);  /* mantiene 16:9 */
  overflow: hidden;
  position: relative;
}
```

El `--viewer-scale` se calcula con `window.innerWidth / 1920`.

### Navegación

- Desktop: flechas del teclado, click en bordes de pantalla
- Mobile: swipe horizontal (touch events)
- Barra de progreso con número de slide actual / total
- Botón fullscreen (Presentation API)

### Controles del link público

En el dashboard, toggle "Hacer público" genera/revoca el link. Si `is_public = false`, el viewer devuelve 404.

### Thumbnail generation

Al guardar, tomar screenshot del primer slide usando `html2canvas` o `dom-to-image-more` y subir a R2. Usar como OG image y thumbnail en el dashboard.

---

## FASE 6 — Colaboración Realtime

### Objetivo
Múltiples usuarios editando simultáneamente. Cursores en tiempo real. Presence (quién está conectado).

### Setup Cloudflare Workers + PartyKit

1. Instalar: `npm install partykit y-partykit`
2. Crear `partykit.json` en raíz del proyecto
3. Crear `party/main.ts` — servidor Yjs con y-partyserver
4. Deploy: `npx partykit deploy`

### Servidor PartyKit

```typescript
// party/main.ts
import type * as Party from 'partykit/server'
import { onConnect,lobbyMiddleware } from 'y-partykit'

export default class YjsServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Validar autenticación con Supabase JWT
    const token = new URL(ctx.request.url).searchParams.get('token')
    // verificar token...
    return onConnect(conn, this.room, {
      persist: { mode: 'snapshot' }
    })
  }
}
```

### Integración Yjs en el editor

```typescript
// hooks/useCollaboration.ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export function useCollaboration(presentationId: string) {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() =>
    new WebsocketProvider(
      `wss://${process.env.NEXT_PUBLIC_PARTYKIT_HOST}`,
      presentationId,
      ydoc,
      { params: { token: supabaseSession.access_token } }
    ), [presentationId, ydoc])

  const ySlides = ydoc.getArray<Y.Map<unknown>>('slides')

  // Sincronizar Zustand ↔ Yjs
  useEffect(() => {
    ySlides.observe(() => {
      // actualizar store local con cambios remotos
    })
  }, [ySlides])

  return { ydoc, provider, ySlides }
}
```

### Presencia (cursores)

Usar Yjs Awareness protocol para compartir:
```typescript
provider.awareness.setLocalStateField('user', {
  name: currentUser.name,
  color: generateColor(currentUser.id),
  cursor: { x, y, slideIndex }
})
```

Renderizar cursores de otros usuarios como overlays en el canvas con el nombre y color del usuario.

---

## FASE 7 — Polish y Producción

### Objetivo
App production-ready: rendimiento, errores, onboarding, seguridad.

### Performance

- `React.memo` en `CanvasElement` — evitar re-renders innecesarios
- Virtualización del panel de slides (react-virtual) para presentaciones con 50+ slides
- Lazy load de fuentes Google Fonts con `font-display: swap`
- Compresión de imágenes antes de subir a R2 (canvas resize a max 2000px)
- Skeleton screens en todas las cargas

### Seguridad

- Row Level Security en Supabase para todas las tablas
- Validación de ownership en todos los API endpoints con Drizzle
- Rate limiting en `/api/upload` (máx 10 uploads/min por usuario)
- Sanitización de HTML en elementos de texto (`DOMPurify`)

### Error handling

- Error boundaries en el editor (si el canvas crashea, no pierde trabajo)
- Toast notifications para errores de red y guardado
- Retry automático en auto-save (3 intentos con backoff)

### Onboarding

- Tour interactivo al entrar al editor por primera vez (5 pasos)
- Template selector obligatorio en primera presentación
- Slide de bienvenida con instrucciones básicas

### SEO y metadata

- `robots.txt` y `sitemap.xml` (solo viewers públicos)
- Structured data para viewers públicos
- Canonical URLs

### Checklist de producción

- [ ] Variables de entorno todas seteadas en Vercel
- [ ] Cloudflare R2 bucket con CORS configurado
- [ ] Supabase RLS activado en todas las tablas
- [ ] PartyKit deployed en Cloudflare
- [ ] Dominio custom configurado
- [ ] Monitoreo de errores (Sentry)
- [ ] Analytics (PostHog)

---

## Reglas de código para Claude Code

1. **TypeScript estricto** — sin `any`, sin `@ts-ignore`
2. **Sin comentarios** en el código salvo JSDoc en funciones públicas complejas
3. **Componentes pequeños** — máximo 150 líneas por archivo
4. **Sin dependencias innecesarias** — antes de instalar algo, verificar si ya está disponible
5. **CSS en Tailwind** — no crear clases CSS custom salvo para animaciones complejas
6. **API routes** — siempre validar autenticación con `createServerClient` de Supabase
7. **Drizzle** — nunca SQL raw, siempre query builder tipado
8. **Errores** — siempre manejar con try/catch y devolver respuestas tipadas
9. **Canvas performance** — nunca leer `getBoundingClientRect` en `onPointerMove` (cachear en `onPointerDown`)
10. **Yjs** — nunca mutar `Y.Map` / `Y.Array` fuera de `doc.transact()`

---

## Orden de ejecución recomendado

```
Phase 1: Setup          → npm run dev funciona, DB conectada
Phase 2: Auth + Dashboard → login, crear presentación, redirige
Phase 3: Editor Core    → canvas funcional con elementos
Phase 4: Templates      → 5 temas, 6 slides por tema
Phase 5: Share Link     → viewer público mobile-ready
Phase 6: Realtime       → colaboración con cursores
Phase 7: Polish         → performance, seguridad, onboarding
```

Ejecutar cada fase hasta que los tests de verificación pasen antes de continuar con la siguiente.

