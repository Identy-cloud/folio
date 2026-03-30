@AGENTS.md

# Editorial Slides — CLAUDE.md

## Proyecto
Plataforma web de presentaciones con estética editorial de agencia.
Editor desktop, viewer mobile adaptativo, colaboración realtime, share links públicos.

## Mobile First — OBLIGATORIO
- TODO componente y pantalla DEBE funcionar en mobile (375px) antes de pensar en desktop
- Escribir clases Tailwind mobile-first: clases base para mobile, `md:` para tablet, `lg:` para desktop
- Breakpoints: mobile (<768px), tablet (768-1023px), desktop (≥1024px)
- Touch targets mínimo 44px
- No usar anchos fijos (`w-56`, `w-64`) sin responsive — usar `w-full` base + ancho fijo en `md:`
- Grids: 1 columna en mobile, 2 en `sm:`, 3+ en `lg:`
- Sidebars/paneles: ocultos en mobile, drawer/bottom-sheet para acceder
- Textos: escalar font-size con breakpoints si es necesario
- Testear siempre en 375px de ancho mínimo

## Stack — NO cambiar sin preguntar
- Framework: Next.js 15, App Router
- Lenguaje: TypeScript estricto (sin any, sin @ts-ignore)
- Estilos: Tailwind CSS v4 (sin CSS custom salvo animaciones complejas)
- ORM: Drizzle (nunca SQL raw, nunca Supabase JS para queries de DB)
- DB + Auth + Storage: Supabase
- Imágenes: Cloudflare R2 (NO Supabase Storage para imágenes de usuario)
- Realtime/CRDT: Yjs + y-partyserver (Cloudflare Durable Objects)
- Estado editor: Zustand con history middleware
- Canvas: DOM + CSS transforms + pointer events nativos

## Lo que NUNCA debes usar
- Canvas 2D API (HTMLCanvasElement)
- Fabric.js
- Konva.js / react-konva
- dnd-kit para manipulación de elementos dentro del canvas
- Supabase JS client para queries de base de datos (usar Drizzle)
- any en TypeScript
- CSS inline salvo transforms y valores dinámicos del canvas
- Librerías de animación pesadas (GSAP, Framer Motion) — usar CSS

## Estructura de carpetas
```
src/
  app/
    (auth)/login/
    dashboard/
    editor/[id]/
    p/[slug]/
    api/
  components/
  db/
    schema.ts
    index.ts
  lib/
    supabase/
    r2.ts
  store/
    editorStore.ts
  hooks/
  types/
party/
  main.ts
drizzle/
```

## Comandos frecuentes
```bash
npm run dev                 → servidor de desarrollo
npx drizzle-kit generate    → generar migración tras cambiar schema.ts
npx drizzle-kit migrate     → aplicar migraciones pendientes
npx drizzle-kit studio      → UI visual de la DB
npx partykit dev            → servidor PartyKit local
npx partykit deploy         → deploy a Cloudflare Workers
```

## Reglas de código
- Componentes: máximo 150 líneas por archivo
- Sin comentarios inline salvo JSDoc en funciones públicas complejas
- API routes: siempre validar autenticación antes de cualquier operación
- Canvas performance: nunca llamar getBoundingClientRect en onPointerMove
- Yjs: siempre mutar dentro de doc.transact()
- Drizzle: siempre verificar ownership del recurso antes de update/delete
- Imágenes de usuario: comprimir a máx 2000px antes de subir a R2
- HTML en elementos de texto: sanitizar con DOMPurify antes de renderizar

## Modelo de datos clave
- presentations → slides → elements (jsonb array)
- Element tiene: id, type, x, y, w, h, rotation, opacity, zIndex, locked + props específicos por tipo
- Tipos de elemento: text, image, shape, arrow, divider
- Canvas fijo: 1920×1080px, escalado con CSS transform al viewport

## Temas disponibles
editorial-blue, monochrome, dark-editorial, warm-magazine, swiss-minimal

## Variables de entorno necesarias
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
NEXT_PUBLIC_PARTYKIT_HOST
NEXT_PUBLIC_APP_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_PRO_MONTHLY
STRIPE_PRICE_TEAM_MONTHLY
NEXT_PUBLIC_SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
ADMIN_EMAIL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
UNSPLASH_ACCESS_KEY
CRON_SECRET

## Cloudflare — Setup automático requerido

Claude Code debe configurar Cloudflare automáticamente en la Fase 1 usando Wrangler CLI.

### R2 Bucket
- Nombre del bucket: `folio-assets`
- Crear con: `npx wrangler r2 bucket create folio-assets`
- Activar dominio público en el bucket
- Configurar CORS para localhost:3000 y el dominio de Vercel

### Workers (PartyKit)
- El servidor Yjs vive en `/party/main.ts`
- Deploy con: `npx partykit deploy`
- El host resultante va en `NEXT_PUBLIC_PARTYKIT_HOST`

### Comandos de setup en orden
```bash
npx wrangler login
npx wrangler r2 bucket create folio-assets
npx wrangler r2 bucket cors put folio-assets --file cors.json
npx wrangler r2 bucket domain add folio-assets
```

### Archivo cors.json a crear en raíz
```json
[{
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://*.vercel.app"
  ],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}]
```

### Variables a extraer tras el setup
- R2_ACCOUNT_ID → desde `npx wrangler whoami`
- R2_BUCKET_NAME → folio-assets
- R2_PUBLIC_URL → dominio público del bucket
- NEXT_PUBLIC_PARTYKIT_HOST → output del deploy PartyKit

## Pendientes — No olvidar

### Infraestructura
- Image CDN resize — configurar Cloudflare Image Resizing o similar
- Monitoreo de errores — Sentry o similar
- Tests — al menos API routes y editorStore

### OAuth Social Login
- Google y GitHub OAuth están implementados en el código (login page + callback route)
- Para que funcionen, hay que habilitar los providers en Supabase Dashboard:
  - Authentication → Providers → Google: activar, añadir Client ID y Client Secret de Google Cloud Console
  - Authentication → Providers → GitHub: activar, añadir Client ID y Client Secret de GitHub OAuth App
- El callback URL a configurar en ambos providers es: `{NEXT_PUBLIC_APP_URL}/auth/callback`

### Seguridad
- JWT en WebSocket headers en vez de query params (requiere cambio en y-websocket provider)
- Re-autenticación (password) antes de borrar cuenta
- `getUser()` en vez de `getSession()` en useCollaboration

### Pricing — Modelo de planes
- **Free**: 5 presentaciones, 100 MB almacenamiento, 5 temas, exportar como imagen
- **Pro** ($12/mes): ilimitadas, 10 GB, temas custom, PDF, sin watermark
- **Team** ($29/mes/miembro): todo Pro + colaboración realtime, workspace, roles
- Columna `plan` en tabla `users` (free/pro/team)
- Columna `storageUsed` en tabla `users` (bytes)
- Enforced en: POST /api/presentations, POST /api/upload, exportToPdf
- Página de pricing existe pero es solo visual, no hay enforcement