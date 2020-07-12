/**
 * @author Rommel Loayza
 */
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseType {

  @ApiProperty()
  success: boolean;

  @ApiProperty({type: () => Week})
  weeks: Week[];
}


export class Week {

  @ApiProperty()
  date: string;

  @ApiProperty({type: () => Room})
  rooms: Room[];
}

export class Room {

  @ApiProperty()
  roomId: string;

  @ApiProperty({type: () => Participant})
  participant: Participant[];
}

export class Participant {

  @ApiProperty()
  mainName?: string;

  @ApiProperty()
  helperName?: string;

  @ApiProperty()
  task: string;

  @ApiProperty()
  exercise: number;
}
