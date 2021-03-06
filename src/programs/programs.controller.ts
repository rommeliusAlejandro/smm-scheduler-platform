/**
 * @author Rommel Loayza
 */
import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Program } from '@smm/programs/schemas/program.schema';
import { ProgramsService } from '@smm/programs/programs.service';
import { NewProgramRequest, UpdateProgramRequest } from '@smm/programs/programs.requests.types';
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

  @Get('/:id')
  findById(@Param('id') id: string): Observable<Program> {
    return this.programsService.findById(id);
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

  @Put('/:id')
  update(@Param('id') id: string,
    @Body() program: UpdateProgramRequest): Observable<Program> {
    return this.programsService.update(id, program.attributes);
  }
}
