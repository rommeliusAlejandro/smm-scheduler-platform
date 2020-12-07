/**
 * @author Rommel Loayza
 */
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantRequest {

  @ApiProperty()
  name: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  age: string;

  @ApiProperty()
  skills: string[];

  @ApiProperty()
  active: boolean;
}

export class UpdateParticipantRequests {

  @ApiProperty()
  attributes: {[key: string]: string | boolean};
}

export class LogHistoryRequest {
  date: Date;
  room: string;
}
