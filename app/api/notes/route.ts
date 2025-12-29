import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();
  const note = await prisma.note.create({
    data: { title, content, userId: session.userId },
  });
  return NextResponse.json(note);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
  await prisma.note.delete({ 
    where: { id, userId: session.userId } 
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, title, content } = await request.json();
  const note = await prisma.note.update({
    where: { id, userId: session.userId },
    data: { title, content },
  });
  return NextResponse.json(note);
}
