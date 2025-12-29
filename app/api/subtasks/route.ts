import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  
  if (!taskId) {
    return NextResponse.json({ error: 'taskId required' }, { status: 400 });
  }

  const subtasks = await prisma.subtask.findMany({
    where: { 
      taskId,
      task: { userId: session.userId }
    },
    orderBy: { createdAt: 'asc' },
  });
  
  return NextResponse.json(subtasks);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { taskId, title } = await request.json();
  
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: session.userId }
  });
  
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const subtask = await prisma.subtask.create({
    data: { taskId, title },
  });
  
  return NextResponse.json(subtask);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, completed } = await request.json();
  
  const existing = await prisma.subtask.findFirst({
    where: { 
      id,
      task: { userId: session.userId }
    }
  });
  
  if (!existing) {
    return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
  }

  const subtask = await prisma.subtask.update({
    where: { id },
    data: { title, completed },
  });
  
  return NextResponse.json(subtask);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const existing = await prisma.subtask.findFirst({
    where: { 
      id,
      task: { userId: session.userId }
    }
  });
  
  if (!existing) {
    return NextResponse.json({ error: 'Subtask not found' }, { status: 404 });
  }

  await prisma.subtask.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
