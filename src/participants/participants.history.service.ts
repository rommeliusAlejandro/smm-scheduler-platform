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
import { Log } from '@smm/registry/registry.data.types';
import { ParticipantHistory, ParticipantHistoryDocument } from '@smm/participants/schemas/participant-history.schema';
import { AppLogger } from '@smm/framework/logger/app.logger';

@Injectable()
export class ParticipantsHistoryService {

  private readonly logger = AppLogger.getInstance(ParticipantsHistoryService.name);

  constructor(@InjectModel(ParticipantHistory.name) private readonly participantHistoryModel: Model<ParticipantHistoryDocument>) {
  }

  create(history: ParticipantHistory): Observable<ParticipantHistory> {
    history.id = uuidv4();
    const newHistory = new this.participantHistoryModel(history);

    return from(newHistory.save());
  }

  findAll(): Observable<ParticipantHistory[]> {
    return from(this.participantHistoryModel.find().exec());
  }

  findOne(id: string): Observable<ParticipantHistory> {
    return from(this.participantHistoryModel.findOne({ id: id }));
  }

  loadParticipantHistory(participantId: string): Observable<ParticipantHistory[]> {
    this.logger.debug(participantId);
    return from(this.participantHistoryModel.find()
      .where('participantId').equals(participantId)
      .exec()
    );
  }
}
