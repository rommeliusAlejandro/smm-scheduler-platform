/**
 * @author Rommel Loayza
 */
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleRequestType {

  @ApiProperty()
  programId: string;

}
