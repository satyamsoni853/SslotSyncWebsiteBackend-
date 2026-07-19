import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBlogDto) {
    return this.prisma.blogPost.create({
      data: { ...dto, publishedAt: dto.isPublished ? new Date() : null },
    });
  }

  findAll(includeUnpublished = false) {
    return this.prisma.blogPost.findMany({
      where: includeUnpublished ? undefined : { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async update(id: string, dto: UpdateBlogDto) {
    const existing = await this.findOne(id);
    const publishedAt =
      dto.isPublished && !existing.isPublished ? new Date() : existing.publishedAt;
    return this.prisma.blogPost.update({ where: { id }, data: { ...dto, publishedAt } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
