/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParticipantDocument, Participant } from '@smm/participants/schemas/participant.schema';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { map, switchMap } from 'rxjs/operators';
import { ParticipantHistory } from '@smm/participants/schemas/participant-history.schema';
import { LogHistoryRequest } from '@smm/participants/participants.requests.types';
import { ParticipantsHistoryService } from '@smm/participants/participants.history.service';
import { AppLogger } from '@smm/framework/logger/app.logger';

@Injectable()
export class ParticipantsService {

  @Inject()
  private readonly participantHistoryService: ParticipantsHistoryService;

  private readonly logger = AppLogger.getInstance(ParticipantsService.name);

  constructor(@InjectModel(Participant.name) private readonly participantModel: Model<ParticipantDocument>) {
  }

  create(participant: any): Observable<Participant> {
    participant['id'] = uuidv4();
    const newParticipant = new this.participantModel(participant);

    return from(newParticipant.save());
  }

  findAll(): Observable<Participant[]> {
    return from(this.participantModel.find().exec());
  }

  findOne(id: string): Observable<Participant> {
    return from(this.participantModel.findOne({ id: id }));
  }

  update(id: string, attributes: any): Observable<Participant> {
    return from(
      this.participantModel.findOneAndUpdate({ id: id }, attributes, { new: true }),
    );
  }

  findBy(field: string, value: string): Observable<Participant[]> {
    let search = {};
    search[field] = value;
    return from(
      this.participantModel.find(search).exec(),
    );
  }

  findActive(): Observable<Participant[]> {
    return from(this.participantModel.find()
      .where('active').equals(true)
      .exec()
    );
  }

  logHistory(id: string, history: LogHistoryRequest): Observable<ParticipantHistory> {

    const rawDate = new Date(history.date);
    const year = rawDate.getFullYear();
    const month = rawDate.getMonth();

    this.logger.debug(`${year} -- ${month}`);

    return  this.participantHistoryService.create({
      participantId: id,
      monthlyProgramId: history.monthlyProgramId,
      date: history.date,
      room: history.room,
      task: history.task,
      monthNumber: month,
      year: year,
      id: null
    });
  }

}
