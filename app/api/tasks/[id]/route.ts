import { db } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (body.completed !== undefined) {
    const completedAt = body.completed ? new Date().toISOString() : null;
    await db.execute({
      sql: 'UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?',
      args: [body.completed ? 1 : 0, completedAt, id]
    });
  }

  if (body.title !== undefined || body.due_date !== undefined) {
    const updates: string[] = [];
    const args: (string | number | null)[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      args.push(body.title);
    }
    if (body.due_date !== undefined) {
      updates.push('due_date = ?');
      args.push(body.due_date);
    }

    if (updates.length > 0) {
      args.push(id);
      await db.execute({
        sql: `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
        args
      });
    }
  }

  const { rows } = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [id] });
  return Response.json(rows[0] ?? null);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [id] });
  return Response.json({ ok: true });
}
