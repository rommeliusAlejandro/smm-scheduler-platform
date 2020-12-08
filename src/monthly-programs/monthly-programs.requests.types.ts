import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @author Rommel Loayza
 */

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

export class UpdateMonthlyProgramRequest {
  @ApiProperty({type: [Week]})
  weeks: Week[];

}
