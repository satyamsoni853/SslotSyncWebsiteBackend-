import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto';
import { UpdateGalleryImageDto } from './dto/update-gallery-image.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateGalleryImageDto) {
    return this.prisma.galleryImage.create({ data: dto });
  }

  findAll(includeInactive = false, category?: string) {
    return this.prisma.galleryImage.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(category ? { category } : {}),
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.galleryImage.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Gallery image not found');
    return item;
  }

  async update(id: string, dto: UpdateGalleryImageDto) {
    await this.findOne(id);
    return this.prisma.galleryImage.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.galleryImage.delete({ where: { id } });
  }
}
