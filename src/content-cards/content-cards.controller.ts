import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentCardsService } from './content-cards.service';
import { CreateContentCardDto } from './dto/create-content-card.dto';
import { UpdateContentCardDto } from './dto/update-content-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('content-cards')
export class ContentCardsController {
  constructor(private readonly contentCardsService: ContentCardsService) {}

  @Get()
  findAll(@Query('section') section?: string) {
    return this.contentCardsService.findAll(false, section);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllForAdmin(@Query('section') section?: string) {
    return this.contentCardsService.findAll(true, section);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentCardsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateContentCardDto) {
    return this.contentCardsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentCardDto) {
    return this.contentCardsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentCardsService.remove(id);
  }
}
