import { Module } from '@nestjs/common';
import { ContentCardsService } from './content-cards.service';
import { ContentCardsController } from './content-cards.controller';

@Module({
  providers: [ContentCardsService],
  controllers: [ContentCardsController],
})
export class ContentCardsModule {}
