/**
 * @author Rommel Loayza
 */
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant, ParticipantDocument } from '@smm/participants/schemas/participant.schema';
import { Model } from 'mongoose';
import { from, Observable, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { catchError, map, mergeMap, switchMap, toArray } from 'rxjs/operators';
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

  delete(id: string): Observable<Participant> {
    return from(
      this.participantModel.findOneAndRemove({ id: id }),
    );
  }

  findBy(field: string, value: string): Observable<Participant[]> {
    const search = {};
    search[field] = value;
    return from(
      this.participantModel.find(search).exec(),
    );
  }

  findByMany(query: any): Observable<Participant[]> {
    return from(
      this.participantModel.find().and(query).exec(),
    );
  }

  findActive(): Observable<Participant[]> {
    return from(this.participantModel.find()
      .where('active').equals(true)
      .exec(),
    );
  }

  logHistory(id: string, history: LogHistoryRequest): Observable<ParticipantHistory> {

    const rawDate = new Date(history.date);
    const year = rawDate.getFullYear();
    const month = rawDate.getMonth();

    this.logger.debug(`${year} -- ${month}`);

    return this.participantHistoryService.create({
      participantId: id,
      monthlyProgramId: history.monthlyProgramId,
      date: history.date,
      room: history.room,
      monthNumber: month,
      year: year,
      id: null,
    });
  }

  releaseParticipants(): Observable<number> {
    return from(this.participantModel.updateMany(
      { 'active': true }, { 'reserved': false }, { multi: true }),
    ).pipe(
      map(response => {
        return response.nModified;
      }),
      catchError(err => throwError(err)),
    );
  }

  findCandidates(gender: string): Observable<Participant[]> {
    const participantsObs = this.findByMany([{ 'gender': gender }, { 'active': true }, { 'reserved': false }]);

    const getParticipantsHistory = (id) => this.participantHistoryService.loadParticipantHistory(id);

    return participantsObs.pipe(
      switchMap(participants => {
        return from(participants).pipe(
          mergeMap(participant => {
            return getParticipantsHistory(participant.id).pipe(
              map(history => {
                if (!history || 0 === history.length) {
                  return participant;
                }

                return {
                  id: participant.id,
                  last: history[0].date,
                  history: participant.history,
                  name: participant.name,
                  age: participant.age,
                  gender: participant.gender,
                  active: participant.active,
                  reserved: participant.reserved,
                  skills: participant.skills
                };
              }),
            );
          }, 10),
          toArray(),
          map(participants => {
            return participants.sort((a, b) => {
              if(a.last > b.last) {
                return 1;
              }

              if(a.last < b.last) {
                return -1;
              }
              return 0;
            })
          })
        );
      }),
    );
  }

}
