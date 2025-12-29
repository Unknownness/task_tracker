import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const { title, content } = await request.json();
  const note = await prisma.note.create({
    data: { title, content },
  });
  return NextResponse.json(note);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id, title, content } = await request.json();
  const note = await prisma.note.update({
    where: { id },
    data: { title, content },
  });
  return NextResponse.json(note);
}
