import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentCardDto } from './dto/create-content-card.dto';
import { UpdateContentCardDto } from './dto/update-content-card.dto';

@Injectable()
export class ContentCardsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContentCardDto) {
    return this.prisma.contentCard.create({ data: dto });
  }

  findAll(includeInactive = false, section?: string) {
    return this.prisma.contentCard.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(section ? { section } : {}),
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.contentCard.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Content card not found');
    return item;
  }

  async update(id: string, dto: UpdateContentCardDto) {
    await this.findOne(id);
    return this.prisma.contentCard.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contentCard.delete({ where: { id } });
  }
}
