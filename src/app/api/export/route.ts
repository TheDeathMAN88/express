import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET export all data
export async function GET() {
  try {
    const timelineEntries = await db.timelineEntry.findMany({
      orderBy: { date: 'desc' },
    });

    const envelopes = await db.envelope.findMany({
      orderBy: { order: 'asc' },
    });

    const photos = await db.photo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      timelineEntries,
      envelopes,
      photos,
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
