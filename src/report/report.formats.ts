import * as moment from 'moment';
/**
 * @author Rommel Loayza
 */
export enum ReportFormats {
  HELPER = 'Ayudante',
  DATE = 'Fecha',
  READING = 'Lectura',
  FIRST_TALK = 'Primera Conversacion',
  FIRST_VISIT = 'Revisita',
  SECOND_VISIT = 'Segunda Revisita',
  BIBLICAL_CLASS = 'Curso Biblico',
  SPEECH = 'Discurso',
  OTHER = 'Otro',
  MAIN_ROOM = 'Primera Sala',
  SECOND_ROOM = 'Segunda Sala'
}

export function formatDateToSpanish(date: string): string {
  return moment(date).format('DD-MM-YYYY');
}
