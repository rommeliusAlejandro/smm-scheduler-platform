/**
 * @author Rommel Loayza
 */
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { ParticipantHistory, ParticipantHistoryDocument } from '@smm/participants/schemas/participant-history.schema';
import { AppLogger } from '@smm/framework/logger/app.logger';
import { MonthlyProgramsService } from '@smm/monthly-programs/monthly-programs.service';
import { MonthlyProgram } from '@smm/monthly-programs/schemas/monthly-program.schema';

@Injectable()
export class ParticipantsHistoryService {

  private readonly logger = AppLogger.getInstance(ParticipantsHistoryService.name);

  @Inject()
  private readonly monthlyProgramsService: MonthlyProgramsService;

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
      .sort({'date': -1})
      .exec(),
    );
  }

  findByYearMonth(year: number, month: number): Observable<ParticipantHistory[]> {

    return from(this.participantHistoryModel.find()
      .and([
        {
          'year': year,
        },
        {
          'monthNumber': month,
        },
      ]).exec(),
    );
  }

  findByYear(year: number): Observable<ParticipantHistory[]> {

    return from(this.participantHistoryModel.find()
      .and([
        {
          'year': year,
        }
      ])
      .sort({'date': 'asc'})
        .exec(),
    );
  }

  refreshHistory(): Observable<ParticipantHistory[]> {
    return from(this.participantHistoryModel.deleteMany({})).pipe(
      switchMap(() => {
        return this.monthlyProgramsService.findAll();
      }),
      map((monthlyPrograms: MonthlyProgram[]) => {
        const history: ParticipantHistory[] = [];
        monthlyPrograms.map(program => {
          program.weeks.map(week => {
            week.rooms.map(room => {
              room.participants.map(assignment => {
                history.push({
                  id: uuidv4(),
                  room: room.roomId,
                  date: new Date(week.date),
                  participantId: assignment.mainId,
                  monthlyProgramId: program.id,
                  year: new Date(week.date).getFullYear(),
                  monthNumber: new Date(week.date).getMonth()
                });

                history.push({
                  id: uuidv4(),
                  room: room.roomId,
                  date: new Date(week.date),
                  participantId: assignment.helperId,
                  monthlyProgramId: program.id,
                  year: new Date(week.date).getFullYear(),
                  monthNumber: new Date(week.date).getMonth()
                });
              })
            });
          });
        });

        return history;

      }),
      switchMap((history: ParticipantHistory[]) => {
        return from(history).pipe(
          mergeMap(history => {
            return this.create(history);
          })
        );
      }),
      toArray(),
      map((history: ParticipantHistory[]) => {
        return history;
      })
    );
  }
}
