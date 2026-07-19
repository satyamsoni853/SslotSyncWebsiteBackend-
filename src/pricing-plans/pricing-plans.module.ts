import { Module } from '@nestjs/common';
import { PricingPlansService } from './pricing-plans.service';
import { PricingPlansController } from './pricing-plans.controller';

@Module({
  providers: [PricingPlansService],
  controllers: [PricingPlansController],
})
export class PricingPlansModule {}
