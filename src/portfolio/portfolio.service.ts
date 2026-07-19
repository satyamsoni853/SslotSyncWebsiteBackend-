import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePortfolioDto) {
    return this.prisma.portfolioItem.create({ data: dto });
  }

  findAll(includeInactive = false) {
    return this.prisma.portfolioItem.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.portfolioItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Portfolio item not found');
    return item;
  }

  async update(id: string, dto: UpdatePortfolioDto) {
    await this.findOne(id);
    return this.prisma.portfolioItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.portfolioItem.delete({ where: { id } });
  }
}
