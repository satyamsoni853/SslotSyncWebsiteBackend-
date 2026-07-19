import { Injectable, NotFoundException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  create(file: Express.Multer.File, alt?: string) {
    return this.prisma.media.create({
      data: {
        filename: file.filename,
        url: `/uploads/media/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size,
        alt,
      },
    });
  }

  findAll() {
    return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async remove(id: string) {
    const media = await this.findOne(id);
    await this.prisma.media.delete({ where: { id } });
    try {
      await unlink(join(process.cwd(), 'uploads', 'media', media.filename));
    } catch {
      // file already missing from disk; ignore
    }
    return media;
  }
}
