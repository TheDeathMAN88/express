import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const envelopeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  extraMessage: z.string().optional(),
  order: z.number().optional(),
});

// GET all envelopes
export async function GET() {
  try {
    const envelopes = await db.envelope.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(envelopes);
  } catch (error) {
    console.error('Error fetching envelopes:', error);
    return NextResponse.json({ error: 'Failed to fetch envelopes' }, { status: 500 });
  }
}

// POST create a new envelope
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = envelopeSchema.parse(body);

    const envelope = await db.envelope.create({
      data: {
        title: validatedData.title,
        message: validatedData.message,
        extraMessage: validatedData.extraMessage,
        order: validatedData.order || 0,
      },
    });

    return NextResponse.json(envelope);
  } catch (error) {
    console.error('Error creating envelope:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create envelope' }, { status: 500 });
  }
}
