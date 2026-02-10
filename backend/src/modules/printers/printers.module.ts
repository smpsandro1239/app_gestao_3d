import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from '../../entities/printer.entity';
import { PrintersController } from './printers.controller';
import { PrintersService } from './printers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Printer])],
  controllers: [PrintersController],
  providers: [PrintersService],
  exports: [PrintersService],
})
export class PrintersModule {}
