import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/lib/utils';

// Datos ilustrativos para que la tienda no arranque vacía. Todo esto se
// edita después desde el panel de administración (/admin) — esto solo
// corre una vez, la primera vez que la base de datos está vacía.

function makeSubcategory(name) {
  return { id: uuidv4(), name, slug: slugify(name) };
}

const STARTER_CATEGORIES = [
  {
    name: 'Postres',
    description: 'Queques, tortas frías y repostería artesanal',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
    subcategoryNames: ['Queques', 'Tortas Frías', 'Repostería', 'Cupcakes', 'Galletas'],
  },
  {
    name: 'Agendas',
    description: 'Agendas personalizadas para cada estilo',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57',
    subcategoryNames: ['Personalizadas', 'Escolares'],
  },
  {
    name: 'Decoraciones',
    description: 'Decoración completa para tus fiestas y eventos',
    image: 'https://images.unsplash.com/photo-1617201460038-6e5555a8a1f5',
    subcategoryNames: ['Globos', 'Centros de Mesa', 'Kits Temáticos'],
  },
  {
    name: 'Artesanías',
    description: 'Detalles únicos hechos a mano',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443',
    subcategoryNames: ['Personalizadas'],
  },
];

export async function ensureCategoriesSeeded(db) {
  const collection = db.collection('categories');
  const count = await collection.countDocuments();
  if (count > 0) return;

  const now = new Date();
  const docs = STARTER_CATEGORIES.map((cat, index) => ({
    id: uuidv4(),
    slug: slugify(cat.name),
    name: cat.name,
    description: cat.description,
    image: cat.image,
    order: index,
    subcategories: cat.subcategoryNames.map(makeSubcategory),
    createdAt: now,
    updatedAt: now,
  }));

  await collection.insertMany(docs);
  return docs;
}

export async function ensureProductsSeeded(db) {
  const productsCollection = db.collection('products');
  const count = await productsCollection.countDocuments();
  if (count > 0) return;

  const categories = await db.collection('categories').find({}).toArray();
  const findCat = (name) => categories.find((c) => c.name === name);
  const findSub = (cat, name) => cat?.subcategories.find((s) => s.name === name);

  const postres = findCat('Postres');
  const agendas = findCat('Agendas');
  const decoraciones = findCat('Decoraciones');
  const artesanias = findCat('Artesanías');

  if (!postres || !agendas || !decoraciones || !artesanias) return;

  const now = new Date();
  const sampleProducts = [
    {
      name: 'Queque de Vainilla Clásico',
      description: 'Suave queque casero de vainilla, ideal para compartir en familia.',
      price: 12000,
      category: postres,
      subcategory: findSub(postres, 'Queques'),
      images: ['https://images.unsplash.com/photo-1486427944299-d1955d23e34d'],
      featured: true,
    },
    {
      name: 'Torta Fría de Chocolate',
      description: 'Torta fría de galleta y chocolate, cremosa y sin hornear.',
      price: 18000,
      category: postres,
      subcategory: findSub(postres, 'Tortas Frías'),
      images: ['https://images.unsplash.com/photo-1737700088028-fae0666feb83'],
      featured: true,
    },
    {
      name: 'Pastel de Rosas Elegante',
      description: 'Pastel decorado con rosas de azúcar, perfecto para cumpleaños y bodas.',
      price: 32000,
      category: postres,
      subcategory: findSub(postres, 'Repostería'),
      images: ['https://images.unsplash.com/photo-1581745071812-e69f8cf9e898'],
      featured: true,
    },
    {
      name: 'Cupcakes Red Velvet (docena)',
      description: 'Doce cupcakes de terciopelo rojo con frosting de queso crema.',
      price: 9500,
      category: postres,
      subcategory: findSub(postres, 'Cupcakes'),
      images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7'],
      featured: true,
    },
    {
      name: 'Galletas Decoradas (docena)',
      description: 'Galletas artesanales decoradas a mano según el tema de tu evento.',
      price: 8500,
      category: postres,
      subcategory: findSub(postres, 'Galletas'),
      images: ['https://images.unsplash.com/photo-1618411640026-24e40dcde1ab'],
      featured: false,
    },
    {
      name: 'Agenda Personalizada 2026',
      description: 'Agenda anual personalizada con tu nombre, diseño y colores favoritos.',
      price: 14000,
      category: agendas,
      subcategory: findSub(agendas, 'Personalizadas'),
      images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57'],
      featured: true,
    },
    {
      name: 'Agenda Escolar',
      description: 'Agenda escolar resistente y personalizable, ideal para el colegio.',
      price: 11000,
      category: agendas,
      subcategory: findSub(agendas, 'Escolares'),
      images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57'],
      featured: false,
    },
    {
      name: 'Set de Globos Dorados',
      description: 'Set completo de globos dorados y accesorios para decorar tu fiesta.',
      price: 16000,
      category: decoraciones,
      subcategory: findSub(decoraciones, 'Globos'),
      images: ['https://images.unsplash.com/photo-1617201460038-6e5555a8a1f5'],
      featured: true,
    },
    {
      name: 'Centro de Mesa Floral',
      description: 'Elegante centro de mesa con flores y velas para tu evento.',
      price: 13500,
      category: decoraciones,
      subcategory: findSub(decoraciones, 'Centros de Mesa'),
      images: ['https://images.unsplash.com/photo-1673555363891-a514a04fb91f'],
      featured: false,
    },
    {
      name: 'Kit Temático de Fiesta',
      description: 'Kit completo de decoración temática, personalizable según la ocasión.',
      price: 22000,
      category: decoraciones,
      subcategory: findSub(decoraciones, 'Kits Temáticos'),
      images: ['https://images.unsplash.com/photo-1506806732259-39c2d0268443'],
      featured: false,
    },
    {
      name: 'Artesanía Personalizada',
      description: 'Creación artesanal hecha a mano según tus especificaciones.',
      price: 10000,
      category: artesanias,
      subcategory: findSub(artesanias, 'Personalizadas'),
      images: ['https://images.unsplash.com/photo-1506806732259-39c2d0268443'],
      featured: false,
    },
  ];

  const docs = sampleProducts.map((p) => ({
    id: uuidv4(),
    slug: slugify(p.name),
    name: p.name,
    description: p.description,
    price: p.price,
    categoryId: p.category.id,
    subcategoryId: p.subcategory ? p.subcategory.id : null,
    images: p.images,
    youtubeVideoId: null,
    featured: p.featured,
    active: true,
    availabilityNote: 'Bajo pedido, se coordina fecha de entrega',
    createdAt: now,
    updatedAt: now,
  }));

  await productsCollection.insertMany(docs);
}

export async function ensureGallerySeeded(db) {
  const collection = db.collection('gallery_items');
  const count = await collection.countDocuments();
  if (count > 0) return;

  const images = [
    'https://images.unsplash.com/photo-1620525429871-81919b5bd668',
    'https://images.unsplash.com/photo-1562054437-e9b315c0ff4f',
    'https://images.unsplash.com/photo-1727419912925-240f548f28f6',
    'https://images.pexels.com/photos/5864214/pexels-photo-5864214.jpeg',
    'https://images.pexels.com/photos/853006/pexels-photo-853006.jpeg',
    'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
    'https://images.unsplash.com/photo-1519869325930-281384150729',
    'https://images.unsplash.com/photo-1617201460038-6e5555a8a1f5',
    'https://images.unsplash.com/photo-1673555363891-a514a04fb91f',
    'https://images.unsplash.com/photo-1737700088028-fae0666feb83',
    'https://images.unsplash.com/photo-1761016324065-f28bd12961df',
    'https://images.unsplash.com/photo-1618411640026-24e40dcde1ab',
  ];

  const now = new Date();
  const docs = images.map((url, index) => ({
    id: uuidv4(),
    type: 'image',
    url,
    youtubeVideoId: null,
    caption: '',
    order: index,
    createdAt: now,
  }));

  await collection.insertMany(docs);
}

export async function ensureSeeded(db) {
  await ensureCategoriesSeeded(db);
  await ensureProductsSeeded(db);
  await ensureGallerySeeded(db);
}
