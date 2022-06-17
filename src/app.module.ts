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
import { ProgramsModule } from '@smm/programs/programs.module';
import { MonthlyProgramsModule } from '@smm/monthly-programs/monthly-programs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppServiceConfig]
    }),
    MongooseModule.forRoot('mongodb://192.168.1.66/smmtool'),
    ScheduleModule,
    RegistryModule,
    ReportModule,
    ParticipantsModule,
    ProgramsModule,
    MonthlyProgramsModule
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigFactory],
  exports: [AppConfigFactory]
})
export class AppModule {}
