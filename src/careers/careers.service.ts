import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  createJob(dto: CreateJobDto) {
    return this.prisma.jobPosting.create({ data: dto });
  }

  findAllJobs(includeInactive = false) {
    return this.prisma.jobPosting.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findJob(id: string) {
    const job = await this.prisma.jobPosting.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job posting not found');
    return job;
  }

  async updateJob(id: string, dto: UpdateJobDto) {
    await this.findJob(id);
    return this.prisma.jobPosting.update({ where: { id }, data: dto });
  }

  async removeJob(id: string) {
    await this.findJob(id);
    return this.prisma.jobPosting.delete({ where: { id } });
  }

  async createApplication(dto: CreateApplicationDto, resumeUrl?: string) {
    await this.findJob(dto.jobId);
    return this.prisma.careerApplication.create({
      data: { ...dto, resumeUrl },
    });
  }

  findAllApplications() {
    return this.prisma.careerApplication.findMany({
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
