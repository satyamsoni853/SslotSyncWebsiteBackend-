import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PricingPlansService } from './pricing-plans.service';
import { CreatePricingPlanDto } from './dto/create-pricing-plan.dto';
import { UpdatePricingPlanDto } from './dto/update-pricing-plan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pricing-plans')
export class PricingPlansController {
  constructor(private readonly pricingPlansService: PricingPlansService) {}

  @Get()
  findAll() {
    return this.pricingPlansService.findAll(false);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllForAdmin() {
    return this.pricingPlansService.findAll(true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricingPlansService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePricingPlanDto) {
    return this.pricingPlansService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePricingPlanDto) {
    return this.pricingPlansService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricingPlansService.remove(id);
  }
}
