/**
 * @author Rommel Loayza
 */
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ScheduleResponseType } from '@smm/schedule/schedule.response.type';
import { Observable, of } from 'rxjs';
import { ReportBuilder } from '@smm/report/report.builder';

@Controller('report')
export class ReportController {

  @Inject()
  private readonly reportBuilder: ReportBuilder;

  @Post('create/:month')
  createReport(@Body() input: ScheduleResponseType, @Param('month') month: number): Observable<boolean> {
    this.reportBuilder.build(input, month);

    return of(true);
  }
}
