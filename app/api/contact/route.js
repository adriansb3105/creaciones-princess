import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: 'Nombre, email y mensaje son requeridos' }, { status: 400 });
    }

    const contactMessage = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      message,
      createdAt: new Date(),
      read: false,
    };

    await db.collection('contact_messages').insertOne(contactMessage);

    return Response.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
