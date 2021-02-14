/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Participant, Room, ScheduleResponseType, Week } from '@smm/schedule/schedule.response.type';
import { RegistryDataService } from '@smm/registry/registry.data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgramsService } from '@smm/programs/programs.service';
import { EventBus } from '@nestjs/cqrs';

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

    return programObs.pipe(map(input => {

      const response = new ScheduleResponseType();
      response.weeks = [];
      response.success = false;
      response.programId = input.id;
      response.name = `smm-${input.month}/${input.year}`;

      for (let w of input.weeks) {
        let week: Week = { date: w.date, rooms: [] };
        let mainRoom: Room = { roomId: 'MAIN_ROOM', participants: [] };

        for (let t of w.tasks) {
          let newParticipantMain: Participant = {
            gender: t.gender,
            task: t.name,
            exercise: t.exercise,
            mainName: '[SELECT A MAIN PARTICIPANT]',
          };

          if (t.paired) {
            newParticipantMain.helperName = '[SELECT THE HELPER]';
          }

          mainRoom.participants.push(newParticipantMain);
        }
        week.rooms.push(mainRoom);
        response.weeks.push(week);
      }

      response.success = true;
      return response;

    }));
  }
}
