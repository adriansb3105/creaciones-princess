import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error('Please define MONGO_URL environment variable');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db('creaciones_princess');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Sample products data
const sampleProducts = [
  {
    id: uuidv4(),
    name: 'Pastel de Rosas Elegante',
    description: 'Hermoso pastel decorado con rosas de azúcar y detalles dorados',
    price: 85.00,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1581745071812-e69f8cf9e898',
    featured: true,
  },
  {
    id: uuidv4(),
    name: 'Pastel de Bodas Clásico',
    description: 'Pastel de tres pisos con decoración floral delicada',
    price: 150.00,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1672081211046-f494525f9a1b',
    featured: true,
  },
  {
    id: uuidv4(),
    name: 'Cupcakes Red Velvet',
    description: 'Deliciosos cupcakes de terciopelo rojo con frosting de queso crema',
    price: 32.00,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
    featured: true,
  },
  {
    id: uuidv4(),
    name: 'Cupcakes Pastel',
    description: 'Cupcakes decorados con sprinkles de colores pastel',
    price: 28.00,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729',
    featured: false,
  },
  {
    id: uuidv4(),
    name: 'Cupcakes de Vainilla',
    description: 'Cupcakes clásicos de vainilla con frosting de colores',
    price: 30.00,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d',
    featured: true,
  },
  {
    id: uuidv4(),
    name: 'Cupcakes Celebración',
    description: 'Cupcakes especiales para celebraciones con decoración festiva',
    price: 35.00,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1426869884541-df7117556757',
    featured: true,
  },
  {
    id: uuidv4(),
    name: 'Decoración con Globos Dorados',
    description: 'Set completo de decoración con globos dorados y accesorios elegantes',
    price: 65.00,
    category: 'Decoraciones',
    image: 'https://images.unsplash.com/photo-1617201460038-6e5555a8a1f5',
    featured: true,
  },
  {
    id: uuidv4(),
    name: 'Centro de Mesa Floral',
    description: 'Elegante centro de mesa con flores naturales y velas',
    price: 45.00,
    category: 'Decoraciones',
    image: 'https://images.unsplash.com/photo-1673555363891-a514a04fb91f',
    featured: false,
  },
  {
    id: uuidv4(),
    name: 'Artesanía Personalizada',
    description: 'Creaciones artesanales hechas a mano según tus especificaciones',
    price: 40.00,
    category: 'Artesanías',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443',
    featured: false,
  },
  {
    id: uuidv4(),
    name: 'Pastel Matcha Especial',
    description: 'Exótico pastel de matcha con decoración minimalista',
    price: 70.00,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1761016324065-f28bd12961df',
    featured: false,
  },
  {
    id: uuidv4(),
    name: 'Pastel de Chocolate Artesanal',
    description: 'Rico pastel de chocolate con ganache y decoración elegante',
    price: 75.00,
    category: 'Pasteles',
    image: 'https://images.unsplash.com/photo-1737700088028-fae0666feb83',
    featured: false,
  },
  {
    id: uuidv4(),
    name: 'Donas Decoradas',
    description: 'Donas artesanales con glaseados de colores y decoraciones',
    price: 25.00,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1618411640026-24e40dcde1ab',
    featured: false,
  },
];

// Initialize products collection if empty
async function initializeProducts(db) {
  try {
    const collection = db.collection('products');
    const count = await collection.countDocuments();
    
    if (count === 0) {
      await collection.insertMany(sampleProducts);
      console.log('Sample products initialized');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    // Get products
    if (path === 'products' || request.url.includes('/api/products')) {
      await initializeProducts(db);
      const collection = db.collection('products');
      
      const featured = searchParams.get('featured');
      const category = searchParams.get('category');
      
      let query = {};
      if (featured === 'true') {
        query.featured = true;
      }
      if (category && category !== 'Todos') {
        query.category = category;
      }
      
      const products = await collection.find(query).toArray();
      
      return Response.json({ products });
    }

    // Get contact messages
    if (path === 'contact-messages' || request.url.includes('/api/contact-messages')) {
      const collection = db.collection('contact_messages');
      const messages = await collection.find({}).sort({ createdAt: -1 }).toArray();
      
      return Response.json({ messages });
    }

    return Response.json({ message: 'Creaciones Princess API' });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    // Handle contact form submission
    if (path === 'contact' || request.url.includes('/api/contact')) {
      const { name, email, phone, message } = body;
      
      if (!name || !email || !message) {
        return Response.json(
          { error: 'Nombre, email y mensaje son requeridos' },
          { status: 400 }
        );
      }

      const collection = db.collection('contact_messages');
      const contactMessage = {
        id: uuidv4(),
        name,
        email,
        phone: phone || '',
        message,
        createdAt: new Date(),
        read: false,
      };

      await collection.insertOne(contactMessage);
      
      return Response.json(
        { success: true, message: 'Mensaje enviado correctamente' },
        { status: 200 }
      );
    }

    // Create product
    if (path === 'products' || request.url.includes('/api/products')) {
      const { name, description, price, category, image, featured } = body;
      
      if (!name || !description || !price || !category) {
        return Response.json(
          { error: 'Todos los campos son requeridos' },
          { status: 400 }
        );
      }

      const collection = db.collection('products');
      const product = {
        id: uuidv4(),
        name,
        description,
        price: parseFloat(price),
        category,
        image: image || 'https://images.unsplash.com/photo-1581745071812-e69f8cf9e898',
        featured: featured || false,
        createdAt: new Date(),
      };

      await collection.insertOne(product);
      
      return Response.json(
        { success: true, product },
        { status: 201 }
      );
    }

    return Response.json(
      { error: 'Endpoint no encontrado' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';
    const id = searchParams.get('id');

    // Update product
    if ((path === 'products' || request.url.includes('/api/products')) && id) {
      const collection = db.collection('products');
      const { name, description, price, category, image, featured } = body;
      
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price) updateData.price = parseFloat(price);
      if (category) updateData.category = category;
      if (image) updateData.image = image;
      if (featured !== undefined) updateData.featured = featured;
      updateData.updatedAt = new Date();

      const result = await collection.updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return Response.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      return Response.json(
        { success: true, message: 'Producto actualizado' },
        { status: 200 }
      );
    }

    return Response.json(
      { error: 'Endpoint no encontrado' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';
    const id = searchParams.get('id');

    // Delete product
    if ((path === 'products' || request.url.includes('/api/products')) && id) {
      const collection = db.collection('products');
      const result = await collection.deleteOne({ id });

      if (result.deletedCount === 0) {
        return Response.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      return Response.json(
        { success: true, message: 'Producto eliminado' },
        { status: 200 }
      );
    }

    return Response.json(
      { error: 'Endpoint no encontrado' },
      { status: 404 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}