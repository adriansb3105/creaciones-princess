import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { getNextOrderNumber } from '@/lib/orderNumber';
import { DEPOSIT_PERCENTAGE } from '@/lib/constants';

export async function GET(request) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = {};
    if (status && status !== 'todos') {
      query.status = status;
    }

    const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
    return Response.json({ orders });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { customer, delivery, items } = body;

    if (!customer?.name || !customer?.phone) {
      return Response.json({ error: 'Nombre y teléfono son requeridos' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    if (!delivery?.method) {
      return Response.json({ error: 'El método de entrega es requerido' }, { status: 400 });
    }

    // Precios recalculados desde la base de datos — nunca se confía en el precio del cliente.
    const orderItems = [];
    for (const item of items) {
      const product = await db.collection('products').findOne({ id: item.productId, active: true });
      if (!product) continue;

      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      orderItems.push({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || null,
        unitPrice: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    if (orderItems.length === 0) {
      return Response.json({ error: 'Los productos del carrito ya no están disponibles' }, { status: 400 });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal;
    const depositAmount = Math.round(total * DEPOSIT_PERCENTAGE);

    const orderNumber = await getNextOrderNumber(db);
    const now = new Date();

    const order = {
      id: uuidv4(),
      orderNumber,
      status: 'pending_payment',
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
      },
      delivery: {
        method: delivery.method,
        address: delivery.address || '',
        notes: delivery.notes || '',
        requestedDate: delivery.requestedDate || null,
      },
      items: orderItems,
      subtotal,
      total,
      depositPercentage: DEPOSIT_PERCENTAGE,
      depositAmount,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('orders').insertOne(order);

    return Response.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
