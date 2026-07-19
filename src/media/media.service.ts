import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { cloudinary } from './cloudinary.provider';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadToCloudinary(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'sslotsync', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async create(file: Express.Multer.File, alt?: string) {
    const { url, publicId } = await this.uploadToCloudinary(file);
    return this.prisma.media.create({
      data: {
        filename: file.originalname,
        url,
        publicId,
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
    if (media.publicId) {
      try {
        await cloudinary.uploader.destroy(media.publicId);
      } catch {
        // already removed from Cloudinary; ignore
      }
    }
    return media;
  }
}
