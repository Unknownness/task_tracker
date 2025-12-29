import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { boardId, title, description, priority } = await request.json();
  const task = await prisma.task.create({
    data: {
      boardId,
      title,
      description,
      priority,
      column: 'todo',
      userId: session.userId,
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  await prisma.task.delete({ 
    where: { id, userId: session.userId } 
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, ...data } = await request.json();
  const task = await prisma.task.update({
    where: { id, userId: session.userId },
    data,
  });
  return NextResponse.json(task);
}
