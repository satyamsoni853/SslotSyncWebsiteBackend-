import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll() {
    return this.adsService.findAll(false);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllForAdmin() {
    return this.adsService.findAll(true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAdDto) {
    return this.adsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdDto) {
    return this.adsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.remove(id);
  }
}
