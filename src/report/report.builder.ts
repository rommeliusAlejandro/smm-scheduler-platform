import * as xl from 'excel4node';

/**
 * @author Rommel Loayza
 */
import { Injectable } from '@nestjs/common';
import { ScheduleResponseType } from '@smm/schedule/schedule.response.type';
import { formatDateToSpanish, ReportFormats } from '@smm/report/report.formats';

@Injectable()
export class ReportBuilder {

  //TODO: Improve this shitty code
  build(schedule: ScheduleResponseType, month: number) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Sheet 1');

    const participant = wb.createStyle({
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

    const label = wb.createStyle({
      font: {
        bold: true,
        size: 12,
      }
    });

    const date = wb.createStyle({
      font: {
        bold: true,
        size: 12,
      },
      alignment: {
        horizontal: 'right'
      }
    });

    let pivot = 1;
    let maxMainNameLength = 0;
    let maxHelperNameLength = 0;
    for (const week of schedule.weeks) {
      ws.cell(pivot, 1).string(formatDateToSpanish(week.date)).style(date);

      let rCool = 1;
      let effectiveParticipants = 0;
      for (const room of week.rooms) {
        ws.cell(pivot + 1, rCool).string(ReportFormats[room.roomId]).style(label);
        let pRow = pivot + 2;

        for (const task of room.participants) {
          ws.cell(pRow, rCool).string(ReportFormats[task.task]).style(participant);
          ws.cell(pRow, rCool + 1).string(task.mainName).style(participant);
          ws.cell(pRow, rCool + 2).number(task.exercise).style(participant);
          pRow++;
          effectiveParticipants++;

          if(task.mainName.length > maxMainNameLength) {
            maxMainNameLength = task.mainName.length;
          }

          if(task.helperName) {
            ws.cell(pRow, rCool).string(ReportFormats.HELPER).style(participant);
            ws.cell(pRow, rCool + 1).string(task.helperName).style(participant);
            ws.cell(pRow, rCool + 2).string(" ").style(participant);
            pRow++;
            effectiveParticipants++;

            if(task.helperName.length > maxHelperNameLength) {
              maxHelperNameLength = task.helperName.length;
            }
          }
        }
        rCool += 4;
      }

      pivot += (effectiveParticipants/week.rooms.length) + 3;
    }
    ws.column(2).setWidth(maxMainNameLength+2);
    ws.column(6).setWidth(maxHelperNameLength+2);

    ws.column(1).setWidth(22);
    ws.column(5).setWidth(22);

    wb.write(`${month}.xlsx`);
  }


}
