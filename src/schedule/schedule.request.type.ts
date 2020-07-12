/**
 * @author Rommel Loayza
 */
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleRequestType {

  @ApiProperty({ type: () => [WeekSchedule]})
  weeks: WeekSchedule[];

}

export class WeekSchedule {

  @ApiProperty({ type: () => [ScheduleTask]})
  tasks: ScheduleTask[];

  @ApiProperty()
  date: string;


}

export class ScheduleTask {
  @ApiProperty()
  name: string;

  @ApiProperty()
  exercise: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  paired: boolean;
}
