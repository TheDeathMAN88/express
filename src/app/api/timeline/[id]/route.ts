import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const timelineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  date: z.string().min(1, 'Date is required'),
  photoId: z.string().optional(),
});

// PUT update a timeline entry
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = timelineSchema.parse(body);

    const entry = await db.timelineEntry.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        date: new Date(validatedData.date),
        photoId: validatedData.photoId,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error updating timeline entry:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update timeline entry' }, { status: 500 });
  }
}

// DELETE a timeline entry
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.timelineEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timeline entry:', error);
    return NextResponse.json({ error: 'Failed to delete timeline entry' }, { status: 500 });
  }
}
