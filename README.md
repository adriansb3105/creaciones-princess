# 🎂 Creaciones Princess — Tienda en línea

Sitio web y tienda para **Creaciones Princess**: postres, agendas y decoraciones
artesanales. Catálogo por categorías y subcategorías, carrito de compras,
checkout con adelanto del 50% coordinado por WhatsApp (Sinpe Móvil o
transferencia — sin pasarela de pago), panel de administración privado, subida
de imágenes a Cloudinary, videos embebidos de YouTube, una pantalla móvil
(`/admin/publicar`) para publicar fotos/video de cada entrega en el sitio web,
Instagram y Facebook con un solo formulario, y un **recetario** (`/recetario`)
con recetas guardadas de YouTube/TikTok/Instagram/Facebook, filtros, favoritos
y estado de revisión — sin usar ningún servicio de pago.

## Stack técnico

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Tailwind CSS 4** + shadcn/ui ("new-york")
- **MongoDB** (driver nativo, sin ORM)
- **Node.js 22** (ver `.nvmrc` / `engines` en `package.json`)
- Autenticación admin propia con **jose** (JWT) + **bcryptjs**
- Imágenes en **Cloudinary** (subida firmada desde el panel admin)
- Videos embebidos de **YouTube**

## Estructura del proyecto

```
app/
├── (public)                     # páginas públicas (usan Navbar/Footer/WhatsApp)
│   page.js, productos/, productos/[slug]/, carrito/, checkout/,
│   pedido-confirmado/[id]/, galeria/, sobre-nosotros/, contacto/
│   recetario/, recetario/explorar/, recetario/receta/[slug]/,
│   recetario/lista-de-compras/
├── admin/
│   ├── login/page.js            # login público del panel
│   ├── publicar/page.js         # pantalla móvil: publicar entrega (foto+video+caption)
│   └── (dashboard)/             # protegido por proxy.js + requireAdmin()
│       page.js, productos/, categorias/, pedidos/, galeria/, publicaciones/, mensajes/,
│       recetario/, recetario/nueva/, recetario/[id]/, recetario/importar/
└── api/
    ├── categories/, products/, orders/, gallery/, contact/, contact-messages/
    ├── recipe-categories/, recipes/, recipes/[id]/
    ├── social/publish/, social/publish/[id]/retry-instagram/
    └── admin/{login,logout,me,cloudinary/sign,recipes/detect,recipes/import}/

components/            # Navbar, Footer, ProductCard, Lightbox, YouTubeEmbed...
components/admin/      # Sidebar, Header, ProductForm, RecipeForm, CloudinaryUploader...
components/recetario/  # RecipeCard, StatusBadge, SourceBadge
lib/                   # mongodb.js, auth.js, constants.js, seed.js, utils.js, social.js
lib/recipes/           # categorías, normalización, estado, plataformas, extractores,
                        # parse-text.js, evidence.js, structure.js (importación sin IA)
hooks/use-cart.js, use-recipe-favorites.js, use-shopping-list.js   # Context + localStorage
proxy.js               # protege /admin y /api/admin (antes "middleware.js")
```

## Configuración de negocio

Los números de WhatsApp, el de Sinpe Móvil, el porcentaje de adelanto y demás
datos del negocio están centralizados en **`lib/constants.js`** — es el único
archivo que necesitas tocar para cambiarlos.

## Puesta en marcha local

1. **Instalar dependencias** (Node 22 recomendado, ver `.nvmrc`)
   ```bash
   yarn install
   ```

2. **Configurar variables de entorno**

   Copia `.env.example` a `.env` y completa los valores:
   ```bash
   cp .env.example .env
   ```
   - `MONGO_URL` / `DB_NAME`: tu base de datos MongoDB (local o Atlas).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: se usan **una sola vez** para crear el
     primer usuario admin (ya cifrado) la primera vez que alguien inicia
     sesión. Para "resetear" la contraseña, borra la colección `admin_users`.
   - `JWT_SECRET`: genera uno propio, por ejemplo:
     `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `CLOUDINARY_*`: crea una cuenta gratuita en https://cloudinary.com y toma
     el cloud name, API key y API secret de tu Dashboard.

3. **Iniciar el servidor de desarrollo**
   ```bash
   yarn dev
   ```
   Abre http://localhost:3000. La primera vez que cargues la tienda o el
   panel admin, la base de datos se siembra automáticamente con categorías,
   subcategorías, productos y galería de ejemplo (editables desde `/admin`).

4. **Entrar al panel admin**

   Ve a http://localhost:3000/admin/login con el `ADMIN_EMAIL`/`ADMIN_PASSWORD`
   que pusiste en `.env`.

5. **Correr los tests** (lógica pura del recetario: normalización de
   ingredientes, detección de plataforma, cálculo de estado, parser de
   importación y validación de evidencia)
   ```bash
   yarn test
   ```

## Cómo funciona un pedido (sin pasarela de pago)

1. El cliente arma su carrito y va a **Checkout**, donde llena sus datos y
   elige retiro o entrega.
2. Al confirmar, el servidor recalcula el total **desde la base de datos**
   (nunca confía en el precio enviado por el navegador) y crea el pedido con
   estado `pending_payment`.
3. La página de confirmación muestra el resumen, el **50% de adelanto**
   requerido, y botones para escribir por WhatsApp a los números configurados
   en `lib/constants.js` (el primero también recibe Sinpe Móvil). Los datos
   exactos de transferencia bancaria se coordinan por chat, no se publican en
   el sitio.
4. Desde `/admin/pedidos` puedes ver cada pedido y cambiar su estado
   (pendiente → adelanto confirmado → en preparación → listo → entregado).

## Publicar entregas en Instagram + Facebook automáticamente

`/admin/publicar` es una pantalla pensada para el celular: se elige el
producto (opcional), se suben fotos y/o un video, se escribe una descripción,
y al presionar **Publicar** el sistema:

1. Guarda las fotos/video en la galería del sitio (siempre, sin importar lo demás).
2. Publica en la Página de Facebook (foto, álbum o video según lo que subiste).
3. Publica en Instagram (foto, carrusel, o Reel si subiste video).

Ambas redes se publican vía la **Graph API de Meta**, así que hace falta
configurarlo una vez:

1. **Instagram debe ser cuenta Empresa/Creador**, vinculada a una Página de
   Facebook (Instagram → Configuración y privacidad → Tipo de cuenta y
   herramientas).
2. Crea una app en [developers.facebook.com](https://developers.facebook.com/apps) →
   **Crear app** → tipo **Negocio**.
3. Ve a la [Graph API Explorer](https://developers.facebook.com/tools/explorer/),
   selecciona tu app, dale **Generate Access Token** e inicia sesión con la
   cuenta que administra la Página. Otorga los permisos: `pages_show_list`,
   `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`,
   `instagram_content_publish`.
4. Convierte ese token en uno de **larga duración** (no expira mientras no se
   revoque la app): en la Explorer, ícono de información (i) junto al token →
   **Open in Access Token Tool** → **Extend Access Token**. Copia el token
   extendido.
5. Con ese token, llama `GET /me/accounts` (en la misma Explorer) — te
   devuelve el **Page Access Token** y el **Page ID** de tu Página. Guarda
   ambos como `META_PAGE_ACCESS_TOKEN` y `META_PAGE_ID`.
6. Llama `GET /{page-id}?fields=instagram_business_account` — te da el
   **Instagram Business Account ID**. Guárdalo como `META_IG_BUSINESS_ID`.
7. Agrega las tres variables en `.env` (local) y en Vercel (producción).

Si Meta no está configurado, `/admin/publicar` sigue guardando todo en la
galería del sitio — solo Instagram/Facebook muestran un error claro en vez de
publicar, así que es seguro usarlo antes de terminar esta configuración.

**Nota:** los videos de Instagram (Reels) tardan unos segundos en procesarse;
si no terminan a tiempo, la publicación queda en estado "Procesando" con un
botón para **Reintentar** más tarde — no hay que volver a subir nada.
**TikTok queda fuera de esta automatización por ahora** (su API de
publicación requiere aprobación de TikTok que no está garantizada).

## Recetario (`/recetario`)

Recetas guardadas de YouTube, TikTok, Instagram y Facebook, organizadas en
Desayunos / Almuerzos / Cenas / Snacks, con búsqueda, filtros, favoritos por
visitante (en su navegador) y una regla estricta: **nunca se inventa
información**. Si faltan ingredientes o pasos, la receta queda marcada
`Incompleta` automáticamente (`lib/recipes/status.js` recalcula el estado en
cada guardado — un admin no puede forzar "Verificada" en una receta a medias).

**Dos formas de cargar recetas, las dos 100% gratis (sin APIs de pago ni IA):**

**A. Manual** — `/admin/recetario/nueva`: pega el enlace y dale al botón de
detectar (lupa) para traer automáticamente lo que cada red da gratis y sin
cuenta, y completa ingredientes/pasos a mano.
- **YouTube**: título y miniatura siempre; la descripción completa solo si
  configuras `YOUTUBE_API_KEY` (gratis, cuota diaria — ver `.env.example`).
- **TikTok**: título, autor y miniatura (el "título" de TikTok es el caption
  del video).
- **Instagram**: requiere que ya hayas configurado `META_PAGE_ACCESS_TOKEN`
  (mismo token de la sección de arriba) — sin eso, Meta no deja traer nada.
- **Facebook**: Meta nunca entrega el texto del post por API (confirmado en
  pruebas), así que siempre hay que pegar la descripción a mano.

**B. Importación asistida** — `/admin/recetario/importar`: pega el enlace y/o
el texto (descripción, transcripción que hayas conseguido por tu cuenta), y
un **parser determinista sin IA** (`lib/recipes/parse-text.js`) separa
ingredientes y pasos automáticamente:
- Reconoce líneas de ingredientes por su cantidad ("2 tazas de harina", "1/2
  cdta de sal") y pasos por su numeración ("1. Mezclar todo").
- Si el texto trae encabezados explícitos ("Ingredientes:", "Preparación:"),
  confía en esa estructura para las líneas sin número — pero igual descarta
  relleno típico de redes sociales (hashtags, "sígueme", links) que a veces
  queda pegado al final.
- Cada línea detectada guarda su **cita literal** del texto original
  (`evidence`); el servidor verifica que esa cita exista de verdad en la
  fuente antes de aceptarla (`lib/recipes/evidence.js`) — nunca se inventa
  un ingrediente o un paso que no esté escrito.
- Lo que no se puede clasificar queda aparte ("texto sin clasificar") para
  que lo agregues a mano.
- Al guardar, la receta queda como **"Requiere revisión"** hasta que marques
  la casilla de confirmación (comparando contra el texto de la fuente,
  visible en el mismo formulario) — recién ahí puede pasar a "Verificada".

Publica la receta cuando esté lista, desde cualquiera de los dos flujos.

Los favoritos se guardan en el navegador de cada visitante (no requieren
cuenta); todo lo demás vive en las mismas colecciones de Mongo que el resto
del sitio.

**Lista de compras** (`/recetario/lista-de-compras`): desde cualquier receta
se puede agregar un ingrediente suelto o todos de una vez. También vive solo
en el navegador de cada visitante (`hooks/use-shopping-list.js`), igual que
favoritos y el carrito — no hace falta cuenta. Dos ingredientes solo se
combinan en una fila si coincide el nombre normalizado, la unidad, **y ambas
cantidades son números reales** (`lib/recipes/normalize.js` → `parseQuantity`
/ `sameIngredient`); algo como "sal al gusto" nunca se suma con un número,
queda como fila aparte para no inventar una cantidad.

## Despliegue en Vercel

El proyecto está listo para desplegar tal cual (sin `output: 'standalone'`,
con `serverExternalPackages` e imágenes remotas configuradas para Cloudinary):

1. Sube el repo a GitHub y conéctalo en [vercel.com](https://vercel.com).
2. En **Project Settings → Environment Variables**, agrega todas las
   variables de `.env.example` con sus valores reales de producción.
3. En **Project Settings → General**, confirma que la versión de Node sea
   **22.x** (o superior) — ya está declarado en `package.json` (`engines`).
4. Deploy. Cada push a la rama principal genera un nuevo despliegue.

**Importante:** `.env` nunca se sube a git (está en `.gitignore`). Solo
`.env.example` (con valores de ejemplo, sin secretos) se versiona.

## Colecciones de MongoDB

| Colección          | Contenido                                                |
|---------------------|-----------------------------------------------------------|
| `categories`         | Categorías con subcategorías embebidas                    |
| `products`           | Productos (precio en colones, imágenes de Cloudinary)     |
| `orders`             | Pedidos con totales recalculados en servidor               |
| `gallery_items`      | Imágenes, videos de YouTube y videos subidos (`clip`) de la galería |
| `contact_messages`   | Mensajes del formulario de contacto                        |
| `admin_users`        | Usuarios del panel admin (contraseña cifrada con bcrypt)    |
| `counters`           | Contador atómico para los números de pedido (`CP-...`)     |
| `delivery_posts`     | Historial de publicaciones hechas desde `/admin/publicar` (con el resultado en cada red) |
| `recipe_categories`  | Desayunos / Almuerzos / Cenas / Snacks (se pueden agregar más)   |
| `recipes`            | Recetas con ingredientes/pasos embebidos, fuente y estado         |
| `recipe_import_jobs` | Registro de cada análisis hecho en `/admin/recetario/importar` (para trazabilidad) |

## Próximas mejoras sugeridas

- [ ] Reseteo de contraseña de admin desde el propio panel
- [ ] Reportes/estadísticas de ventas
- [ ] PWA con notificaciones
- [ ] Múltiples administradores con roles
- [ ] Publicación automática en TikTok (pendiente de aprobación de su API)
- [ ] Carga por lote de las ~100 recetas: transcripción local (yt-dlp +
      faster-whisper) + estructuración asistida en una sesión de Claude Code +
      inserción validada contra evidencia (ver el plan en el historial)

---

Hecho con ❤️ para endulzar momentos especiales
