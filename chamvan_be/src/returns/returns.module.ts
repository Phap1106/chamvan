import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';
import { ReturnRequest } from './return-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReturnRequest])],
  controllers: [ReturnsController],
  providers: [ReturnsService],
})
export class ReturnsModule {}
