import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { BugReport } from './bug-report.entity';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { ListReportsDto } from './dto/list-reports.dto';
import { UpdateReportStatusDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(BugReport)
    private readonly bugRepo: Repository<BugReport>,
  ) {}

  async create(dto: CreateBugReportDto, extra: {
    userId?: number | null;
    userEmail?: string | null;
    userAgent?: string | null;
  }) {
    const entity = this.bugRepo.create({
      title: dto.title.trim(),
      description: dto.description,
      pageUrl: dto.pageUrl ?? null,
      status: 'open',
      userAgent: extra.userAgent ?? null,
      userId: extra.userId ?? null,
      userEmail: extra.userEmail ?? null,
    });
    const saved = await this.bugRepo.save(entity);
    return { success: true, id: saved.id };
  }

  async list(query: ListReportsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: FindOptionsWhere<BugReport> = {};
    if (query.status) where.status = query.status;

    const [items, total] = await this.bugRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async get(id: number) {
    const item = await this.bugRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Report not found');
    return item;
  }

  async updateStatus(id: number, body: UpdateReportStatusDto) {
    const item = await this.get(id);
    item.status = body.status;
    await this.bugRepo.save(item);
    return { success: true };
  }

  async remove(id: number) {
    const item = await this.get(id);
    await this.bugRepo.remove(item);
    return { success: true };
  }
}
