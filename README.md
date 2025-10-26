# 🎂 Creaciones Princess - Sitio Web

> Sitio web moderno y elegante para **Creaciones Princess**, un negocio de postres artesanales, pasteles personalizados, artesanías y decoraciones para fiestas.

![Creaciones Princess](https://images.unsplash.com/photo-1581745071812-e69f8cf9e898?w=800)

## ✨ Características

### 🎨 Diseño y Estilo
- **Paleta de colores**: Rosa pastel, crema, dorado y blanco
- **Tipografía**: Poppins (moderna) + Great Vibes (cursiva elegante)
- **Estética**: Femenina, artesanal, dulce y cálida
- **100% Responsivo**: Adaptado para desktop, tablet y móvil
- **Animaciones suaves**: Framer Motion para transiciones elegantes

### 📱 Páginas Implementadas

#### 1. **Inicio** (`/`)
- Hero section con imagen de fondo y llamado a la acción
- Sección de categorías (Pasteles, Postres, Artesanías, Decoraciones)
- Productos destacados (con filtro de base de datos)
- Snippet "Sobre Nosotros"
- Testimonios de clientes
- Sección CTA final

#### 2. **Productos** (`/productos`)
- Grid de productos con imágenes y descripciones
- Filtros por categoría (Todos, Pasteles, Postres, Artesanías, Decoraciones)
- Buscador en tiempo real
- Contador de productos mostrados
- Tarjetas con hover effects y botón "Ordenar"

#### 3. **Galería** (`/galeria`)
- Layout tipo masonry (columnas dinámicas)
- 15+ imágenes de alta calidad
- Lightbox con navegación (flechas, escape key)
- Hover effect con indicación de zoom
- Animaciones de entrada staggered

#### 4. **Sobre Nosotros** (`/sobre-nosotros`)
- Historia de la marca
- Tarjetas de valores (Amor, Calidad, Personalización, Creatividad)
- Perfil de la fundadora con foto y biografía
- Diseño en dos columnas con imágenes

#### 5. **Contacto** (`/contacto`)
- Formulario con validación (Nombre, Email, Teléfono, Mensaje)
- Tarjetas de información de contacto
- Placeholder para mapa de ubicación
- Toast notifications para feedback
- Guardado en MongoDB

### 🛠️ Funcionalidades Técnicas

#### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: JavaScript (React)
- **Estilos**: TailwindCSS + shadcn/ui components
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Validación**: React Hook Form + Zod

#### Backend
- **API**: Next.js API Routes
- **Base de datos**: MongoDB
- **IDs**: UUID v4 (no ObjectID)
- **Endpoints**:
  - `GET /api/products` - Obtener productos (con filtros)
  - `GET /api/products?featured=true` - Productos destacados
  - `POST /api/contact` - Enviar mensaje de contacto
  - `GET /api/contact-messages` - Obtener mensajes

#### Componentes Reutilizables
- **Navbar**: Navegación responsive con menú móvil
- **Footer**: Enlaces, contacto y redes sociales
- **WhatsAppButton**: Botón flotante con animación
- **ProductCard**: Tarjeta de producto con imagen y CTA
- **Lightbox**: Visor de imágenes con navegación

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Yarn o npm
- MongoDB (local o Atlas)

### Pasos de Instalación

1. **Instalar dependencias**
```bash
yarn install
# o
npm install
```

2. **Configurar variables de entorno**

Archivo `.env` ya incluido:
```env
MONGO_URL=mongodb://localhost:27017/creaciones_princess
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Iniciar el servidor de desarrollo**
```bash
yarn dev
# o
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📦 Estructura del Proyecto

```
/app
├── app/
│   ├── api/
│   │   └── [[...path]]/
│   │       └── route.js          # API Routes (productos, contacto)
│   ├── productos/
│   │   └── page.js               # Página de productos
│   ├── galeria/
│   │   └── page.js               # Página de galería
│   ├── sobre-nosotros/
│   │   └── page.js               # Página sobre nosotros
│   ├── contacto/
│   │   └── page.js               # Página de contacto
│   ├── layout.js                 # Layout principal
│   ├── page.js                   # Página de inicio
│   └── globals.css               # Estilos globales
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── Navbar.jsx                # Barra de navegación
│   ├── Footer.jsx                # Pie de página
│   ├── WhatsAppButton.jsx        # Botón flotante de WhatsApp
│   ├── ProductCard.jsx           # Tarjeta de producto
│   └── Lightbox.jsx              # Visor de imágenes
├── hooks/
│   └── use-toast.js              # Hook para toasts
├── lib/
│   └── utils.js                  # Utilidades
├── public/                       # Archivos estáticos
├── tailwind.config.js            # Configuración de Tailwind
├── package.json                  # Dependencias
└── README.md                     # Este archivo
```

## 🎨 Paleta de Colores

```css
/* Colores principales */
--primary: 340 82% 72%        /* Rosa */
--secondary: 39 76% 87%       /* Crema */
--accent: 45 93% 85%          /* Dorado claro */
--background: 0 0% 100%       /* Blanco */
--foreground: 340 10% 10%     /* Gris oscuro */
```

## 📝 Contenido de Ejemplo

El sitio incluye **12 productos de ejemplo** en 4 categorías:

### Pasteles
- Pastel de Rosas Elegante ($85)
- Pastel de Bodas Clásico ($150)
- Pastel Matcha Especial ($70)
- Pastel de Chocolate Artesanal ($75)

### Postres
- Cupcakes Red Velvet ($32)
- Cupcakes Pastel ($28)
- Cupcakes de Vainilla ($30)
- Cupcakes Celebración ($35)
- Donas Decoradas ($25)

### Decoraciones
- Decoración con Globos Dorados ($65)
- Centro de Mesa Floral ($45)

### Artesanías
- Artesanía Personalizada ($40)

## 🔧 Personalización

### Cambiar Información de Contacto

Edita los placeholders en:
- `/app/components/Footer.jsx` - Teléfono, email, dirección
- `/app/components/WhatsAppButton.jsx` - Número de WhatsApp
- `/app/app/contacto/page.js` - Información de contacto

### Modificar Colores

Edita `/app/app/globals.css`:
```css
:root {
  --primary: 340 82% 72%;  /* Tu color rosa */
  --secondary: 39 76% 87%; /* Tu color crema */
}
```

### Agregar/Editar Productos

Los productos se inicializan automáticamente desde `/app/app/api/[[...path]]/route.js`.

Puedes agregar productos via API:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Pastel",
    "description": "Descripción del pastel",
    "price": 95.00,
    "category": "Pasteles",
    "image": "https://...",
    "featured": true
  }'
```

### Cambiar Imágenes

Todas las imágenes vienen de Unsplash/Pexels. Reemplaza las URLs en:
- `/app/app/api/[[...path]]/route.js` - Productos
- `/app/app/galeria/page.js` - Galería
- `/app/app/page.js` - Hero y secciones

## 📱 Características de Accesibilidad

- ✅ Navegación por teclado
- ✅ Contraste de colores WCAG AA
- ✅ Etiquetas ARIA
- ✅ Formularios con labels
- ✅ Imágenes con alt text
- ✅ Responsive design

## 🌐 SEO Optimizado

- ✅ Meta tags en `layout.js`
- ✅ Open Graph tags
- ✅ Títulos descriptivos
- ✅ URLs semánticas
- ✅ Imágenes optimizadas con lazy loading

## 🚀 Despliegue en Vercel

### Método 1: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel Dashboard
# MONGO_URL=tu_mongodb_atlas_url
```

### Método 2: Via GitHub

1. Push a GitHub
2. Conecta el repo en [vercel.com](https://vercel.com)
3. Agrega `MONGO_URL` en Environment Variables
4. Deploy automático

## 🔐 Variables de Entorno en Producción

```env
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/creaciones_princess
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
```

## 📊 Base de Datos MongoDB

### Colecciones

#### `products`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "image": "string",
  "featured": "boolean",
  "createdAt": "date"
}
```

#### `contact_messages`
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string",
  "read": "boolean",
  "createdAt": "date"
}
```

## 🎯 Próximas Mejoras (Sugerencias)

- [ ] Panel de administración para gestionar productos
- [ ] Sistema de carrito de compras
- [ ] Integración de pagos (Stripe/PayPal)
- [ ] Blog de recetas y consejos
- [ ] Sistema de pedidos personalizados
- [ ] Galería con categorías
- [ ] Modo oscuro
- [ ] Múltiples idiomas (i18n)
- [ ] PWA con notificaciones
- [ ] Analytics (Google Analytics)

## 📄 Licencia

Este proyecto fue creado para **Creaciones Princess**.

## 🤝 Soporte

Para soporte y consultas:
- Email: hola@creacionesprincess.com
- WhatsApp: +1 (555) 123-4567
- Sitio web: https://creacionesprincess.com

---

Hecho con ❤️ para endulzar momentos especiales
