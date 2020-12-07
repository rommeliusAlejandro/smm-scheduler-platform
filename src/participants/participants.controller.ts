/**
 * @author Rommel Loayza
 */
import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Participant } from '@smm/participants/schemas/participant.schema';
import { ParticipantsService } from '@smm/participants/participants.service';
import { CreateParticipantRequest, UpdateParticipantRequests } from '@smm/participants/participants.requests.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Participants Controller')
@Controller('participants')
export class ParticipantsController {

  @Inject()
  private readonly participantsService: ParticipantsService;

  @Get()
  getAll(): Observable<Participant[]> {
    return this.participantsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<Participant> {
    return this.participantsService.findOne(id);
  }

  @Get('findBy/:field/:value')
  findBy(@Param('field') field: string, @Param('value') value: string): Observable<Participant[]> {
    return this.participantsService.findBy(field, value);
  }

  @Post()
  create(@Body() participant: CreateParticipantRequest): Observable<Participant> {
    participant.active = true;
    return this.participantsService.create(participant);
  }

  @Put(':id')
  update(@Param('id') id: string,
         @Body() updatedParticipant: UpdateParticipantRequests): Observable<Participant> {
    return this.participantsService.update(id, updatedParticipant.attributes);
  }

}
