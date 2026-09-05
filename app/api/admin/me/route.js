import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  return Response.json({ admin: { email: session.email } });
}
