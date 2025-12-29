import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const boards = await prisma.board.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description } = await request.json();
  const board = await prisma.board.create({
    data: { name, description, userId: session.userId },
  });
  return NextResponse.json(board);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  await prisma.board.delete({ 
    where: { id, userId: session.userId } 
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, description } = await request.json();
  const board = await prisma.board.update({
    where: { id, userId: session.userId },
    data: { name, description },
  });
  return NextResponse.json(board);
}
