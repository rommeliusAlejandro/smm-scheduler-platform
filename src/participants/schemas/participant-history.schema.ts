import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


/**
 * @author Rommel Loayza
 */

export type ParticipantHistoryDocument = ParticipantHistory & Document

@Schema()
export class ParticipantHistory {

  @Prop({required: true})
  id: string;

  @Prop()
  participantId: string;

  @Prop()
  room: string;

  @Prop()
  date: Date;

  @Prop()
  monthNumber: number;

  @Prop()
  year: number;

  @Prop()
  monthlyProgramId: string;
}

export const ParticipantHistorySchema = SchemaFactory.createForClass(ParticipantHistory);


