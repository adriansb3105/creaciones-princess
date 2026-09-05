# 🎂 Creaciones Princess — Tienda en línea

Sitio web y tienda para **Creaciones Princess**: postres, agendas y decoraciones
artesanales. Catálogo por categorías y subcategorías, carrito de compras,
checkout con adelanto del 50% coordinado por WhatsApp (Sinpe Móvil o
transferencia — sin pasarela de pago), panel de administración privado, subida
de imágenes a Cloudinary, videos embebidos de YouTube, y una pantalla móvil
(`/admin/publicar`) para publicar fotos/video de cada entrega en el sitio web,
Instagram y Facebook con un solo formulario.

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
├── admin/
│   ├── login/page.js            # login público del panel
│   ├── publicar/page.js         # pantalla móvil: publicar entrega (foto+video+caption)
│   └── (dashboard)/             # protegido por proxy.js + requireAdmin()
│       page.js, productos/, categorias/, pedidos/, galeria/, publicaciones/, mensajes/
└── api/
    ├── categories/, products/, orders/, gallery/, contact/, contact-messages/
    ├── social/publish/, social/publish/[id]/retry-instagram/
    └── admin/{login,logout,me,cloudinary/sign}/

components/            # Navbar, Footer, ProductCard, Lightbox, YouTubeEmbed...
components/admin/      # Sidebar, Header, ProductForm, CloudinaryUploader...
lib/                   # mongodb.js, auth.js, constants.js, seed.js, utils.js, social.js
hooks/use-cart.js      # carrito (Context + localStorage)
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

## Próximas mejoras sugeridas

- [ ] Reseteo de contraseña de admin desde el propio panel
- [ ] Reportes/estadísticas de ventas
- [ ] PWA con notificaciones
- [ ] Múltiples administradores con roles
- [ ] Publicación automática en TikTok (pendiente de aprobación de su API)

---

Hecho con ❤️ para endulzar momentos especiales
