/**
 * @author Rommel Loayza
 */
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

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

  @ApiProperty()
  room: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  task: string;

  @ApiProperty()
  monthlyProgramId: string;
}
