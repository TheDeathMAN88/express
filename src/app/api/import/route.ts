import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const importSchema = z.object({
  version: z.string(),
  exportedAt: z.string(),
  timelineEntries: z.array(z.any()).optional(),
  envelopes: z.array(z.any()).optional(),
  photos: z.array(z.any()).optional(),
});

// POST import data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = importSchema.parse(body);

    // Import timeline entries
    if (validatedData.timelineEntries && Array.isArray(validatedData.timelineEntries)) {
      for (const entry of validatedData.timelineEntries) {
        try {
          await db.timelineEntry.upsert({
            where: { id: entry.id },
            update: {
              title: entry.title,
              content: entry.content,
              date: new Date(entry.date),
              photoId: entry.photoId,
            },
            create: {
              id: entry.id,
              title: entry.title,
              content: entry.content,
              date: new Date(entry.date),
              photoId: entry.photoId,
            },
          });
        } catch (error) {
          console.error('Error importing timeline entry:', error);
        }
      }
    }

    // Import envelopes
    if (validatedData.envelopes && Array.isArray(validatedData.envelopes)) {
      for (const envelope of validatedData.envelopes) {
        try {
          await db.envelope.upsert({
            where: { id: envelope.id },
            update: {
              title: envelope.title,
              message: envelope.message,
              extraMessage: envelope.extraMessage,
              order: envelope.order,
            },
            create: {
              id: envelope.id,
              title: envelope.title,
              message: envelope.message,
              extraMessage: envelope.extraMessage,
              order: envelope.order,
            },
          });
        } catch (error) {
          console.error('Error importing envelope:', error);
        }
      }
    }

    // Import photos (metadata only, not files)
    if (validatedData.photos && Array.isArray(validatedData.photos)) {
      for (const photo of validatedData.photos) {
        try {
          await db.photo.upsert({
            where: { id: photo.id },
            update: {
              filename: photo.filename,
              url: photo.url,
            },
            create: {
              id: photo.id,
              filename: photo.filename,
              url: photo.url,
            },
          });
        } catch (error) {
          console.error('Error importing photo:', error);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error importing data:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
}
