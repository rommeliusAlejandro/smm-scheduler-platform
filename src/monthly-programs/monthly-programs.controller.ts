/**
 * @author Rommel Loayza
 */
import { Body, Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MonthlyProgram } from '@smm/monthly-programs/schemas/monthly-program.schema';
import { MonthlyProgramsService } from '@smm/monthly-programs/monthly-programs.service';
import { UpdateMonthlyProgramRequest } from '@smm/monthly-programs/monthly-programs.requests.types';
import { ApiTags } from '@nestjs/swagger';
import { ProgramStatusEnum } from '@smm/monthly-programs/enums/program-status.enum';

@ApiTags('Monthly Program Controller')
@Controller('monthlyProgram')
export class MonthlyProgramsController {

  @Inject()
  private readonly monthlyProgramService: MonthlyProgramsService;

  @Get()
  getAll(): Observable<MonthlyProgram[]> {
    return this.monthlyProgramService.findAll();
  }

  @Get('/:id')
  findById(@Param('id') id: string): Observable<MonthlyProgram> {
    return this.monthlyProgramService.findOne(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() body: UpdateMonthlyProgramRequest) {
    return this.monthlyProgramService.update(id, body);
  }

  @Put('/:id/approve')
  approve(@Param('id') id: string): Observable<MonthlyProgram> {
    return this.monthlyProgramService.update(id, { status: ProgramStatusEnum.APPROVED.valueOf()});
  }

}
