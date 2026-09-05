import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth';
import { VALID_STATUSES } from '@/lib/orderStatus';

// Lectura pública por id (uuid no adivinable) — la usa la página de confirmación
// del pedido justo después del checkout, sin requerir sesión de admin.
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const order = await db.collection('orders').findOne({ id });

    if (!order) {
      return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return Response.json({ order });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await requireAdmin(request);
    if (!session) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const result = await db
      .collection('orders')
      .updateOne({ id }, { $set: { status, updatedAt: new Date() } });

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/orders/[id] error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
