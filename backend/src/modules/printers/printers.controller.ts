import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrintersService } from './printers.service';

@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post()
  create(@Body() data: any) {
    return this.printersService.create(data);
  }

  @Get()
  findAll() {
    return this.printersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.printersService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printersService.remove(+id);
  }
}
