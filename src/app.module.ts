import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import AppServiceConfig from '@smm/config/app.config';
import { ScheduleModule } from '@smm/schedule/schedule.module';
import { AppConfigFactory } from '@smm/app.config.factory';
import { RegistryModule } from '@smm/registry/registry.module';
import { ReportModule } from '@smm/report/report.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantsModule } from '@smm/participants/participants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppServiceConfig]
    }),
    MongooseModule.forRoot('mongodb://localhost/smmtool'),
    ScheduleModule,
    RegistryModule,
    ReportModule,
    ParticipantsModule
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigFactory],
  exports: [AppConfigFactory]
})
export class AppModule {}
