/**
 * @author Rommel Loayza
 */
import { Module } from '@nestjs/common';
import { ReportBuilder } from '@smm/report/report.builder';
import { ReportController } from '@smm/report/report.controller';

@Module({
  controllers: [ReportController],
  providers: [ReportBuilder],
  exports: [ReportBuilder]
})
export class ReportModule {

}
