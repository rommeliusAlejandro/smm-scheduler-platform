import { ApiProperty } from '@nestjs/swagger';

/**
 * @author Rommel Loayza
 */

export class NewProgramRequest {
  @ApiProperty({ type: () => [WeekProgram]})
  weeks: WeekProgram[];

  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

}

export class WeekProgram {

  @ApiProperty({ type: () => [WeekTask]})
  tasks: WeekTask[];

  @ApiProperty()
  date: string;


}

export class WeekTask {
  @ApiProperty()
  name: string;

  @ApiProperty()
  exercise: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  paired: boolean;
}

export class UpdateProgramRequest {
  @ApiProperty()
  attributes: {
    weeks: WeekTask,
    month: number,
    year: number
  }
}
