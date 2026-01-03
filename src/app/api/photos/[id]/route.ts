import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

// DELETE a photo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get photo info
    const photo = await db.photo.findUnique({
      where: { id: params.id },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete file from public folder
    const filePath = path.join(process.cwd(), 'public', photo.url);
    await unlink(filePath).catch(() => {
      console.log('File not found, skipping deletion');
    });

    // Delete from database
    await db.photo.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
