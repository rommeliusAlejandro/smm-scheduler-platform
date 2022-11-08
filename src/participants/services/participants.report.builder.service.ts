import { Injectable } from '@nestjs/common';
import { Participant } from '@smm/participants/schemas/participant.schema';
import * as xl from 'excel4node';
import { ParticipantHistory } from '@smm/participants/schemas/participant-history.schema';
import { formatDateToSpanish } from '@smm/report/report.formats';

@Injectable()
export class ParticipantsReportBuilderService {

  build(participants: Participant[], participantHistory: ParticipantHistory[]) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Participantes');

    const participantStyle = wb.createStyle({
      font: {
        size: 12,
      },
      border: {
        bottom: { style: 'thin', color: 'black' },
      },
    });

    const headerStyle = wb.createStyle({
      font: {
        bold: true,
        size: 12,
      },
      border: {
        bottom: { style: 'thin', color: 'black' },
      }
    });

    const dateStyle = wb.createStyle({
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '008000'
      },
      border: {
        left: { style: 'thin', color: 'green' },
        right: { style: 'thin', color: 'green' },
        top: { style: 'thin', color: 'green' },
        bottom: { style: 'thin', color: 'green' },
      }
    });

    let maxName = 0;

    ws.cell(2, 1).string('#').style(headerStyle);
    ws.cell(2, 2).string('Nombre').style(headerStyle);

    const participantMap: Map<string, any> = new Map<string, any>();

    let dateColumn = 3;
    participantHistory.forEach((participantHistory: ParticipantHistory) => {
      const dateKey = participantHistory.date.toLocaleDateString();

      if(!participantMap.has(dateKey)) {

        participantMap.set(dateKey, {index: dateColumn, participants: []});
        dateColumn++;
      }

      const ind = participantMap.get(dateKey).index;
      const participantIds = participantMap.get(dateKey).participants;
      participantIds.push(participantHistory.participantId);
      participantMap.set(dateKey, {index: ind, participants: participantIds});

    });

    let indexDate = 1;
    participantMap.forEach( (value, key) => {
      ws.cell(1, indexDate+2).string(formatDateToSpanish(key)).style(headerStyle);
      indexDate++;
    });

    participants.forEach((participant, index) => {
      const rowNumber = index + 3;
      ws.cell(rowNumber, 1).number(rowNumber).style(participantStyle);
      ws.cell(rowNumber, 2).string(participant.name).style(participantStyle);

      const dates = [];
      participantMap.forEach(value => {
        const dateList = value.participants;
        if(dateList.includes(participant.id)) {
          dates.push(value.index);
        }
      });

      dates.forEach(d => {
        ws.cell(rowNumber, d).string(' ').style(dateStyle);
      });

      maxName = participant.name.length > maxName ? participant.name.length : maxName;
    });

    ws.column(1).setWidth(3);
    ws.column(2).setWidth(maxName + 2);
    wb.write(`Participantes-LasVillas.xlsx`);
  }

}
