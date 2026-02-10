import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FilamentsService } from './filaments.service';

@Controller('filaments')
export class FilamentsController {
  constructor(private readonly filamentsService: FilamentsService) {}

  @Post()
  create(@Body() data: any) {
    return this.filamentsService.create(data);
  }

  @Get()
  findAll() {
    return this.filamentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filamentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.filamentsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filamentsService.remove(+id);
  }
}
