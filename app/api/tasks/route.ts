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
    include: { subtasks: true },
    orderBy: { createdAt: 'desc' },
  });
  
  const tasksWithChecklist = tasks.map(task => ({
    ...task,
    checklist: JSON.parse(task.checklist || '[]')
  }));
  
  return NextResponse.json(tasksWithChecklist);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { boardId, title, description, priority, checklist } = await request.json();
  const task = await prisma.task.create({
    data: {
      boardId,
      title,
      description,
      priority,
      column: 'todo',
      checklist: JSON.stringify(checklist || []),
      userId: session.userId,
    },
    include: { subtasks: true },
  });
  
  return NextResponse.json({
    ...task,
    checklist: JSON.parse(task.checklist)
  });
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

  const { id, checklist, ...data } = await request.json();
  const updateData: any = { ...data };
  
  if (checklist !== undefined) {
    updateData.checklist = JSON.stringify(checklist);
  }
  
  const task = await prisma.task.update({
    where: { id, userId: session.userId },
    data: updateData,
    include: { subtasks: true },
  });
  
  return NextResponse.json({
    ...task,
    checklist: JSON.parse(task.checklist)
  });
}
