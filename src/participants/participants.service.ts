/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParticipantDocument, Participant } from '@smm/participants/schemas/participant.schema';
import { Model } from 'mongoose';
import { from, merge, Observable, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { catchError, map, mergeAll, mergeMap, switchMap } from 'rxjs/operators';
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
      this.participantModel.findOneAndRemove( { id: id})
    );
  }

  findBy(field: string, value: string): Observable<Participant[]> {
    let search = {};
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
      monthNumber: month,
      year: year,
      id: null
    });
  }

  releaseParticipants(): Observable<number> {
    return from(this.participantModel.updateMany(
      { 'active': true}, { 'reserved': false}, {multi: true})
      ).pipe(
      map(response => {
        return response.nModified;
      }),
      catchError(err => throwError(err))
    )
  }

  findCandidates(gender: string, year: number, month: number): Observable<Participant[]> {
    const participantsObs = this.findByMany([{'gender':gender},{'active': true},{'reserved': false}]);

    if(month == 1){
      year = year-1;
      month = 11;
    }

    this.logger.debug(`Looking for ${gender} -- ${year} -- ${month}`);

    const historyLastMonth = this.participantHistoryService.findByYearMonth(year, month-2);

    return participantsObs.pipe(mergeMap(candidates => {
      return historyLastMonth.pipe(map(history =>{
        return candidates.filter(ca => {
          return null == history.find(h => h.participantId === ca.id)
        })
      }))
    }));
  }

}
