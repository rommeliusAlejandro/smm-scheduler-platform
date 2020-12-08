/**
 * @author Rommel Loayza
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonthlyProgram, MonthlyProgramSchema } from '@smm/monthly-programs/schemas/monthly-program.schema';
import { MonthlyProgramsController } from '@smm/monthly-programs/monthly-programs.controller';
import { MonthlyProgramsService } from '@smm/monthly-programs/monthly-programs.service';

@Module({
  providers: [
    MonthlyProgramsService
  ],
  controllers: [
    MonthlyProgramsController
  ],
  exports: [
    MonthlyProgramsService
  ],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: MonthlyProgram.name, schema: MonthlyProgramSchema
        }
      ]
    )
  ]
})
export class MonthlyProgramsModule {

}
