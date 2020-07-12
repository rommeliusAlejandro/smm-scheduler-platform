/**
 * @author Rommel Loayza
 */
import { Module } from '@nestjs/common';
import { ScheduleController } from '@smm/schedule/schedule.controller';
import { RegistryModule } from '@smm/registry/registry.module';
import { ScheduleBuilderService } from '@smm/schedule/schedule.builder.service';
import { ReportModule } from '@smm/report/report.module';

@Module({
  providers:[ScheduleBuilderService],
  controllers: [ScheduleController],
  imports: [RegistryModule, ReportModule]
})
export class ScheduleModule {

}
