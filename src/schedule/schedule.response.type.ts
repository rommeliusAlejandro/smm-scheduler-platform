/**
 * @author Rommel Loayza
 */
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponseType {

  @ApiProperty()
  success: boolean;

  @ApiProperty({type: () => Week})
  weeks: Week[];

  name: string;

  programId: string;
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
  participants: Participant[];
}

export class Participant {

  @ApiProperty()
  mainName?: string;

  mainId?: string;

  @ApiProperty()
  helperName?: string;

  helperId?: string;

  @ApiProperty()
  task: string;

  @ApiProperty()
  exercise: number;
}
