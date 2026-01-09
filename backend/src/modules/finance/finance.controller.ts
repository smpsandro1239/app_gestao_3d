import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { FinanceService } from './finance.service';

@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  findAll() {
    return this.financeService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.financeService.getSummary();
  }

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto) {
    return this.financeService.create(createFinanceDto);
  }
}
