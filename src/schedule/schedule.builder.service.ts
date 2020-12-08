/**
 * @author Rommel Loayza
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Participant, Room, ScheduleResponseType, Week } from '@smm/schedule/schedule.response.type';
import { RegistryDataService } from '@smm/registry/registry.data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { shuffle } from '@smm/framework/arrays/suffle.array';
import { ProgramsService } from '@smm/programs/programs.service';

@Injectable()
export class ScheduleBuilderService {

  @Inject()
  private readonly registryService: RegistryDataService;

  @Inject()
  private readonly programsService: ProgramsService;

  createSchedule(programId: string, month: number): Observable<ScheduleResponseType> {

    const programObs = this.programsService.findById(programId);

    return programObs.pipe(map(input => {

      let monthCandidates = this.registryService.findMonthCandidates(month);
      monthCandidates = shuffle(monthCandidates);
      const response = new ScheduleResponseType();
      response.weeks = [];
      response.success = false;
      Logger.debug(monthCandidates);
      for (let w of input.weeks) {
        let week: Week = { date: w.date, rooms: [] };
        let mainRoom: Room = { roomId: 'MAIN_ROOM', participants: [] };
        //let auxRoom: Room = { roomId: 'AUX_ROOM_1', participant: [] };

        for (let t of w.tasks) {
          let gender = monthCandidates.filter(candidate => candidate.gender === t.gender);

          if(2 > gender.length) {
            throw new Error(`Not enough participants for ${t.name} - ${w.date}`);
          }

          let newParticipantMain: Participant = { task: t.name, exercise: t.exercise };
          //let newParticipantAux: Participant = { task: t.name, exercise: t.exercise };

          if (4 > gender.length && t.paired) {
            throw new Error(`Not enough participants for ${t.name} - ${w.date}`);
          }
          let main1 = gender[0];
          let main2 = gender[1];

          monthCandidates = monthCandidates.filter(candidate => candidate.name != main1.name && candidate.name != main2.name);

          newParticipantMain.mainName = main1.name;
          //newParticipantAux.mainName = main2.name;

          if (t.paired) {
            newParticipantMain.helperName = gender[2].name;
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
    }));
  }
}
