import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ReturnRequest } from './return-request.entity';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(ReturnRequest)
    private readonly repo: Repository<ReturnRequest>,
  ) {}

  async create(userId: number, dto: CreateReturnDto) {
    const entity = this.repo.create({
      userId,
      orderCode: dto.orderCode.trim(),
      reason: dto.reason.trim(),
      status: 'pending',
    });
    await this.repo.save(entity);
    return entity;
  }

  async findMine(userId: number) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /** Admin list + join thông tin cơ bản của user */
  private baseQB(): SelectQueryBuilder<ReturnRequest> {
    return this.repo.createQueryBuilder('r')
      .leftJoin('users', 'u', 'u.id = r.user_id')
      .select([
        'r.id AS id',
        'r.order_code AS orderCode',
        'r.reason AS reason',
        'r.status AS status',
        'r.created_at AS createdAt',
        'r.updated_at AS updatedAt',
        'u.id AS userId',
        'u.email AS userEmail',
        'u.full_name AS userFullName',
      ]);
  }

  async findAllWithUser() {
    const rows = await this.baseQB()
      .orderBy('r.created_at', 'DESC')
      .getRawMany();

    return rows.map((r) => ({
      id: Number(r.id),
      orderCode: r.orderCode,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: {
        id: Number(r.userId),
        email: r.userEmail,
        fullName: r.userFullName,
      },
    }));
  }

  async updateStatus(id: number, dto: UpdateReturnDto) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Return request not found');
    found.status = dto.status;
    await this.repo.save(found);
    return found;
  }
}
