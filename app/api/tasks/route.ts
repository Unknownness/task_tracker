import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { boardId, title, description, priority } = await request.json();
  const task = await prisma.task.create({
    data: {
      boardId,
      title,
      description,
      priority,
      column: 'todo',
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id, ...data } = await request.json();
  const task = await prisma.task.update({
    where: { id },
    data,
  });
  return NextResponse.json(task);
}
