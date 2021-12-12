/**
 * @author Rommel Loayza
 */
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Participant } from '@smm/participants/schemas/participant.schema';
import { ParticipantsService } from '@smm/participants/participants.service';
import {
  CreateParticipantRequest,
  LogHistoryRequest,
  UpdateParticipantRequests,
} from '@smm/participants/participants.requests.types';
import { ApiTags } from '@nestjs/swagger';
import { ParticipantHistory } from '@smm/participants/schemas/participant-history.schema';
import { ParticipantsHistoryService } from '@smm/participants/participants.history.service';

@ApiTags('Participants Controller')
@Controller('participants')
export class ParticipantsController {

  @Inject()
  private readonly participantsService: ParticipantsService;

  @Inject()
  private readonly participantsHistoryService: ParticipantsHistoryService;

  @Get()
  getAll(): Observable<Participant[]> {
    return this.participantsService.findAll();
  }

  @Get('candidates')
  getCandidates(
    @Query('gender') gender: string,
  ): Observable<Participant[]> {
    return this.participantsService.findCandidates(gender);
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

  @Post('/release')
  release(): Observable<number> {
    return this.participantsService.releaseParticipants();
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<Participant> {
    return this.participantsService.delete(id);
  }

  @Put(':id/reserve')
  reserve(@Param('id') id: string): Observable<Participant> {
    return this.participantsService.update(id, { 'reserved': true });
  }

  @Post(':id/logHistory')
  logHistory(@Param('id') id: string,
             @Body() history: LogHistoryRequest): Observable<ParticipantHistory> {
    return this.participantsService.logHistory(id, history);
  }

  @Get(':id/history')
  loadHistory(@Param('id') id: string): Observable<ParticipantHistory[]> {
    return this.participantsHistoryService.loadParticipantHistory(id);
  }

  @Post('/refreshHistory')
  refreshHistory(): Observable<ParticipantHistory[]> {
    return this.participantsHistoryService.refreshHistory();
  }

}
