/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ScheduleRequestType } from '@smm/schedule/schedule.request.type';
import { Participant, Room, ScheduleResponseType, Week } from '@smm/schedule/schedule.response.type';
import { RegistryDataService } from '@smm/registry/registry.data.service';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class ScheduleBuilderService {

  @Inject()
  private readonly registryService: RegistryDataService;

  createSchedule(input: ScheduleRequestType, month: number): Observable<ScheduleResponseType> {

    let monthCandidates = this.registryService.findMonthCandidates(month);
    const response = new ScheduleResponseType();
    response.weeks = [];
    response.success = false;

    for (let w of input.weeks) {
      let week: Week = { date: w.date, rooms: [] };
      let mainRoom: Room = { roomId: 'MAIN_ROOM', participant: [] };
      let auxRoom: Room = { roomId: 'AUX_ROOM_1', participant: [] };

      for (let t of w.tasks) {
        let gender = monthCandidates.filter(candidate => candidate.gender === t.gender);

        if(2 > gender.length) {
          throw new Error(`Not enough participants for ${t.name} - ${w.date}`);
        }

        let newParticipantMain: Participant = { task: t.name, exercise: t.exercise };
        let newParticipantAux: Participant = { task: t.name, exercise: t.exercise };

        if (4 > gender.length && t.paired) {
          throw new Error(`Not enough participants for ${t.name} - ${w.date}`);
        }
        let main1 = gender[0];
        let main2 = gender[1];

        monthCandidates = monthCandidates.filter(candidate => candidate.name != main1.name && candidate.name != main2.name);

        newParticipantMain.mainName = main1.name;
        newParticipantAux.mainName = main2.name;

        if (t.paired) {
          newParticipantMain.helperName = gender[2].name;
          newParticipantAux.helperName = gender[3].name;

          monthCandidates = monthCandidates.filter(candidate => candidate.name != gender[2].name && candidate.name != gender[3].name);
        }
        mainRoom.participant.push(newParticipantMain);
        auxRoom.participant.push(newParticipantAux);
      }

      week.rooms.push(mainRoom, auxRoom);
      response.weeks.push(week);
    }

    response.success = true;
    return of(response);
  }
}
