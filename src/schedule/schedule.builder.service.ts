/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Participant, Room, ScheduleResponseType, Week } from '@smm/schedule/schedule.response.type';
import { RegistryDataService } from '@smm/registry/registry.data.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { shuffle } from '@smm/framework/arrays/suffle.array';
import { ProgramsService } from '@smm/programs/programs.service';
import { EventBus } from '@nestjs/cqrs';
import { ParticipantReservedEvent } from '@smm/events/participant.reserved.event';

@Injectable()
export class ScheduleBuilderService {

  @Inject()
  private readonly registryService: RegistryDataService;

  @Inject()
  private readonly programsService: ProgramsService;

  @Inject()
  private readonly eventBus: EventBus;

  createSchedule(programId: string, month: number): Observable<ScheduleResponseType> {

    const programObs = this.programsService.findById(programId);

    return programObs.pipe(switchMap(input => {

      return this.registryService.findMonthCandidates(month)
        .pipe(map((monthCandidates) => {
          monthCandidates = shuffle(monthCandidates);
          const response = new ScheduleResponseType();
          response.weeks = [];
          response.success = false;
          response.programId = input.id;
          response.name = `smm-${input.month}/${input.year}`;

          for (let w of input.weeks) {
            let week: Week = { date: w.date, rooms: [] };
            let mainRoom: Room = { roomId: 'MAIN_ROOM', participants: [] };
            //let auxRoom: Room = { roomId: 'AUX_ROOM_1', participant: [] };

            for (let t of w.tasks) {
              let gender = monthCandidates.filter(candidate => candidate.gender === t.gender);

              if (2 > gender.length) {
                throw new Error(`Not enough participants for ${t.name} - ${w.date}`);
              }

              let newParticipantMain: Participant = { task: t.name, exercise: t.exercise };
              //let newParticipantAux: Participant = { task: t.name, exercise: t.exercise };

              Logger.debug(w.date);
              if (4 > gender.length && t.paired) {
                throw new Error(`Not enough participants for ${t.name} - ${w.date}`);
              }
              let main1 = gender[0];
              let main2 = gender[1];

              monthCandidates = monthCandidates.filter(candidate => candidate.name != main1.name && candidate.name != main2.name);

              newParticipantMain.mainName = main1.name;
              newParticipantMain.mainId = main1.id;
              this.eventBus.publish(new ParticipantReservedEvent(main1.id, w.date, mainRoom.roomId));
              //newParticipantAux.mainName = main2.name;

              if (t.paired) {
                newParticipantMain.helperName = gender[2].name;
                newParticipantMain.helperId = gender[2].id;
                this.eventBus.publish(new ParticipantReservedEvent(gender[2].id, w.date, mainRoom.roomId));
                //newParticipantAux.helperName = gender[3].name;

                monthCandidates = monthCandidates.filter(candidate => candidate.name != gender[2].name && candidate.name != gender[3].name);
              }
              mainRoom.participants.push(newParticipantMain);
              //auxRoom.participant.push(newParticipantAux);
            }

            week.rooms.push(mainRoom);
            response.weeks.push(week);
          }

          response.success = true;
          return response;
        })
        );
    }));
  }
}
