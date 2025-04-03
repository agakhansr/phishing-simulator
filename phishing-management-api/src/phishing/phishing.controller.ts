import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('phishing')
@UseGuards(JwtAuthGuard)
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Get()
  async findAll() {
    return this.phishingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.phishingService.findOne(id);
  }
}
