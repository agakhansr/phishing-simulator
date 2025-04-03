import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('phishing')
@UseGuards(JwtAuthGuard)
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post()
  async create(
    @Body() createPhishingDto: CreatePhishingDto,
    @CurrentUser() user: User,
  ) {
    return this.phishingService.create(createPhishingDto, user);
  }

  @Get()
  async findAll() {
    return this.phishingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.phishingService.findOne(id);
  }

  @Post(':id/send')
  async sendPhishingEmail(@Param('id') id: string) {
    return this.phishingService.sendPhishingEmail(id);
  }
}
