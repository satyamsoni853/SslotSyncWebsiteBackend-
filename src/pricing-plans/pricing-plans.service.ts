import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';

@Injectable()
export class PricingPlansService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePricingPlanDto) {
    return this.prisma.pricingPlan.create({ data: dto });
  }

  findAll(includeInactive = false) {
    return this.prisma.pricingPlan.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Pricing plan not found');
    return item;
  }

  async update(id: string, dto: UpdatePricingPlanDto) {
    await this.findOne(id);
    return this.prisma.pricingPlan.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pricingPlan.delete({ where: { id } });
  }
}
