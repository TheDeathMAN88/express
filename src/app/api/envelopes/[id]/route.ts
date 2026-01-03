import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DELETE an envelope
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.envelope.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting envelope:', error);
    return NextResponse.json({ error: 'Failed to delete envelope' }, { status: 500 });
  }
}
