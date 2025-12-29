import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(boards);
}

export async function POST(request: Request) {
  const { name, description } = await request.json();
  const board = await prisma.board.create({
    data: { name, description },
  });
  return NextResponse.json(board);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  await prisma.board.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id, name, description } = await request.json();
  const board = await prisma.board.update({
    where: { id },
    data: { name, description },
  });
  return NextResponse.json(board);
}
