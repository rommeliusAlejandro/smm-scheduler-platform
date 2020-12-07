/**
 * @author Rommel Loayza
 */
import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScheduleRequestType } from '@smm/schedule/schedule.request.type';
import { Observable, of } from 'rxjs';
import { ScheduleResponseType } from '@smm/schedule/schedule.response.type';
import { ScheduleBuilderService } from '@smm/schedule/schedule.builder.service';
import { ReportBuilder } from '@smm/report/report.builder';
import { map } from 'rxjs/operators';

@ApiTags('Schedule module')
@Controller('schedule')
export class ScheduleController {

  @Inject()
  private readonly builder: ScheduleBuilderService;

  @Inject()
  private readonly reportBuilder: ReportBuilder;

  @Post('/create/:month')
  schedule(@Body() input: ScheduleRequestType, @Param('month') month: number): Observable<ScheduleResponseType> {

    return this.builder.createSchedule(input.programId, month).pipe(
      map(response => {
        this.reportBuilder.build(response, month);
        return response;
    }));
  }

}
