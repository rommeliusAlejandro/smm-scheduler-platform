import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


/**
 * @author Rommel Loayza
 */


export type MonthlyProgramDocument = MonthlyProgram & Document;

export class Participant {
  task: string;
  exercise: number;
  mainName: string;
  helperName: string;
}

export class Room {
  roomId: string;
  participants: Participant[];
}

export class Week {
  date: string;
  rooms: Room[];
}

@Schema()
export class MonthlyProgram {

  @Prop({required: true})
  id: string;

  @Prop({type: Week})
  weeks: Week[];

  @Prop({required: true})
  status: string;

}

export const MonthlyProgramSchema = SchemaFactory.createForClass(MonthlyProgram);
