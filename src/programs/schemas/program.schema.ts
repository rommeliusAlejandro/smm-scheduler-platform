/**
 * @author Rommel Loayza
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgramDocument = Program & Document;

export class Task {
  name: string;
  exercise: number;
  gender: string;
  paired: boolean;
}

export class Week {
  tasks: Task[];
  date: string;
}

@Schema()
export class Program {

  @Prop({ required: true })
  id: string;

  @Prop({ type: Week, required: true })
  weeks: Week[];

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  month: number;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
