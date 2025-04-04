import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingController } from './phishing.controller';
import { PhishingService } from './phishing.service';
import { EmailService } from './email.service';
import {
  PhishingAttempt,
  PhishingAttemptSchema,
} from './schemas/phishing-attempt.schema';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from '../shared/gateways/events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingAttempt.name, schema: PhishingAttemptSchema },
    ]),
    ConfigModule,
  ],
  controllers: [PhishingController],
  providers: [PhishingService, EmailService, EventsGateway],
})
export class PhishingModule {}
