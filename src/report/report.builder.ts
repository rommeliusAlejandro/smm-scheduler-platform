import * as xl from 'excel4node';

/**
 * @author Rommel Loayza
 */
import { Injectable, Logger } from '@nestjs/common';
import { ScheduleResponseType } from '@smm/schedule/schedule.response.type';
import { formatDateToSpanish, ReportFormats } from '@smm/report/report.formats';

@Injectable()
export class ReportBuilder {

  //TODO: Improve this shitty code
  build(schedule: ScheduleResponseType, month: number) {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');

    var participant = wb.createStyle({
      font: {
        size: 12,
      },
      border: {
        left: { style: 'thin', color: 'black' },
        right: { style: 'thin', color: 'black' },
        top: { style: 'thin', color: 'black' },
        bottom: { style: 'thin', color: 'black' },
      }
    });

    var label = wb.createStyle({
      font: {
        bold: true,
        size: 12,
      }
    });

    var date = wb.createStyle({
      font: {
        bold: true,
        size: 12,
      },
      alignment: {
        horizontal: 'right'
      }
    });

    let pivot = 1;
    for (let week of schedule.weeks) {
      ws.cell(pivot, 1).string(formatDateToSpanish(week.date)).style(date);

      let rCool = 1;
      let effectiveParticipants = 0;
      for (let room of week.rooms) {
        ws.cell(pivot + 1, rCool).string(ReportFormats[room.roomId]).style(label);
        let pRow = pivot + 2;

        for (let task of room.participant) {
          ws.cell(pRow, rCool).string(ReportFormats[task.task]).style(participant);
          ws.cell(pRow, rCool + 1).string(task.mainName).style(participant);
          ws.cell(pRow, rCool + 2).number(task.exercise).style(participant);
          pRow++;
          effectiveParticipants++;

          if(task.helperName) {
            ws.cell(pRow, rCool).string(ReportFormats.HELPER).style(participant);
            ws.cell(pRow, rCool + 1).string(task.helperName).style(participant);
            ws.cell(pRow, rCool + 2).string(" ").style(participant);
            pRow++;
            effectiveParticipants++;
          }
        }
        rCool += 4;
      }

      pivot += (effectiveParticipants/week.rooms.length) + 3;
    }

    wb.write(`${month}.xlsx`);
  }


}
