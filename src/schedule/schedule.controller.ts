/**
 * @author Rommel Loayza
 */
import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScheduleRequestType } from '@smm/schedule/schedule.request.type';
import { Observable, of, throwError } from 'rxjs';
import { ScheduleResponseType } from '@smm/schedule/schedule.response.type';
import { ScheduleBuilderService } from '@smm/schedule/schedule.builder.service';
import { ReportBuilder } from '@smm/report/report.builder';
import { catchError, map } from 'rxjs/operators';
import { MonthlyProgramsService } from '@smm/monthly-programs/monthly-programs.service';

@ApiTags('Schedule module')
@Controller('schedule')
export class ScheduleController {

  @Inject()
  private readonly builder: ScheduleBuilderService;

  @Inject()
  private readonly reportBuilder: ReportBuilder;

  @Inject()
  private readonly monthlyProgramService: MonthlyProgramsService;

  @Post('/create/:month')
  schedule(@Body() input: ScheduleRequestType, @Param('month') month: number): Observable<ScheduleResponseType> {

    return this.builder.createSchedule(input.programId, month).pipe(
      /*map(response => {
        //this.reportBuilder.build(response, month);
        return response;
      }),*/
      map(response => {
        this.monthlyProgramService.create(response);
        return response;
      }),
      catchError(err => throwError(err)));
  }

  @Post('/approve/:month')
  approve(@Body() input: ScheduleResponseType, @Param('month') month: number): Observable<ScheduleResponseType> {

    this.reportBuilder.build(input, month);
    return of(input);
  }

}
