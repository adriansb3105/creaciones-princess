# 🎂 Creaciones Princess — Tienda en línea

Sitio web y tienda para **Creaciones Princess**: postres, agendas y decoraciones
artesanales. Catálogo por categorías y subcategorías, carrito de compras,
checkout con adelanto del 50% coordinado por WhatsApp (Sinpe Móvil o
transferencia — sin pasarela de pago), panel de administración privado, subida
de imágenes a Cloudinary y videos embebidos de YouTube.

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
│   └── (dashboard)/             # protegido por proxy.js + requireAdmin()
│       page.js, productos/, categorias/, pedidos/, galeria/, mensajes/
└── api/
    ├── categories/, products/, orders/, gallery/, contact/, contact-messages/
    └── admin/{login,logout,me,cloudinary/sign}/

components/            # Navbar, Footer, ProductCard, Lightbox, YouTubeEmbed...
components/admin/      # Sidebar, Header, ProductForm, CloudinaryUploader...
lib/                   # mongodb.js, auth.js, constants.js, seed.js, utils.js
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
| `gallery_items`      | Imágenes y videos de YouTube de la galería                 |
| `contact_messages`   | Mensajes del formulario de contacto                        |
| `admin_users`        | Usuarios del panel admin (contraseña cifrada con bcrypt)    |
| `counters`           | Contador atómico para los números de pedido (`CP-...`)     |

## Próximas mejoras sugeridas

- [ ] Reseteo de contraseña de admin desde el propio panel
- [ ] Reportes/estadísticas de ventas
- [ ] PWA con notificaciones
- [ ] Múltiples administradores con roles

---

Hecho con ❤️ para endulzar momentos especiales
