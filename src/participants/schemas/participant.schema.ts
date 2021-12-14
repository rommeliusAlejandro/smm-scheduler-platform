import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


/**
 * @author Rommel Loayza
 */

export type ParticipantDocument = Participant & Document

export class History {
  date: Date;
  room: string;
}

@Schema()
export class Participant {

  @Prop({required: true})
  id: string;

  @Prop()
  name: string;

  @Prop()
  gender: string;

  @Prop()
  active: boolean;

  @Prop({type: History})
  history: History[];

  @Prop()
  age: string;

  @Prop()
  skills: string[];

  @Prop()
  reserved: boolean;

  last?: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);


