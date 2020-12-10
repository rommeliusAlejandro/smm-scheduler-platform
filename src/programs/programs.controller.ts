/**
 * @author Rommel Loayza
 */
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Program } from '@smm/programs/schemas/program.schema';
import { ProgramsService } from '@smm/programs/programs.service';
import { NewProgramRequest } from '@smm/programs/programs.requests.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Programs Controller')
@Controller('programs')
export class ProgramsController {

  @Inject()
  private readonly programsService: ProgramsService;

  @Get()
  getAll(): Observable<Program[]> {
    return this.programsService.getAll();
  }

  @Get('/:field/:value')
  getByField(@Param('field') field: string,
             @Param('value') value: string): Observable<Program[]> {
    return this.programsService.getBy(field, value);
  }

  @Post()
  create(@Body() newProgram: NewProgramRequest): Observable<Program> {
    return this.programsService.create(newProgram);
  }
}
