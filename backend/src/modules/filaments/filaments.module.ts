import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filament } from '../../entities/filament.entity';
import { FilamentsController } from './filaments.controller';
import { FilamentsService } from './filaments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Filament])],
  controllers: [FilamentsController],
  providers: [FilamentsService],
  exports: [FilamentsService],
})
export class FilamentsModule {}
