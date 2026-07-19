import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { CareersService } from './careers.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get('jobs')
  findAllJobs(@Query('all') all?: string) {
    return this.careersService.findAllJobs(all === 'true');
  }

  @Get('jobs/:id')
  findJob(@Param('id') id: string) {
    return this.careersService.findJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jobs')
  createJob(@Body() dto: CreateJobDto) {
    return this.careersService.createJob(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('jobs/:id')
  updateJob(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.careersService.updateJob(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('jobs/:id')
  removeJob(@Param('id') id: string) {
    return this.careersService.removeJob(id);
  }

  @Post('applications')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads/resumes',
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  createApplication(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() resume?: Express.Multer.File,
  ) {
    const resumeUrl = resume ? `/uploads/resumes/${resume.filename}` : undefined;
    return this.careersService.createApplication(dto, resumeUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('applications')
  findAllApplications() {
    return this.careersService.findAllApplications();
  }
}
