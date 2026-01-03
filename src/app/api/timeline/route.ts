import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const timelineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  date: z.string().min(1, 'Date is required'),
  photoId: z.string().optional(),
});

// GET all timeline entries
export async function GET() {
  try {
    const entries = await db.timelineEntry.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching timeline entries:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline entries' }, { status: 500 });
  }
}

// POST create a new timeline entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = timelineSchema.parse(body);

    const entry = await db.timelineEntry.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        date: new Date(validatedData.date),
        photoId: validatedData.photoId,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error creating timeline entry:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create timeline entry' }, { status: 500 });
  }
}
