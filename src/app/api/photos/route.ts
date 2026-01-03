import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET all photos
export async function GET() {
  try {
    const photos = await db.photo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

// POST upload photos
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedPhotos = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const extension = path.extname(file.name);
      const filename = `${uuidv4()}${extension}`;

      // Save to public folder
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, filename);

      // Create uploads directory if it doesn't exist
      await writeFile(filePath, buffer);

      // Save to database
      const photo = await db.photo.create({
        data: {
          filename,
          url: `/uploads/${filename}`,
        },
      });

      uploadedPhotos.push(photo);
    }

    return NextResponse.json(uploadedPhotos);
  } catch (error) {
    console.error('Error uploading photos:', error);
    return NextResponse.json({ error: 'Failed to upload photos' }, { status: 500 });
  }
}
